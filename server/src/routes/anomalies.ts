import express from 'express';
import { Anomaly } from '../models/Anomaly';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { sessionId, severity, status } = req.query;
        const query: any = {};

        if (sessionId) query.sessionId = sessionId;
        if (severity) query.severity = severity;
        if (status || req.query.triageStatus) query['triage.status'] = status || req.query.triageStatus;

        const anomalies = await Anomaly.find(query).sort({ occurredAt: -1 }).limit(100);
        res.json({ anomalies, count: anomalies.length });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/triage', async (req, res) => {
    try {
        const { status, notes } = req.body;
        const anomaly = await Anomaly.findOneAndUpdate(
            { anomalyId: req.params.id },
            {
                'triage.status': status,
                'triage.notes': notes,
                'triage.triageAt': new Date()
            },
            { new: true }
        );

        if (!anomaly) return res.status(404).json({ error: 'Anomaly not found' });
        res.json(anomaly);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:id/tag', async (req, res) => {
    try {
        const { tags } = req.body;
        const anomaly = await Anomaly.findOneAndUpdate(
            { anomalyId: req.params.id },
            { $addToSet: { tags: { $each: tags } } },
            { new: true }
        );

        if (!anomaly) return res.status(404).json({ error: 'Anomaly not found' });
        res.json(anomaly);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
