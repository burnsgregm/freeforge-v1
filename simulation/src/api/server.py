from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os

from src.core.orchestrator import SimulationOrchestrator

orchestrator = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global orchestrator
    # Initialize with default config
    orchestrator = SimulationOrchestrator({})
    print("Simulation Engine Starting...")
    yield
    # Shutdown
    if orchestrator:
        orchestrator.stop()
    print("Simulation Engine Stopping...")

app = FastAPI(lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "simulation-engine"}

@app.post("/simulation/start")
async def start_simulation(config: dict):
    if not orchestrator:
        return {"error": "Orchestrator not initialized"}
    orchestrator.load_scenario(config.get('sport', 'BASKETBALL'), config)
    orchestrator.start()
    return {"status": "started"}

@app.post("/simulation/stop")
async def stop_simulation():
    if not orchestrator:
        return {"error": "Orchestrator not initialized"}
    orchestrator.stop()
    return {"status": "stopped"}

@app.get("/nodes/{node_id}/stream")
async def get_stream(node_id: str):
    if not orchestrator:
        raise HTTPException(status_code=503, detail="Orchestrator not initialized")
    
    return StreamingResponse(
        orchestrator.get_video_stream(node_id), 
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.get("/simulation/status")
async def get_status():
    if not orchestrator:
        return {"running": False, "error": "Orchestrator not initialized"}
    
    return {
        "running": orchestrator.running,
        "paused": orchestrator.paused,
        "active_scenario": orchestrator.scenario.sport if orchestrator.scenario else None,
        "fps": getattr(orchestrator, 'actual_fps', 0),
        "target_fps": getattr(orchestrator, 'target_fps', 30),
        "entity_count": len(orchestrator.entities)
    }

@app.patch("/simulation/config")
async def update_config(config: dict):
    if not orchestrator:
         return {"error": "Orchestrator not initialized"}
    
    if 'targetFps' in config:
        orchestrator.target_fps = config['targetFps']
    
    if 'anomalyRate' in config and hasattr(orchestrator, 'anomaly_generator'):
        orchestrator.anomaly_generator.anomaly_rate = config['anomalyRate']

    return {"status": "updated", "config": config}

@app.post("/nodes/{node_id}/calibrate")
async def calibrate_node(node_id: str):
    """Simulate calibration for a node."""
    if not orchestrator:
         raise HTTPException(status_code=503, detail="Orchestrator not initialized")
    
    import random
    import time
    return {
        "nodeId": node_id,
        "calibration": {
            "reprojectionError": random.uniform(0.01, 0.05),
            "status": "SUCCESS",
            "timestamp": time.time()
        }
    }

@app.get("/")
async def root():
    return {"message": "Motion Intelligence Simulation Engine v1.0"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("src.api.server:app", host="0.0.0.0", port=port, reload=True)
