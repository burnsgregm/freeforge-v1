# Implementation Plan - Motion Intelligence Grid

This plan outlines the steps to build the simulated Multi-Camera LIDAR Motion Intelligence System.

## User Review Required
> [!IMPORTANT]
> **Credentials**: Deployment to GCP requires `gcloud` authentication and project access. Please ensure `gcloud` is authenticated locally if you want me to run deployment commands, or provide a service account key.
> **Docker**: Ensure Docker Desktop is running.

# Implementation Plan - Motion Intelligence Grid Remediation

This plan addresses the critical gaps identified in the comprehensive review.

## Phase 1: Critical Fixes
### 1. Database Connection Logic
#### [MODIFY] [server/src/database.ts](file:///c:/Users/thegr/Documents/myAppz/freeforge-v1/server/src/database.ts)
- Change logic to `throw new Error` if `MONGODB_URI` is missing or invalid, instead of silently returning.

### 2. Route Registration
#### [MODIFY] [server/src/index.ts](file:///c:/Users/thegr/Documents/myAppz/freeforge-v1/server/src/index.ts)
- Import and register `nodesRouter`, `sessionsRouter`, `anomaliesRouter`.
- Add new routes: `entitiesRouter`, `simulationRouter`.

### 3. Simulation Orchestrator Lifecycle
#### [MODIFY] [simulation/src/api/server.py](file:///c:/Users/thegr/Documents/myAppz/freeforge-v1/simulation/src/api/server.py)
- Instantiate `Orchestrator` on startup (lifespan event).
- Add POST endpoint `/simulation/start` to trigger scenario loading.

### 4. WebSocket Subscription
#### [MODIFY] [frontend/src/services/websocket.ts](file:///c:/Users/thegr/Documents/myAppz/freeforge-v1/frontend/src/services/websocket.ts)
- Fix client to emit `subscribe:session` and `subscribe:node` on connection/view mount.

## Phase 2: Simulation Engine
### Core Components
#### [MODIFY] [simulation/src/core/orchestrator.py](file:///c:/Users/thegr/Documents/myAppz/freeforge-v1/simulation/src/core/orchestrator.py)
- Implement main loop (Physics -> Sensors -> Anomalies).
- Add `PTPClock` integration.

#### [NEW] [simulation/src/sports/basketball.py](file:///c:/Users/thegr/Documents/myAppz/freeforge-v1/simulation/src/sports/basketball.py)
- Implement `BasketballScenario` class.
- Define court boundaries, zones, and basic player behavior (move to ball).

#### [NEW] [simulation/src/utils/ptp_sync.py](file:///c:/Users/thegr/Documents/myAppz/freeforge-v1/simulation/src/utils/ptp_sync.py)
- Implement `PTPClock` class with simulated drift and sync logic.

## Phase 3: Backend Expansion
- Create `server/src/routes/simulation.ts` to bridge API -> Python Simulation.
- Create `server/src/routes/entities.ts` for tracking data.
- Update `server/src/index.ts` to include these new routes.

## Phase 4: Frontend Completion
- Update `MeshView3D.tsx` to actually render entities from WebSocket `entity:tracking` events.
- Implement `SessionReplay` view for playback of recorded sessions.

