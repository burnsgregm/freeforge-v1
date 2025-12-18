# Task Checklist: Motion Intelligence Grid

- [x] **Phase 1: Foundation** <!-- id: 0 -->
    - [x] Initialize monorepo structure (client/server/simulation) <!-- id: 1 -->
    - [x] Set up Docker Compose for local development <!-- id: 2 -->
    - [x] Implement MongoDB schemas (Node, Session, Entity, Anomaly, SensorFrame) <!-- id: 3 -->
    - [x] Create Express API shell with JWT authentication <!-- id: 4 -->
    - [x] Initialize React application with routing and Tailwind CSS <!-- id: 5 -->
    - [x] Verify local stack (API, Frontend, Database, Redis) <!-- id: 6 -->

- [x] **Phase 2: Simulation Core** <!-- id: 7 -->
    - [x] Create Python simulation orchestrator <!-- id: 8 -->
    - [x] Implement PTP clock synchronization logic <!-- id: 9 -->
    - [x] Build Camera simulator (resolution, FPS, noise) <!-- id: 10 -->
    - [x] Build LIDAR simulator (raycasting, point cloud generation) <!-- id: 11 -->
    - [x] Build IMU simulator (accelerometer, gyroscope) <!-- id: 12 -->
    - [x] Implement basic Physics Engine for entity movement <!-- id: 13 -->

- [x] **Phase 3: Edge Fusion** <!-- id: 14 -->
    - [x] Implement Fusion Engine class <!-- id: 15 -->
    - [x] Create Camera-LIDAR calibration and transform logic <!-- id: 16 -->
    - [x] Implement simulated 2D object detection <!-- id: 17 -->
    - [x] Implement 3D position estimation from LIDAR+Camera <!-- id: 18 -->

- [x] **Phase 1: CRITICAL FIXES (Immediate Action)**
    - [x] Fix MongoDB Memory Mode bug in `database.ts`
    - [x] Register API routes in `server/src/index.ts`
    - [x] Initialize Orchestrator in `simulation/src/api/server.py`
    - [x] Implement WebSocket subscribe handlers in `frontend/src/services/websocket.ts`
    - [x] Add `SimulationClient` service for Node.js <-> Python bridge

- [x] **Phase 4: User Interface - Live View** <!-- id: 19 -->
    - [x] Set up Three.js scene and Entity meshes <!-- id: 20 -->
    - [x] Implement WebSocket client for real-time updates <!-- id: 21 -->
    - [x] Build Camera Grid component <!-- id: 22 -->
    - [x] Create Alert Panel for real-time anomalies <!-- id: 23 -->

- [x] **Phase 4: Frontend Gaps (High Priority)**
    - [x] Create `api.ts` client wrapper
    - [x] Create `SessionReplay` view (Timeline, Playback)
    - [x] Implement `MeshView3D` with proper Layers (Three.js)
    - [x] Implement Analytics Dashboard (Charts).ts`, `simulation.ts`, `analytics.ts`
    - [x] Implement full CRUD for `nodes` and `sessions` (PATCH, DELETE)
    - [x] Implement Socket.io emission events (`sensor:frame`, `anomaly:detected`)
    - [x] Create `Entity` model with tracking data
    - [x] Implement `FusionEngine` (LIDAR/Camera data merging)

- [x] **Phase 2: Simulation Completeness (High Priority)**
    - [x] Complete `Orchestrator` logic (physics, scenarios, clock)
    - [x] Implement `BasketballScenario` (Court, Players, Ball Physics)
    - [x] Implement `PTPClock` (IEEE 1588 simulation)
    - [x] Complete `AnomalyGenerator` (Crowd, Speed, Proximity logic)
    - [x] Implement `FusionEngine` (LIDAR/Camera data merging)

- [x] **Phase 5: Sports Scenarios** <!-- id: 24 -->
    - [x] Implement Basketball Scenario (court, players, behavior) <!-- id: 25 -->
    - [x] Implement Soccer Scenario (pitch, formations, crowd) <!-- id: 26 -->
    - [x] Implement Combat Sports Scenario (octagon, fighters) <!-- id: 27 -->

- [x] **Phase 6: Anomaly Detection** <!-- id: 28 -->
    - [x] Implement Anomaly Generator and Detector <!-- id: 29 -->
    - [x] Add logic for Crowd Compression, Speed Violations, Loitering <!-- id: 30 -->
    - [x] Implement "Rule of Three" logic <!-- id: 31 -->

- [x] **Phase 7: Session Management** <!-- id: 32 -->
    - [x] Implement Session Start/Stop/Record API <!-- id: 33 -->
    - [x] Create Session Replay UI with timeline scrubber <!-- id: 34 -->
    - [x] Implement data export functionality <!-- id: 35 -->

- [x] **Phase 8: Analytics & Admin** <!-- id: 36 -->
    - [x] Build Analytics Dashboard (Recharts) <!-- id: 37 -->
    - [x] Create Node Configuration and Topology UI <!-- id: 38 -->
    - [x] Implement Calibration Wizard <!-- id: 39 -->

- [x] **Phase 9: Polish & Optimization** <!-- id: 40 -->
    - [x] Optimize simulation loop performance <!-- id: 41 -->
    - [x] Polish UI/UX (animations, loading states) <!-- id: 42 -->
    - [x] Write documentation (API, User Guide) <!-- id: 43 -->

- [x] **Phase 10: Deployment** <!-- id: 44 -->
    - [x] Create Terraform configuration for GCP <!-- id: 45 -->
    - [x] Configure Cloud Build triggers <!-- id: 46 -->
    - [x] Deploy to Google Cloud Run <!-- id: 47 -->

- [x] **Phase 11: Demo Enhancements (v0.1)** <!-- id: 48 -->
    - [x] Create Dashboard with simulated charts <!-- id: 49 -->
    - [x] Create System Config with node management <!-- id: 50 -->
    - [x] Verify Frontend Build (and fixed Cloud Run ports) <!-- id: 51 -->

- [x] **Phase 12: UI Foundation (Enterprise Spec)** <!-- id: 52 -->
    - [x] Configure Tailwind Design System (Colors, Fonts) <!-- id: 53 -->
    - [x] Implement App Shell (Sidebar, TopBar) <!-- id: 54 -->
    - [x] Create Core Components (Badge, Button, Card, Modal) <!-- id: 55 -->

- [x] **Phase 13: Dashboard & System Config (v1.0)** <!-- id: 56 -->
    - [x] Implement Stadium Overview (Map, Zone Cards) <!-- id: 57 -->
    - [x] Implement Node Topology (3D Three.js View) <!-- id: 58 -->
    - [x] Implement Calibration Wizard UI <!-- id: 59 -->

- [x] **Phase 14: Live Intelligence & Analytics** <!-- id: 60 -->
    - [x] Enhance 3D Mesh (Layers, Trails, Social Radar) <!-- id: 61 -->
    - [x] Implement Layer Controls & Alert Feed <!-- id: 62 -->
    - [x] Integrate Camera Grid Overlay <!-- id: 63 -->

- [x] **Phase 15: Final Polish - Removing Placeholders** <!-- id: 64 -->
    - [x] Implement Dashboard Sparkline (Recharts) <!-- id: 65 -->
    - [x] Implement 3D Node Topology (Three.js) <!-- id: 66 -->
    - [x] Implement Simulated Video Feed (Canvas Animation) <!-- id: 67 -->
    - [x] Implement Calibration Wizard Logic <!-- id: 68 -->
