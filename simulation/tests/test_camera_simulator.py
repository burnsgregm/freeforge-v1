import unittest
import numpy as np
from src.nodes.camera_simulator import CameraSimulator

class TestCameraSimulator(unittest.TestCase):
    def setUp(self):
        self.camera = CameraSimulator(
            resolution={'width': 1920, 'height': 1080},
            fps=30,
            fov=90
        )
    
    def test_render_returns_bytes_when_due(self):
        # Timestamp 0.0 -> should render
        # Timestamp 0.001 -> should NOT render (too soon for 30fps)
        
        entities = [{'id': 'E1', 'position': {'x': 0, 'y': 0, 'z': 5}}]
        
        # First frame
        frame1 = self.camera.render(entities, timestamp=1.0)
        self.assertIsNotNone(frame1)
        self.assertIsInstance(frame1, bytes)
        
        # Too soon
        frame2 = self.camera.render(entities, timestamp=1.01)
        self.assertIsNone(frame2)
        
        # Next frame due (approx 33ms later)
        frame3 = self.camera.render(entities, timestamp=1.04)
        self.assertIsNotNone(frame3)

if __name__ == '__main__':
    unittest.main()
