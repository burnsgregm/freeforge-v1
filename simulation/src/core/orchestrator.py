import os
import time
import threading
from typing import List, Optional, Dict
import numpy as np

from .physics_engine import PhysicsEngine
from .scenario_manager import ScenarioManager
from ..nodes.edge_node import EdgeNode
from ..anomalies.generator import AnomalyGenerator
from ..utils.ptp_sync import PTPClock

class SimulationOrchestrator:
    def __init__(self, config: dict):
        self.config = config
        self.running = False
        self.paused = False
        self.thread = None
        
        # Core components
        self.physics_engine = PhysicsEngine()
        self.scenario = None
        self.anomaly_generator = AnomalyGenerator()
        self.clock = PTPClock(is_master=True)
        
        # State
        self.nodes: List[EdgeNode] = []
        self.entities: List[Dict] = []
        self.current_time = 0.0
        self.frame_count = 0
        self.target_fps = 30
        self.actual_fps = 0.0
        
    def load_scenario(self, sport: str, config: dict):
        """Load sport-specific scenario."""
        self.scenario = ScenarioManager.create_scenario(sport, config)
        self.scenario.initialize(self.entities)
        print(f"Loaded scenario: {sport} with {len(self.entities)} entities")
        
    def add_node(self, node_config: dict) -> EdgeNode:
        """Add a sensor node to the simulation."""
        node = EdgeNode(
            node_id=node_config['nodeId'],
            position=np.array([
                node_config['position']['x'],
                node_config['position']['y'],
                node_config['position']['z']
            ]),
            orientation=np.array([
                node_config['orientation']['pitch'],
                node_config['orientation']['yaw'],
                node_config['orientation']['roll']
            ]),
            sensors=node_config['sensors'],
            calibration=node_config.get('calibration', {})
        )
        self.nodes.append(node)
        print(f"Added node: {node_config['nodeId']}")
        return node
        
    def start(self):
        """Start the simulation loop."""
        if self.running:
            return
            
        if not self.scenario:
            # Fallback for empty start
            try:
                self.load_scenario('BASKETBALL', {})
            except:
                print("Failed to load default scenario")
            
        self.running = True
        self.paused = False
        self.thread = threading.Thread(target=self._loop, daemon=True)
        self.thread.start()
        print("Simulation started")
        
    def stop(self):
        """Stop the simulation."""
        self.running = False
        if self.thread:
            self.thread.join()
        print("Simulation stopped")
        
    def pause(self):
        """Pause the simulation."""
        self.paused = True
        
    def resume(self):
        """Resume the simulation."""
        self.paused = False
        
    def _loop(self):
        """Main simulation loop - runs at 30 FPS."""
        target_dt = 1.0 / self.target_fps
        last_fps_check = time.time()
        fps_frame_count = 0
        
        while self.running:
            if self.paused:
                time.sleep(0.1)
                continue
                
            loop_start = time.time()
            
            # 1. Update simulation time (PTP clock)
            self.current_time = self.clock.get_time() / 1e9  # Convert ns to seconds
            
            # 2. Update entity behaviors (scenario-specific)
            if self.scenario:
                self.scenario.update(self.entities, target_dt)
            
            # 3. Update physics (entity movement)
            self.physics_engine.step(self.entities, target_dt)
            
            # 4. Generate sensor data from all nodes
            # For this MVP, we just generate generating logs or frames
            # Logic to publish via WebSocket would go here
            # 4. Generate sensor data from all nodes
            for node in self.nodes:
                # This updates internal buffers like last_camera_frame
                node.generate_frame(
                    entities=self.entities,
                    timestamp=self.current_time
                )
            
            # 5. Detect anomalies
            if self.scenario:
                anomalies = self.anomaly_generator.detect(
                    entities=self.entities,
                    scenario=self.scenario,
                    timestamp=self.current_time
                )
                for anomaly in anomalies:
                    self._publish_anomaly(anomaly)
            
            # 6. Update frame counter
            self.frame_count += 1
            fps_frame_count += 1
            
            # 7. Calculate actual FPS every second
            now = time.time()
            if now - last_fps_check >= 1.0:
                self.actual_fps = fps_frame_count / (now - last_fps_check)
                fps_frame_count = 0
                last_fps_check = now
                # print(f"Simulation FPS: {self.actual_fps:.1f} | Entities: {len(self.entities)}")
            
            # 8. Sleep to maintain frame rate
            elapsed = time.time() - loop_start
            if elapsed < target_dt:
                time.sleep(target_dt - elapsed)
                
            # Broadcast updates (Every 3 frames approx 10Hz)
            if self.frame_count % 3 == 0:
                self._publish_entities()

    def _publish_entities(self):
        """Send entity positions to API."""
        try:
            # Basic validation
            if not self.entities:
                return

            payload = {
                'sessionId': None, # TODO: Pass session ID if managed
                'stats': {
                    'fps': self.actual_fps,
                    'frame': self.frame_count,
                    'time': self.current_time
                },
                'sentAt': time.time(),
                'entities': [
                    {
                        'id': e.get('id'),
                        'type': e.get('type'),
                        'role': e.get('role'),
                        'team': e.get('team'),
                        'position': e.get('position'),
                        'velocity': e.get('velocity'),
                        'color': e.get('color'),
                        'radius': e.get('radius'),
                        'severity': e.get('severity')
                    }
                    for e in self.entities
                ]
            }
            
            # Fire and forget POST
            # Using threads or async here would be better for performance, 
            # but for this simulation loop strictness, a short timeout is acceptable logic 
            # if we assume local network.
            try:
                import requests
                api_url = os.getenv('API_URL', 'http://api:3001')
                response = requests.post(
                    f"{api_url}/internal/entity-update",
                    json=payload,
                    timeout=0.2 
                )
                if response.status_code != 200:
                    print(f"Warning: API returned status {response.status_code} for entity-update")
            except ImportError:
                print("requests module not found")
            except Exception as e:
                # print(f"Failed to publish entities: {e}")
                pass # Still suppress to avoid loop crash, but could log periodically
                
        except Exception as e:
            print(f"Error publishing entities: {e}")

    def _publish_anomaly(self, anomaly):
        """Publish detected anomaly."""
        try:
            import requests
            requests.post(
                f"{os.getenv('API_URL', 'http://api:3001')}/internal/anomaly",
                json={
                    'sessionId': None,
                    'anomaly': anomaly
                },
                timeout=0.1
            )
        except Exception as e:
            print(f"Failed to publish anomaly: {e}")

    def get_video_stream(self, node_id: str):
        """Generator for MJPEG stream from a specific node."""
        node = next((n for n in self.nodes if n.node_id == node_id), None)
        if not node:
            return

        while self.running:
            frame = node.last_camera_frame
            if frame:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            
            # rate limit to approx 30 fps to avoid busy loop
            time.sleep(0.033)


