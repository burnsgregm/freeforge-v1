import numpy as np
from typing import List, Dict
from ..core.scenario_manager import Scenario, Zone

class CombatScenario(Scenario):
    """MMA/Boxing style simulation."""
    
    def __init__(self, config: dict = None):
        super().__init__()
        self.sport = 'COMBAT'
        self.ring_size = 9.0 # meters
        
        self.zones = [
            Zone(name='RING', bounds=(0,0,self.ring_size,self.ring_size), area=81, type='RING'),
            Zone(name='RINGSIDE', bounds=(-2,-2,self.ring_size+2,self.ring_size+2), area=150, type='RESTRICTED')
        ]

    def initialize(self, entities: List[Dict]):
        # Fighter 1
        entities.append({
            'id': 'FIGHTER_1', 'type': 'PERSON', 'role': 'FIGHTER',
            'position': {'x': self.ring_size/3, 'y': self.ring_size/2, 'z': 0},
            'velocity': {'x': 0, 'y': 0, 'z': 0},
            'radius': 0.4, 'height': 1.8, 'color': (255, 0, 0)
        })
        
        # Fighter 2
        entities.append({
            'id': 'FIGHTER_2', 'type': 'PERSON', 'role': 'FIGHTER',
            'position': {'x': self.ring_size*2/3, 'y': self.ring_size/2, 'z': 0},
            'velocity': {'x': 0, 'y': 0, 'z': 0},
            'radius': 0.4, 'height': 1.8, 'color': (0, 0, 255)
        })
        
        # Referee
        entities.append({
            'id': 'REF', 'type': 'PERSON', 'role': 'OFFICIAL',
            'position': {'x': self.ring_size/2, 'y': self.ring_size/4, 'z': 0},
            'velocity': {'x': 0, 'y': 0, 'z': 0},
            'radius': 0.3, 'height': 1.75, 'color': (200, 200, 200)
        })

    def update(self, entities: List[Dict], dt: float):
        f1 = next(e for e in entities if e['id'] == 'FIGHTER_1')
        f2 = next(e for e in entities if e['id'] == 'FIGHTER_2')
        
        # Circle each other
        center_x = (f1['position']['x'] + f2['position']['x']) / 2
        center_y = (f1['position']['y'] + f2['position']['y']) / 2
        
        for f in [f1, f2]:
            dx = center_x - f['position']['x']
            dy = center_y - f['position']['y']
            # Add orbit logic here... simplified
            f['velocity']['x'] += (np.random.rand()-0.5) * 2.0
            f['velocity']['y'] += (np.random.rand()-0.5) * 2.0
            
            # Keep in ring
            next_x = f['position']['x'] + f['velocity']['x'] * dt
            next_y = f['position']['y'] + f['velocity']['y'] * dt
            
            if next_x < 0 or next_x > self.ring_size:
                f['velocity']['x'] *= -1
            if next_y < 0 or next_y > self.ring_size:
                f['velocity']['y'] *= -1
