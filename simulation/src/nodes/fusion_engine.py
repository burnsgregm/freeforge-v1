import numpy as np
from typing import List, Dict

class FusionEngine:
    """
    Fuses camera + LIDAR data at edge node.
    Core learning objective: demonstrates sensor fusion concepts.
    """
    
    def __init__(self, camera_matrix=None, lidar_to_camera_transform=None):
        # Defaults if not provided
        self.camera_matrix = camera_matrix if camera_matrix is not None else np.eye(3)
        self.transform = lidar_to_camera_transform if lidar_to_camera_transform is not None else np.eye(4)
        
    def _project_lidar_to_image(self, points):
        """Project 3D LIDAR points to 2D camera coordinates."""
        if len(points) == 0:
            return np.array([])
            
        # 1. Transform Lidar -> Camera frame
        # We assume standard Camera frame: X right, Y down, Z forward
        # Simple simulation hack: rotate points to align with camera Z
        # R_lidar_cam = np.array([[0, -1, 0], [0, 0, -1], [1, 0, 0]])
        # points_cam = points @ R_lidar_cam.T + np.array([0, 0, 0])
        
        # For simplicity in this demo, treat world X,Y as 'flat' image plane scaling
        focal_length = 1000
        
        u = focal_length * (points[:, 0] / (points[:, 1] + 1e-6)) + 960  # Center X
        v = focal_length * (points[:, 2] / (points[:, 1] + 1e-6)) + 540  # Center Y (Z is up in input, Y down in image)
        
        # Filter points behind camera (Y < 0)
        valid_mask = points[:, 1] > 0
        
        projected = np.zeros((len(points), 3))
        projected[:, 0] = u
        projected[:, 1] = v
        projected[:, 2] = valid_mask
        
        return projected

    def _iou(self, point, bbox):
        """Check if point is inside bbox."""
        x, y = point[0], point[1]
        x1, y1, x2, y2 = bbox
        return x1 <= x <= x2 and y1 <= y <= y2

    def fuse(self, camera_image, lidar_points, entities):
        """
        Perform fusion of camera and LIDAR data.
        Returns: List of detected entities with 3D positions derived from LIDAR clusters.
        """
        detections = []
        
        # 1. Project LIDAR points to camera image
        projected_points_2d = self._project_lidar_to_image(lidar_points[:, :3])
        
        # 2. Run 2D object detection (Simulated)
        bboxes = self._detect_objects_2d(camera_image, entities)
        
        # 3. Associate and Fuse
        for bbox_data in bboxes:
            bbox = bbox_data['bbox']
            
            # Find points inside this bbox
            points_inside_indices = []
            for i, pt in enumerate(projected_points_2d):
                if pt[2] > 0 and self._iou(pt, bbox): # Check validity and bounds
                    points_inside_indices.append(i)
            
            # Fuse: Compute centroid of associated LIDAR points
            if points_inside_indices:
                cluster = lidar_points[points_inside_indices]
                fused_pos = np.mean(cluster[:, :3], axis=0)
                confidence = 0.9 + (len(points_inside_indices) / 100.0) # More points = higher confidence
            else:
                # Fallback if no LIDAR hits (e.g. occlusion): use purely visual estimate or prior
                # For simulaton, fallback to entity truth + large noise
                target_entity = next((e for e in entities if e['id'] == bbox_data['entity_id']), None)
                if target_entity:
                    pos = target_entity['position']
                    fused_pos = np.array([pos['x'], pos['y'], pos['z']]) + np.random.normal(0, 0.5, 3)
                    confidence = 0.5
                else:
                    continue

            detections.append({
                'entityId': bbox_data['entity_id'],
                'position3d': fused_pos.tolist(),
                'velocity': [0, 0, 0], # Kalman filter would determine this over time
                'confidence': min(confidence, 1.0),
                'bbox2d': bbox
            })
        
        return detections

    def _detect_objects_2d(self, image, entities):
        """Simulate YOLO detection."""
        bboxes = []
        for entity in entities:
            # Simple manual projection for bounding box simulation
            pos = entity['position']
            # Scale world coords to 'pixel' coords roughly
            cx = 960 + (pos['x'] * 50) 
            cy = 540 - (pos['z'] * 50) 
            w, h = 60 / (pos['y']*0.1 + 1), 120 / (pos['y']*0.1 + 1)
            
            bboxes.append({
                'entity_id': entity['id'],
                'bbox': [cx - w/2, cy - h/2, cx + w/2, cy + h/2],
                'confidence': 0.95
            })
        return bboxes
