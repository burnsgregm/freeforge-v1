import numpy as np
from typing import List, Dict
from ..core.scenario_manager import Scenario, Zone

class BasketballScenario(Scenario):
    """NBA-style basketball simulation."""
    
    def __init__(self, config: dict = None):
        super().__init__()
        self.sport = 'BASKETBALL'
        
        # Court dimensions (NBA standard in meters)
        self.court_length = 28.65
        self.court_width = 15.24
        
        # Zones
        self.zones = [
            Zone(
                name='COURT',
                bounds=self._court_bounds(),
                area=self.court_length * self.court_width,
                type='FIELD'
            ),
            Zone(
                name='HOME_BENCH',
                bounds=(0, 0, 5, 2),
                area=10,
                type='BENCH'
            ),
            Zone(
                name='AWAY_BENCH',
                bounds=(0, self.court_width - 2, 5, self.court_width),
                area=10,
                type='BENCH'
            ),
            Zone(
                name='PAINT_HOME',
                bounds=(0, self.court_width/2 - 2.44, 5.8, self.court_width/2 + 2.44),
                area=28.3,
                type='RESTRICTED'
            )
        ]
        
        self.crowd_count = config.get('crowdCount', 5000) if config else 5000
        
    def initialize(self, entities: List[Dict]):
        """Set up players, refs, ball, crowd."""
        
        # Home team (5 players)
        for i in range(5):
            pos = self._get_formation_position('HOME', i)
            entity = {
                'id': f'HOME_PLAYER_{i+1}',
                'type': 'PERSON',
                'role': 'PLAYER',
                'team': 'HOME',
                'position': {'x': pos[0], 'y': pos[1], 'z': 0.0},
                'velocity': {'x': 0.0, 'y': 0.0, 'z': 0.0},
                'radius': 0.3,
                'height': 2.0,
                'color': (255, 0, 0),  # Red
                'reflectance': 0.4,
                'behavior': 'basketball_player'
            }
            entities.append(entity)
        
        # Away team (5 players)
        for i in range(5):
            pos = self._get_formation_position('AWAY', i)
            entity = {
                'id': f'AWAY_PLAYER_{i+1}',
                'type': 'PERSON',
                'role': 'PLAYER',
                'team': 'AWAY',
                'position': {'x': pos[0], 'y': pos[1], 'z': 0.0},
                'velocity': {'x': 0.0, 'y': 0.0, 'z': 0.0},
                'radius': 0.3,
                'height': 2.0,
                'color': (0, 0, 255),  # Blue
                'reflectance': 0.4,
                'behavior': 'basketball_player'
            }
            entities.append(entity)
        
        # Referees (3)
        for i in range(3):
            entity = {
                'id': f'REF_{i+1}',
                'type': 'PERSON',
                'role': 'OFFICIAL',
                'position': {'x': self.court_length/2, 'y': self.court_width/2, 'z': 0.0},
                'velocity': {'x': 0.0, 'y': 0.0, 'z': 0.0},
                'radius': 0.3,
                'height': 1.8,
                'color': (128, 128, 128),  # Gray
                'reflectance': 0.4,
                'behavior': 'referee'
            }
            entities.append(entity)
        
        # Basketball
        entity = {
            'id': 'BALL',
            'type': 'OBJECT',
            'position': {'x': self.court_length/2, 'y': self.court_width/2, 'z': 1.5},
            'velocity': {'x': 0.0, 'y': 0.0, 'z': 0.0},
            'radius': 0.12,
            'color': (255, 165, 0),  # Orange
            'reflectance': 0.6
        }
        entities.append(entity)
        
        # Crowd (simplified - grouped entities)
        self._generate_crowd(entities, self.crowd_count)
        
        print(f"Basketball scenario initialized: {len(entities)} entities")
        
    def update(self, entities: List[Dict], dt: float):
        """Update entity behaviors each frame."""
        for entity in entities:
            behavior = entity.get('behavior')
            
            if behavior == 'basketball_player':
                self._update_player_behavior(entity, entities, dt)
            elif behavior == 'referee':
                self._update_referee_behavior(entity, entities, dt)
        
        # Update ball physics (bouncing, possession)
        self._update_ball(entities, dt)
        
    def _get_formation_position(self, team: str, index: int) -> tuple:
        """Get initial position for player in formation."""
        # Simple positioning - half court
        if team == 'HOME':
            x_base = self.court_length * 0.25
        else:
            x_base = self.court_length * 0.75
            
        # Spread players across court width
        y = (self.court_width / 6) * (index + 1)
        
        return (x_base, y)
        
    def _update_player_behavior(self, entity: Dict, all_entities: List[Dict], dt: float):
        """Basic basketball player AI."""
        # Find ball
        ball = next((e for e in all_entities if e['id'] == 'BALL'), None)
        if not ball:
            return
            
        # Move towards ball (simplified)
        dx = ball['position']['x'] - entity['position']['x']
        dy = ball['position']['y'] - entity['position']['y']
        dist = np.sqrt(dx**2 + dy**2)
        
        if dist > 0.5:  # Not at ball
            # Move towards ball
            speed = 3.0  # m/s
            entity['velocity']['x'] = (dx / dist) * speed
            entity['velocity']['y'] = (dy / dist) * speed
        else:
            # At ball - slow down
            entity['velocity']['x'] *= 0.5
            entity['velocity']['y'] *= 0.5
            
    def _update_referee_behavior(self, entity: Dict, all_entities: List[Dict], dt: float):
        """Referee follows play."""
        # Similar to player but slower
        ball = next((e for e in all_entities if e['id'] == 'BALL'), None)
        if ball:
            dx = ball['position']['x'] - entity['position']['x']
            dy = ball['position']['y'] - entity['position']['y']
            dist = np.sqrt(dx**2 + dy**2)
            
            if dist > 3.0:
                speed = 2.0
                entity['velocity']['x'] = (dx / dist) * speed
                entity['velocity']['y'] = (dy / dist) * speed
                
    def _update_ball(self, entities: List[Dict], dt: float):
        """Update ball physics."""
        ball = next((e for e in entities if e['id'] == 'BALL'), None)
        if not ball:
            return
            
        # Gravity
        ball['velocity']['z'] -= 9.81 * dt
        
        # Bounce on floor
        if ball['position']['z'] <= 0.12:  # Ball radius
            ball['position']['z'] = 0.12
            ball['velocity']['z'] = -ball['velocity']['z'] * 0.7  # Bounce with loss
            
    def _court_bounds(self) -> tuple:
        """Return (x_min, y_min, x_max, y_max)."""
        return (0, 0, self.court_length, self.court_width)
        
    def _generate_crowd(self, entities: List[Dict], count: int):
        """Generate crowd entities (simplified grouping)."""
        # Stands are outside court boundaries
        # Create grouped "crowd sections" rather than individual spectators
        num_sections = 8
        people_per_section = count // num_sections
        
        for i in range(num_sections):
            entity = {
                'id': f'CROWD_SECTION_{i+1}',
                'type': 'GROUP',
                'role': 'SPECTATOR',
                'count': people_per_section,
                'position': {
                    'x': np.random.uniform(-5, self.court_length + 5),
                    'y': np.random.uniform(-5, self.court_width + 5),
                    'z': 0.0
                },
                'velocity': {'x': 0.0, 'y': 0.0, 'z': 0.0},
                'radius': 2.0,  # Group radius
                'color': (100, 100, 200),
                'reflectance': 0.3
            }
            entities.append(entity)
