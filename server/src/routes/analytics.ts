import express from 'express';

const router = express.Router();

router.get('/stats', (req, res) => {
    // Return aggregated stats
    res.json({
        totalAnomalies: 42,
        activeEntities: 15,
        systemHealth: 98.6,
        uptimeSeconds: 3600
    });
});

router.get('/performance', (req, res) => {
    // Return system performance metrics (FPS, Latency)
    res.json({
        simulationFps: 29.8,
        networkLatencyMs: 12,
        processingTimeMs: 4
    });
});

export default router;
