import express from 'express';
import { SimulationClient } from '../services/simulation_client';

const router = express.Router();

router.post('/start', async (req, res) => {
    const config = req.body;
    const success = await SimulationClient.startSimulation(config);
    if (success) {
        res.json({ message: 'Simulation started' });
    } else {
        res.status(500).json({ error: 'Failed to start simulation' });
    }
});

router.post('/stop', async (req, res) => {
    const success = await SimulationClient.stopSimulation();
    if (success) {
        res.json({ message: 'Simulation stopped' });
    } else {
        res.status(500).json({ error: 'Failed to stop simulation' });
    }
});

router.get('/status', async (req, res) => {
    const isHealthy = await SimulationClient.healthCheck();
    res.json({
        status: isHealthy ? 'running' : 'stopped',
        service: 'python-engine'
    });
});

export default router;
