import express from 'express';
import { Entity } from '../models/Entity';
import { SensorFrame } from '../models/SensorFrame';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { sessionId, type, role } = req.query;
        const query: any = {};

        if (sessionId) query.sessionId = sessionId;
        if (type) query.type = type;
        if (role) query.role = role;

        const entities = await Entity.find(query);
        res.json(entities);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const entity = await Entity.findOne({ entityId: req.params.id });
        if (!entity) return res.status(404).json({ error: 'Entity not found' });
        res.json(entity);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/track', async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime } = req.query;

        // Find frames where this entity appears in fusion data
        // Note: This query depends on how SensorFrame stores fusion data
        const query: any = {
            'fusion.detectedEntities.id': id
        };

        if (startTime || endTime) {
            query.timestamp = {};
            if (startTime) query.timestamp.$gte = new Date(String(startTime));
            if (endTime) query.timestamp.$lte = new Date(String(endTime));
        }

        const frames = await SensorFrame.find(query)
            .select('timestamp fusion.detectedEntities')
            .sort({ timestamp: 1 })
            .limit(1000);

        // Extract just the relevant position data
        const path = frames.map(f => {
            const ent = f.toJSON().fusion?.detectedEntities?.find((e: any) => e.id === id);
            return {
                timestamp: f.timestamp,
                position: ent?.position
            };
        }).filter(p => p.position);

        res.json({
            entityId: id,
            path
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
