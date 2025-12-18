import express from 'express';
import axios from 'axios';
import { NodeService } from '../services/NodeService';

const router = express.Router();
const nodeService = new NodeService();

router.post('/', async (req, res) => {
    try {
        const node = await nodeService.createNode(req.body);
        res.status(201).json(node);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const nodes = await nodeService.getNodes(req.query);
        res.json({ nodes, count: nodes.length });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const node = await nodeService.getNode(req.params.id);
        if (!node) return res.status(404).json({ error: 'Node not found' });
        res.json(node);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/stream', async (req, res) => {
    try {
        const nodeId = req.params.id;
        // Ideally use env var for simulation URL
        const simulationUrl = process.env.SIMULATION_API_URL || 'http://localhost:8000';

        const response = await axios({
            method: 'get',
            url: `${simulationUrl}/nodes/${nodeId}/stream`,
            responseType: 'stream'
        });

        // Forward content type (multipart/x-mixed-replace)
        res.setHeader('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (err: any) {
        // console.error('Stream proxy error:', err.message);
        res.status(503).send('Stream unavailable');
    }
});

router.post('/:id/calibrate', async (req, res) => {
    try {
        const nodeId = req.params.id;
        const simulationUrl = process.env.SIMULATION_API_URL || 'http://localhost:8000';

        const response = await axios.post(`${simulationUrl}/nodes/${nodeId}/calibrate`);
        const result = response.data;

        // Update node in database
        await nodeService.updateNode(nodeId, {
            calibration: result.calibration
        });

        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const node = await nodeService.updateNode(req.params.id, req.body);
        if (!node) return res.status(404).json({ error: 'Node not found' });
        res.json(node);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const success = await nodeService.deleteNode(req.params.id);
        if (!success) return res.status(404).json({ error: 'Node not found' });
        res.status(204).send();
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
