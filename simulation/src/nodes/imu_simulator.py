import numpy as np

class IMUSimulator:
    def __init__(self, sample_rate: int):
        self.sample_rate = sample_rate
        self.accel_bias = np.random.normal(0, 0.01, 3)
        self.gyro_bias = np.random.normal(0, 0.001, 3)

    def sample(self, timestamp: float, motion: dict) -> dict:
        """
        Generate IMU reading based on actual motion.
        """
        true_accel = motion.get('acceleration', np.zeros(3))
        true_gyro = motion.get('angular_velocity', np.zeros(3))
        
        # Add noise and bias
        accel_noise = np.random.normal(0, 0.01, 3)
        gyro_noise = np.random.normal(0, 0.001, 3)
        
        accel = true_accel + self.accel_bias + accel_noise
        gyro = true_gyro + self.gyro_bias + gyro_noise
        
        # Add gravity (assuming z is up)
        accel[2] += 9.81
        
        return {
            'acceleration': accel.tolist(),
            'gyroscope': gyro.tolist(),
            'temperature': 45.0 + np.random.normal(0, 0.1)
        }
