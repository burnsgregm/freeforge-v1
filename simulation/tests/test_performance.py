import time
import unittest
from src.core.orchestrator import SimulationOrchestrator

class TestPerformance(unittest.TestCase):
    def test_fps_stability(self):
        # This test ensures the loop runs at ~30 FPS
        # We'll just run a few iter and check time
        
        # Mock orchestrator behavior without threading for test
        orch = SimulationOrchestrator()
        
        start_time = time.time()
        frames = 30
        
        for i in range(frames):
            orch._generate_sensor_data()
            orch._detect_anomalies()
            time.sleep(1/30) # Simulate loop wait
            
        elapsed = time.time() - start_time
        fps = frames / elapsed
        
        print(f"Measured FPS: {fps}")
        self.assertTrue(25 < fps < 35, f"FPS {fps} out of range")

if __name__ == '__main__':
    unittest.main()
