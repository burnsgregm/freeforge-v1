import numpy as np
import cv2
import time
from typing import List, Tuple, Optional

class CameraSimulator:
    def __init__(self, resolution: dict, fps: int, fov: float):
        self.width = resolution['width']
        self.height = resolution['height']
        self.fps = fps
        self.fov = fov
        self.last_frame_time = 0
        self.frame_interval = 1.0 / fps

    def render(self, entities: List[dict], timestamp: float) -> Optional[bytes]:
        """
        Render a frame if enough time has passed.
        Returns JPEG bytes or None.
        """
        # Simple frame rate control
        if timestamp - self.last_frame_time < self.frame_interval:
            return None
            
        self.last_frame_time = timestamp
        
        # Create blank image (dark gray background)
        image = np.full((self.height, self.width, 3), 30, dtype=np.uint8)
        
        # Draw entities (simplified 2D projection for now)
        for entity in entities:
             # Basic projection logic (placeholder)
             # In a real 3D sim, we'd use a projection matrix
             pos = entity.get('position', {'x':0, 'y':0, 'z':0})
             
             # Map x/y to screen coordinates (very rough approx)
             cx = int(self.width / 2 + pos['x'] * 50) 
             cy = int(self.height / 2 + pos['y'] * 50)
             
             if 0 <= cx < self.width and 0 <= cy < self.height:
                 cv2.circle(image, (cx, cy), 10, (0, 255, 0), -1)
                 cv2.putText(image, entity.get('id', '?'), (cx+15, cy), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

        # Add noise
        noise = np.random.normal(0, 5, image.shape).astype(np.uint8)
        image = cv2.add(image, noise)
        
        # Encode to JPEG
        _, encoded = cv2.imencode('.jpg', image, [cv2.IMWRITE_JPEG_QUALITY, 80])
        return encoded.tobytes()
