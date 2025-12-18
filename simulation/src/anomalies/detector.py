from typing import List

class AnomalyDetector:
    def detect(self, entities: List[dict]) -> List[dict]:
        anomalies = []
        
        # 1. Check Crowd Compression
        # Radius check -> if many entities in small area
        
        # 2. Check Speed
        for e in entities:
             if abs(e.get('velocity', {}).get('x', 0)) > 10: # >10m/s
                 anomalies.append({
                     'id': f"SPEED_{e['id']}",
                     'type': 'KINETICS',
                     'headline': f"High Speed Detected: {e['id']}",
                     'severity': 'MEDIUM'
                 })
                 
        return anomalies
