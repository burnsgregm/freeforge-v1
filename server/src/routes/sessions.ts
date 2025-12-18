import express from 'express';
import { SessionService } from '../services/SessionService';

const router = express.Router();
const sessionService = new SessionService();

router.post('/', async (req, res) => {
    try {
        const session = await sessionService.createSession(req.body);
        res.status(201).json(session);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const sessions = await sessionService.getSessions(req.query);
        res.json({ sessions, count: sessions.length });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:id/start', async (req, res) => {
    try {
        const session = await sessionService.startSession(req.params.id);
        if (!session) return res.status(404).json({ error: 'Session not found' });
        res.json({ success: true, session });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:id/stop', async (req, res) => {
    try {
        const session = await sessionService.stopSession(req.params.id);
        if (!session) return res.status(404).json({ error: 'Session not found' });
        res.json({ success: true, session });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const session = await sessionService.updateSession(req.params.id, req.body);
        if (!session) return res.status(404).json({ error: 'Session not found' });
        res.json(session);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const success = await sessionService.deleteSession(req.params.id);
        if (!success) return res.status(404).json({ error: 'Session not found' });
        res.status(204).send();
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/:sessionId/frames', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { startTime, endTime, limit = 100 } = req.query;

        // This relies on SensorFrame model being available. 
        // We might need to import it or use a service method.
        // Ideally checking SessionService first.
        const frames = await sessionService.getSessionFrames(sessionId, {
            startTime: startTime ? new Date(String(startTime)) : undefined,
            endTime: endTime ? new Date(String(endTime)) : undefined,
            limit: Number(limit)
        });

        res.json({ frames, count: frames.length });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:sessionId/export', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { format = 'json' } = req.query;

        // Use any to bypass strict type check for now or import models
        const session = await sessionService.getSession(sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found' });

        const frames = await sessionService.getSessionFrames(sessionId, { limit: 10000 });

        // We'd need an AnomalyService or direct DB call here. 
        // For simplicity reusing Frame logic but we will stub Anomaly export if Service doesn't support it yet
        // or import Anomaly model directly.
        // Let's import Anomaly model dynamically to avoid circular deps or service bloat for now
        const { Anomaly } = await import('../models/Anomaly');
        const anomalies = await Anomaly.find({ sessionId: session._id }).sort({ occurredAt: 1 });

        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="session-${sessionId}.csv"`);

            let csv = 'Timestamp,Type,ID,Detail\n';
            frames.forEach((f: any) => {
                csv += `${f.timestamp.toISOString()},FRAME,${f.frameNumber},\n`;
            });
            anomalies.forEach((a: any) => {
                csv += `${a.occurredAt.toISOString()},ANOMALY,${a.anomalyId},${a.type}\n`;
            });

            res.send(csv);
        } else {
            res.json({
                session,
                frames,
                anomalies,
                stats: {
                    duration: session.duration,
                    totalFrames: frames.length,
                    totalAnomalies: anomalies.length
                }
            });
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
