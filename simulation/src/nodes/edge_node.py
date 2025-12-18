from typing import List, Dict, Any
import numpy as np
from .camera_simulator import CameraSimulator
from .lidar_simulator import LidarSimulator
from .imu_simulator import IMUSimulator

class EdgeNode:
    def __init__(self, node_id: str, position: np.ndarray, orientation: np.ndarray, sensors: dict, calibration: dict):
        self.node_id = node_id
        self.position = position
        self.orientation = orientation
        self.calibration = calibration
        self.last_camera_frame = None
        
        # Initialize Sensors
        self.camera = None
        if sensors.get('camera', {}).get('enabled'):
            cam_config = sensors['camera']
            self.camera = CameraSimulator(
                resolution=cam_config.get('resolution', {'width': 1920, 'height': 1080}),
                fps=cam_config.get('fps', 30),
                fov=cam_config.get('fov', 90)
            )
            
        self.lidar = None
        if sensors.get('lidar', {}).get('enabled'):
            lid_config = sensors['lidar']
            self.lidar = LidarSimulator(
                model=lid_config.get('model', 'VLP-16'),
                channels=lid_config.get('channels', 16),
                range_m=lid_config.get('range', 100)
            )
            
        self.imu = None
        if sensors.get('imu', {}).get('enabled'):
            self.imu = IMUSimulator(sample_rate=100)

    def generate_frame(self, entities: List[dict], timestamp: float) -> Dict[str, Any]:
        """Generate a synchronized frame from all enabled sensors."""
        frame = {
            'nodeId': self.node_id,
            'timestamp': timestamp,
            'sensors': {}
        }
        
        # Transform entities to node-local coordinates if needed
        # For now, simulators handle global entities
        
        if self.camera:
            image_data = self.camera.render(entities, timestamp)
            if image_data:
                frame['sensors']['camera'] = image_data # In real app, this would be a path or heavy blob
                self.last_camera_frame = image_data
        
        if self.lidar:
            point_cloud = self.lidar.scan(entities, timestamp)
            frame['sensors']['lidar'] = point_cloud # Numpy array
            
        if self.imu:
            imu_data = self.imu.read(timestamp, self.position) # Simplified IMU read
            frame['sensors']['imu'] = imu_data
            
        return frame
