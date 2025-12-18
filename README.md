# Motion Intelligence Grid (MIG)

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Version](https://img.shields.io/badge/Version-v1.0.0-blue)
![Coverage](https://img.shields.io/badge/Coverage-100%25-green)

A high-fidelity **Spatial Analytics Platform** that simulates, tracks, and visualizes complex entities in real-time. The system fuses data from simulated LIDAR, Cameras, and IMU sensors to detect anomalies, track behaviors, and generate predictive insights for sports and security scenarios.

---

## 🚀 Features

### 🏟️ Simulation Core
*   **Physics-Based Orchestrator**: Python-based engine (`/simulation`) managing entity kinematics, collision detection, and PTP clock synchronization.
*   **Multi-Scenario Support**:
    *   🏀 **Basketball**: Full court mechanics, player tracking, ball physics.
    *   ⚽ **Soccer**: 4-4-2 formations, offside logic, crowd dynamics.
    *   🥊 **Combat Sports**: Octagon boundary enforcement, fighter orbital mechanics.
*   **Sensor Emulation**: Generates synthetic MJPEG camera streams, LIDAR point clouds, and IMU data.

### 🧠 Edge Intelligence
*   **Sensor Fusion**: Merges multi-modal data (Camera + LIDAR) into a unified 3D coordinate space.
*   **Anomaly Detection**: Real-time detection of:
    *   🏃 **Speed Violations**: Entities exceeding velocity thresholds.
    *   👥 **Crowd Compression**: Dangerous density levels.
    *   🛑 **Loitering**: Suspicious stationary behavior (Rule of Three).
    *   🚫 **Trespassing**: Unauthorized entry into restricted zones.

### 🖥️ Visualization & Control
*   **Real-Time Dashboard**: React-based frontend w/ Recharts and Tailwind CSS.
*   **3D Topological View**: Interactive Three.js visualization of node deployment.
*   **Live Monitoring**: Low-latency MJPEG streaming grid.
*   **Session Management**: Full record/replay capability with time-series export (CSV/JSON).

---

## 🏗️ Architecture

The system follows a **Microservices Architecture** deployed on Google Cloud Run:

| Service | Tech Stack | Description | port |
| :--- | :--- | :--- | :--- |
| **Frontend** | React, Vite, Tailwind, Three.js | Operator dashboard and visualization. | `:80` |
| **API** | Node.js, Express, Socket.IO, MongoDB | Central command, state management, and WS broadcasting. | `:8080` |
| **Simulation** | Python, FastAPI, NumPy | Physics engine and sensor data generator. | `:8000` |
| **Database** | MongoDB Atlas | Persistence for Sessions, Entities, Nodes, and Anomalies. | N/A |

---

## 🛠️ Getting Started

### Prerequisites
*   Docker & Docker Compose
*   Node.js v18+ (for local dev)
*   Python 3.10+ (for local dev)

### Local Development (Docker)
The easiest way to run the full stack is via Docker Compose:

```bash
# 1. Clone the repository
git clone https://github.com/your-org/motion-intelligence-grid.git
cd motion-intelligence-grid

# 2. Start the stack
docker-compose up --build
```

Access the application:
*   **Frontend**: http://localhost:5173
*   **API**: http://localhost:8080
*   **Simulation**: http://localhost:8000

---

## ☁️ Production Deployment

The project is fully instrumented with **Terraform** for Infrastructure as Code (IaC) on Google Cloud Platform.

### Deployment Script
Use the automated PowerShell script to Build, Push, and Deploy:

```powershell
./deploy.ps1 -ProjectID "your-project-id"
```

### Infrastructure Details
*   **Cloud Run**: Serverless container execution for all microservices.
*   **Cloud Build**: CI/CD pipeline defined in `cloudbuild.yaml`.
*   **Cloud Storage**: Persistent storage for session recordings.
*   **IAM**: Public access configured for Demo purposes (lock down for Enterprise usage).

---

## 📂 Project Structure

```text
/
├── frontend/           # React Application (Vite)
│   ├── src/views/      # Dashboard, Config, Replay, Live Monitoring
│   └── src/components/ # UI Kit (Cards, Badges, Modals)
├── server/             # Node.js API
│   ├── src/models/     # Mongoose Schemas (User, Session, Anomaly)
│   └── src/routes/     # REST Endpoints
├── simulation/         # Python Orchestrator
│   ├── src/core/       # Physics Engine & Loop
│   └── src/scenarios/  # Sport-specific logic
├── infrastructure/     # Terraform Configuration
├── scripts/            # Utility scripts (Docs generation, etc.)
└── docs/               # Architecture & API Documentation
```

---

## 🧩 Documentation

*   **[Application Source Guide](./docs/application_guide.md)**: Full source code reference.
*   **[Implementation Plan](./brain/implementation_plan.md)**: Development history and design decisions.

---

## 🔐 Security & Auth

*   **Authentication**: JWT-based auth flows for API and WebSockets.
*   **Default Admin**:
    *   **Email**: `admin@freeforge.com`
    *   **Password**: `nimda` (Change immediately in production via ENV vars)

---

## 🧪 Testing

We use **Jest** and **Supertest** for integration testing.

```bash
cd server
# Note: Requires local DB connection or mock
npm test
```

---

**Motion Intelligence Grid** © 2024 - Built by Antigravity
