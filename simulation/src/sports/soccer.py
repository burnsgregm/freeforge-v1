import numpy as np
from typing import List, Dict
from ..core.scenario_manager import Scenario, Zone

class SoccerScenario(Scenario):
    """FIFA-style soccer simulation."""
    
    def __init__(self, config: dict = None):
        super().__init__()
        self.sport = 'SOCCER'
        
        # Field dimensions (Standard 105m x 68m)
        self.field_length = 105.0
        self.field_width = 68.0
        
        # Zones
        self.zones = [
            Zone(
                name='FIELD',
                bounds=(0, 0, self.field_length, self.field_width),
                area=self.field_length * self.field_width,
                type='FIELD'
            ),
             Zone(
                name='PENALTY_AREA_HOME',
                bounds=(0, self.field_width/2 - 20.15, 16.5, self.field_width/2 + 20.15),
                area=665.0, # Approx
                type='RESTRICTED'
            ),
             Zone(
                name='PENALTY_AREA_AWAY',
                bounds=(self.field_length - 16.5, self.field_width/2 - 20.15, self.field_length, self.field_width/2 + 20.15),
                area=665.0,
                type='RESTRICTED'
            )
        ]
        
    def initialize(self, entities: List[Dict]):
        # Home Team (11 players)
        for i in range(11):
            pos = self._get_formation_position('HOME', i)
            entities.append(self._create_player(f'HOME_{i+1}', 'HOME', pos, (255, 0, 0)))

        # Away Team (11 players)
        for i in range(11):
            pos = self._get_formation_position('AWAY', i)
            entities.append(self._create_player(f'AWAY_{i+1}', 'AWAY', pos, (0, 0, 255)))
            
        # Ball
        entities.append({
            'id': 'BALL', 'type': 'OBJECT', 
            'position': {'x': self.field_length/2, 'y': self.field_width/2, 'z': 0.11},
            'velocity': {'x': 0, 'y': 0, 'z': 0},
            'radius': 0.11, 'color': (255, 255, 255)
        })

    def update(self, entities: List[Dict], dt: float):
        # Very simple AI: chase ball
        ball = next((e for e in entities if e['id'] == 'BALL'), None)
        if not ball: return
        
        for e in entities:
            if e.get('role') == 'PLAYER':
                self._update_player(e, ball, dt)

    def _create_player(self, pid, team, pos, color):
        return {
            'id': pid, 'type': 'PERSON', 'role': 'PLAYER', 'team': team,
            'position': {'x': pos[0], 'y': pos[1], 'z': 0},
            'velocity': {'x': 0, 'y': 0, 'z': 0},
            'radius': 0.3, 'height': 1.8, 'color': color, 'behavior': 'soccer_player'
        }

    def _get_formation_position(self, team, index):
        # 4-4-2 Formation stub
        base_x = 10 if team == 'HOME' else self.field_length - 10
        direction = 1 if team == 'HOME' else -1
        
        if index == 0: # GK
            return (base_x, self.field_width/2)
        elif index < 5: # Defenders
            return (base_x + 15*direction, self.field_width * (index/5))
        elif index < 9: # Midfielders
            return (base_x + 35*direction, self.field_width * ((index-4)/5))
        else: # Forwards
            return (base_x + 55*direction, self.field_width * ((index-8)/3))

    def _update_player(self, player, ball, dt):
        # Determine if this player is closest to ball for their team
        # In a full sim, we'd check all teammates.
        # For efficiency here, we'll just check distance vs fixed threshold
        
        dx_ball = ball['position']['x'] - player['position']['x']
        dy_ball = ball['position']['y'] - player['position']['y']
        dist_ball = np.sqrt(dx_ball**2 + dy_ball**2)
        
        # Calculate formation target
        pid_parts = player['id'].split('_')
        idx = int(pid_parts[1]) - 1 if len(pid_parts) > 1 else 0
        form_pos = self._get_formation_position(player['team'], idx)
        
        # Formation force
        dx_form = form_pos[0] - player['position']['x']
        dy_form = form_pos[1] - player['position']['y']
        dist_form = np.sqrt(dx_form**2 + dy_form**2)
        
        # Logic: If close to ball (within 15m), chase ball. Else, hold formation.
        if dist_ball < 15.0:
            target_dx, target_dy, target_dist = dx_ball, dy_ball, dist_ball
            speed = 5.0 # Sprint
        else:
            target_dx, target_dy, target_dist = dx_form, dy_form, dist_form
            speed = 2.0 # Jog
            
        if target_dist > 0.5:
            player['velocity']['x'] = (target_dx / target_dist) * speed
            player['velocity']['y'] = (target_dy / target_dist) * speed
        else:
            player['velocity']['x'] = 0
            player['velocity']['y'] = 0
