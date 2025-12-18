import time
import numpy as np

class PTPClock:
    """
    IEEE 1588 Precision Time Protocol simulation.
    Simulates clock drift and offset correction.
    """
    
    def __init__(self, is_master: bool = True):
        self.is_master = is_master
        self.epoch = time.time_ns()
        self.crystal_frequency = 1e9  # 1 GHz nominal
        # Simulate hardware clock drift (parts per million)
        self.ppm_drift = np.random.uniform(-30, 30) if not is_master else 0.0
        self.offset_ns = 0
        
    def get_time(self) -> int:
        """Get current PTP time in nanoseconds."""
        elapsed = time.time_ns() - self.epoch
        # Apply simulated drift
        drift_factor = 1.0 + (self.ppm_drift / 1e6)
        
        return int(elapsed * drift_factor) + self.offset_ns + self.epoch
    
    def get_time_sec(self) -> float:
        """Get current PTP time in seconds."""
        return self.get_time() / 1e9
    
    def sync_with_master(self, master_time: int):
        """Synchronize slave clock with master time sample."""
        if self.is_master:
            return
            
        current_time = self.get_time()
        offset = master_time - current_time
        
        # Simple PI controller for smooth clock discipline
        # In a real PTP stack this is much more complex
        self.offset_ns += int(offset * 0.5)
