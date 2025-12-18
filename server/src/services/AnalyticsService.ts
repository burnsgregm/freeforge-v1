import { Session } from '../models/Session';
import { Anomaly } from '../models/Anomaly';

export class AnalyticsService {
    async getSessionStats(sessionId: string) {
        const session = await Session.findOne({ sessionId });
        if (!session) throw new Error('Session not found');

        const anomalyCount = await Anomaly.countDocuments({ sessionId: session._id });
        const criticalAnomalies = await Anomaly.countDocuments({ sessionId: session._id, severity: 'CRITICAL' });

        return {
            ...session.toJSON().stats,
            anomalyCount,
            criticalAnomalies
        };
    }

    async getGlobalStats() {
        const totalSessions = await Session.countDocuments();
        const totalAnomalies = await Anomaly.countDocuments();

        return {
            totalSessions,
            totalAnomalies,
            systemHealth: 'HEALTHY' // Placeholder
        };
    }
}
