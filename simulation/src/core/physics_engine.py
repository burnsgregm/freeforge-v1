import numpy as np
from typing import List

class PhysicsEngine:
    def __init__(self):
        self.gravity = -9.81
        self.friction_coeff = 0.5

    def step(self, entities: List[dict], dt: float):
        """
        Update entity positions based on velocity and forces.
        """
        for entity in entities:
            # Simple Euler integration
            vel = np.array(entity.get('velocity', [0, 0, 0]), dtype=float)
            pos = np.array(entity.get('position', [0, 0, 0]), dtype=float)
            
            # Apply friction (damping)
            vel = vel * (1.0 - self.friction_coeff * dt)
            
            # Update position
            pos += vel * dt
            
            # Floor constraint (z >= 0)
            if pos[2] < 0:
                pos[2] = 0
                vel[2] = 0
            
            # Update entity state
            entity['position'] = {
                'x': float(pos[0]),
                'y': float(pos[1]),
                'z': float(pos[2])
            }
            entity['velocity'] = {
                'x': float(vel[0]),
                'y': float(vel[1]),
                'z': float(vel[2])
            }
