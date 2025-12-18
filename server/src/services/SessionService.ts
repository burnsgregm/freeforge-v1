import { Session, ISession } from '../models/Session';
import mongoose from 'mongoose';
import { SensorFrame } from '../models/SensorFrame';

export class SessionService {
    async createSession(data: Partial<ISession>): Promise<ISession> {
        const session = new Session({
            ...data,
            sessionId: `SES_${Date.now()}`
        });
        return await session.save();
    }

    async getSession(sessionId: string): Promise<ISession | null> {
        return await Session.findOne({ sessionId });
    }

    async getSessions(filter: any = {}): Promise<ISession[]> {
        return await Session.find(filter).sort({ createdAt: -1 });
    }

    async getSessionFrames(sessionId: string, options: { startTime?: Date, endTime?: Date, limit?: number }): Promise<any[]> {
        const session = await Session.findOne({ sessionId });
        if (!session) return [];

        const query: any = { sessionId: session._id };
        if (options.startTime || options.endTime) {
            query.timestamp = {};
            if (options.startTime) query.timestamp.$gte = options.startTime;
            if (options.endTime) query.timestamp.$lte = options.endTime;
        }

        return await SensorFrame.find(query).sort({ timestamp: 1 }).limit(options.limit || 100);
    }

    async startSession(sessionId: string): Promise<ISession | null> {
        return await Session.findOneAndUpdate(
            { sessionId },
            {
                status: 'RECORDING',
                startedAt: new Date()
            },
            { new: true }
        );
    }

    async stopSession(sessionId: string): Promise<ISession | null> {
        const session = await Session.findOne({ sessionId });
        if (!session) return null;

        const endedAt = new Date();
        const duration = (endedAt.getTime() - session.startedAt.getTime()) / 1000;

        return await Session.findOneAndUpdate(
            { sessionId },
            {
                status: 'STOPPED',
                endedAt,
                duration
            },
            { new: true }
        );
    }


    async updateSession(sessionId: string, data: Partial<ISession>): Promise<ISession | null> {
        return await Session.findOneAndUpdate({ sessionId }, data, { new: true });
    }

    async deleteSession(sessionId: string): Promise<boolean> {
        const result = await Session.deleteOne({ sessionId });
        return result.deletedCount === 1;
    }
}
