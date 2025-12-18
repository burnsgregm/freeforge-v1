import numpy as np
import random
from datetime import datetime

def generate_default_calibration():
    # Intrinsic (Camera)
    # 1920x1080, FOV ~90 deg
    fx = 1000
    fy = 1000
    cx = 960
    cy = 540
    camera_matrix = [
        [fx, 0, cx],
        [0, fy, cy],
        [0, 0, 1]
    ]
    
    # Extrinsic (Identity for now)
    rotation = np.eye(3).tolist()
    translation = [0, 0, 0]
    
    # Lidar to Camera (Example: Camera is 10cm above LIDAR)
    lidar_to_camera = np.eye(4)
    lidar_to_camera[1, 3] = -0.1 # y-axis translation
    
    # Realistic Values (Randomized)
    quality = 85 + random.uniform(-5, 10)  # 80-95% range
    
    return {
        'intrinsic': {
            'cameraMatrix': camera_matrix,
            'distortion': [0, 0, 0, 0, 0]
        },
        'extrinsic': {
            'rotationMatrix': rotation,
            'translationVector': translation
        },
        'lidarToCameraTransform': lidar_to_camera.tolist(),
        'calibrationQuality': round(quality, 1),
        'calibratedAt': datetime.now().isoformat(),
        'driftRate': round(random.uniform(0.1, 0.5), 3)
    }

def generate_realistic_calibration():
    """Deprecated: Logic merged into generate_default_calibration"""
    return generate_default_calibration()
