import numpy as np
from typing import List, Dict, Optional
import uuid
from datetime import datetime

class AnomalyGenerator:
    """
    Generates realistic anomalies based on entity behavior and scenario context.
    """
    
    def __init__(self):
        self.baselines = {}  # Zone -> baseline metrics
        self.anomaly_rate = 2.0  # anomalies per minute (configurable)
        self.last_anomaly_time = 0
        self.min_anomaly_interval = 5.0  # seconds between anomalies
        
    def detect(self, entities: List[Dict], scenario, timestamp: float) -> List[Dict]:
        """
        Check for anomalies based on entity behavior.
        Returns list of anomaly dicts.
        """
        anomalies = []
        
        # Update baselines
        self._update_baselines(entities, scenario)
        
        # 1. Crowd Compression (Geographics + Proxemics)
        for zone in scenario.zones:
            compression = self._check_crowd_compression(entities, zone, timestamp)
            if compression:
                anomalies.append(compression)
        
        # 2. Speed Violations (Kinetics)
        speed_anomalies = self._check_speed_anomalies(entities, timestamp)
        anomalies.extend(speed_anomalies)
        
        # 3. Loitering (Atmospherics)
        loitering = self._check_loitering(entities, timestamp)
        anomalies.extend(loitering)
        
        # 4. Restricted Zone Entry (Geographics)
        trespass = self._check_restricted_zones(entities, scenario, timestamp)
        anomalies.extend(trespass)
        
        # Apply Rule of Three
        anomalies = self._apply_rule_of_three(anomalies, timestamp)
        
        return anomalies
    
    def _check_crowd_compression(self, entities: List[Dict], zone, timestamp: float) -> Optional[Dict]:
        """Detect crowd compression/crush risk."""
        # Filter entities in this zone
        entities_in_zone = [
            e for e in entities 
            if self._entity_in_zone(e, zone)
        ]
        
        if not entities_in_zone:
            return None
        
        # Calculate density
        area = zone.area
        density = len(entities_in_zone) / area
        
        # Get baseline
        baseline_key = f"{zone.name}_density"
        baseline_density = self.baselines.get(baseline_key, 0.5)
        
        # Threshold: 2.5× baseline or >4 people/m² (crowd crush risk)
        threshold = max(baseline_density * 2.5, 4.0)
        
        if density > threshold:
            severity = 'CRITICAL' if density > 6.0 else 'HIGH'
            
            return {
                'anomalyId': f'ANOM_{uuid.uuid4().hex[:8]}',
                'type': 'GEOGRAPHICS',
                'subtype': 'CROWD_COMPRESSION',
                'severity': severity,
                'scenario': 'CRUSH',
                'headline': f'{zone.name} Crowd Compression Risk',
                'description': f'Density {density:.1f} people/m², {density/baseline_density:.1f}× baseline',
                'baselineText': f'Normal density: {baseline_density:.1f} people/m²',
                'anomalyText': f'Current density: {density:.1f} people/m² ({len(entities_in_zone)} in {area:.0f}m²)',
                'zone': zone.name,
                'location': zone.center if hasattr(zone, 'center') else {'x': 0, 'y': 0, 'z': 0},
                'entityIds': [e['id'] for e in entities_in_zone],
                'metrics': {
                    'baselineDelta': ((density / baseline_density) - 1) * 100,
                    'confidence': 0.95,
                    'riskScore': min(density * 15, 100)
                },
                'occurredAt': datetime.fromtimestamp(timestamp).isoformat(),
                'ruleOfThreeHit': False
            }
        
        return None
    
    def _check_speed_anomalies(self, entities: List[Dict], timestamp: float) -> List[Dict]:
        """Detect excessive speed violations."""
        anomalies = []
        
        for entity in entities:
            if entity.get('type') != 'PERSON':
                continue
                
            vel = entity.get('velocity', {'x': 0, 'y': 0, 'z': 0})
            speed = np.sqrt(vel['x']**2 + vel['y']**2)  # Horizontal speed
            
            # Thresholds based on role
            role = entity.get('role', 'SPECTATOR')
            if role == 'PLAYER':
                max_speed = 10.0  # m/s (fast sprinting)
            elif role == 'OFFICIAL':
                max_speed = 5.0   # m/s
            else:
                max_speed = 2.0   # m/s (walking speed for spectators)
            
            if speed > max_speed * 1.5:  # 1.5× threshold
                anomalies.append({
                    'anomalyId': f'ANOM_{uuid.uuid4().hex[:8]}',
                    'type': 'KINETICS',
                    'subtype': 'SPEED_VIOLATION',
                    'severity': 'MEDIUM',
                    'headline': f'Excessive Speed: {entity["id"]}',
                    'description': f'Entity moving at {speed:.1f} m/s, {(speed/max_speed):.1f}× expected',
                    'baselineText': f'Expected max speed: {max_speed:.1f} m/s for {role}',
                    'anomalyText': f'Current speed: {speed:.1f} m/s',
                    'zone': 'UNKNOWN',  # TODO: Determine zone from position
                    'location': entity['position'],
                    'entityIds': [entity['id']],
                    'metrics': {
                        'baselineDelta': ((speed / max_speed) - 1) * 100,
                        'confidence': 0.88,
                        'riskScore': min(speed * 8, 100)
                    },
                    'occurredAt': datetime.fromtimestamp(timestamp).isoformat(),
                    'ruleOfThreeHit': False
                })
        
        return anomalies
    
    def _check_loitering(self, entities: List[Dict], timestamp: float) -> List[Dict]:
        """Detect loitering patterns (entities staying in same small area for too long)."""
        anomalies = []
        
        # Initialize history if not present
        if not hasattr(self, 'position_history'):
            self.position_history = {} # entity_id -> list of (timestamp, pos)
            
        for entity in entities:
            if entity.get('type') != 'PERSON':
                continue
                
            eid = entity['id']
            pos = entity['position']
            
            # Update history
            if eid not in self.position_history:
                self.position_history[eid] = []
                
            self.position_history[eid].append((timestamp, pos))
            
            # Prune old history (> 60 seconds)
            cutoff = timestamp - 60.0
            self.position_history[eid] = [p for p in self.position_history[eid] if p[0] > cutoff]
            
            # Check for loitering if we have enough data (e.g. > 10 seconds)
            history = self.position_history[eid]
            if len(history) < 30: # Assuming ~3fps check rate, need 10s
                continue
                
            # Calculate bounding box of movement over last window
            xs = [p[1]['x'] for p in history]
            ys = [p[1]['y'] for p in history]
            
            if not xs or not ys:
                continue
                
            x_range = max(xs) - min(xs)
            y_range = max(ys) - min(ys)
            
            # If stayed within 3m box for > 15s (approx len check)
            if x_range < 3.0 and y_range < 3.0 and (history[-1][0] - history[0][0]) > 15.0:
                # Check if already flagged recently to avoid spam is hard without state, 
                # but Rule of Three handles clustering.
                
                anomalies.append({
                    'anomalyId': f'ANOM_{uuid.uuid4().hex[:8]}',
                    'type': 'ATMOSPHERICS',
                    'subtype': 'LOITERING',
                    'severity': 'LOW',
                    'headline': f'Loitering Detected: {eid}',
                    'description': f'Entity remained in 3m radius for > 15s',
                    'baselineText': 'Normal transit time: < 10s',
                    'anomalyText': f'Stationary duration: {history[-1][0] - history[0][0]:.1f}s',
                    'zone': 'UNKNOWN', 
                    'location': pos,
                    'entityIds': [eid],
                    'metrics': {
                        'baselineDelta': 50,
                        'confidence': 0.85,
                        'riskScore': 40
                    },
                    'occurredAt': datetime.fromtimestamp(timestamp).isoformat(),
                    'ruleOfThreeHit': False
                })
                
        return anomalies
    
    def _check_restricted_zones(self, entities: List[Dict], scenario, timestamp: float) -> List[Dict]:
        """Detect entities entering restricted zones."""
        anomalies = []
        
        restricted_zones = [z for z in scenario.zones if z.type == 'RESTRICTED']
        
        for zone in restricted_zones:
            for entity in entities:
                if entity.get('role') == 'PLAYER':
                    continue  # Players allowed in restricted zones
                    
                if self._entity_in_zone(entity, zone):
                    anomalies.append({
                        'anomalyId': f'ANOM_{uuid.uuid4().hex[:8]}',
                        'type': 'GEOGRAPHICS',
                        'subtype': 'RESTRICTED_ZONE_ENTRY',
                        'severity': 'HIGH',
                        'headline': f'Unauthorized Entry: {zone.name}',
                        'description': f'{entity["id"]} entered restricted zone',
                        'baselineText': f'Zone {zone.name} is restricted',
                        'anomalyText': f'{entity["role"]} entity detected in zone',
                        'zone': zone.name,
                        'location': entity['position'],
                        'entityIds': [entity['id']],
                        'metrics': {
                            'baselineDelta': 100,
                            'confidence': 0.92,
                            'riskScore': 75
                        },
                        'occurredAt': datetime.fromtimestamp(timestamp).isoformat(),
                        'ruleOfThreeHit': False
                    })
        
        return anomalies
    
    def _apply_rule_of_three(self, anomalies: List[Dict], timestamp: float) -> List[Dict]:
        """
        Apply Rule of Three: flag when 3+ independent anomaly types
        converge in same space-time.
        """
        # Group anomalies by proximity
        spatial_threshold = 10.0  # meters
        temporal_threshold = 30.0  # seconds
        
        groups = []
        for anomaly in anomalies:
            placed = False
            for group in groups:
                # Check if anomaly belongs to this group
                representative = group[0]
                
                # Spatial proximity
                loc1 = anomaly['location']
                loc2 = representative['location']
                dist = np.sqrt(
                    (loc1['x'] - loc2['x'])**2 + 
                    (loc1['y'] - loc2['y'])**2
                )
                
                # Temporal proximity
                time_diff = abs(
                    anomaly['occurredAt'].timestamp() - 
                    representative['occurredAt'].timestamp()
                )
                
                if dist < spatial_threshold and time_diff < temporal_threshold:
                    group.append(anomaly)
                    placed = True
                    break
            
            if not placed:
                groups.append([anomaly])
        
        # Check each group for Rule of Three
        for group in groups:
            distinct_types = set(a['type'] for a in group)
            
            if len(distinct_types) >= 3:
                # Mark all anomalies in group
                for anomaly in group:
                    anomaly['ruleOfThreeHit'] = True
                    anomaly['severity'] = 'CRITICAL'  # Escalate
                    anomaly['relatedAnomalies'] = [
                        a['anomalyId'] for a in group if a != anomaly
                    ]
        
        return anomalies
    
    def _update_baselines(self, entities: List[Dict], scenario):
        """Update baseline metrics using exponential moving average."""
        # TODO: Implement proper baseline learning
        # For now, use static baselines
        for zone in scenario.zones:
            baseline_key = f"{zone.name}_density"
            if baseline_key not in self.baselines:
                self.baselines[baseline_key] = 1.0  # 1 person/m² default
    
    def _entity_in_zone(self, entity: Dict, zone) -> bool:
        """Check if entity is inside zone bounds."""
        pos = entity['position']
        bounds = zone.bounds  # (x_min, y_min, x_max, y_max)
        
        return (
            bounds[0] <= pos['x'] <= bounds[2] and
            bounds[1] <= pos['y'] <= bounds[3]
        )
