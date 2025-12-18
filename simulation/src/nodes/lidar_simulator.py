import numpy as np
from typing import List, Tuple

class LidarSimulator:
    def __init__(self, model: str, channels: int, range_m: float):
        self.model = model
        self.channels = channels
        self.range = range_m
        self.points_per_second = 300000

    def scan(self, entities: List[dict], timestamp: float) -> np.ndarray:
        """
        Generate a point cloud.
        Returns numpy array of (x, y, z, intensity).
        """
        # Generate background points (ground plane)
        # Simplified: Grid of points
        x = np.linspace(-20, 20, 100)
        y = np.linspace(-20, 20, 100)
        X, Y = np.meshgrid(x, y)
        Z = np.zeros_like(X) # Ground is at z=0
        
        # Flatten
        ground_points = np.stack([X.flatten(), Y.flatten(), Z.flatten()], axis=1)
        
        entity_points = []
        for entity in entities:
            pos = entity.get('position', {'x':0, 'y':0, 'z':0})
            # Generate a cluster of points for the entity
            num_points = 50
            # Gaussian distribution around entity position
            ep = np.random.normal([pos['x'], pos['y'], pos['z']], 0.2, (num_points, 3))
            entity_points.append(ep)
            
        if entity_points:
            all_entity_points = np.vstack(entity_points)
            points = np.vstack([ground_points, all_entity_points])
        else:
            points = ground_points

        # Add intensity (random for now)
        intensities = np.random.rand(len(points), 1)
        
        return np.hstack([points, intensities]).astype(np.float32)
