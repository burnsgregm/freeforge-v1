import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
    sessionId: string;
    name: string;
    sport: 'BASKETBALL' | 'SOCCER' | 'COMBAT' | 'CUSTOM';
    venue: string;
    startedAt: Date;
    endedAt?: Date;
    duration: number;
    status: 'RECORDING' | 'STOPPED' | 'PROCESSING' | 'READY';
    nodeIds: string[];
    stats: {
        totalFrames: number;
        totalEntities: number;
        totalAnomalies: number;
        anomalyBreakdown: {
            critical: number;
            high: number;
            medium: number;
            low: number;
        };
        avgOccupancy: number;
        peakOccupancy: number;
        avgActivityIndex: number;
    };
    scenario: {
        entityCount: number;
        crowdDensity: number;
        anomalyRate: number;
        environmentConfig: {
            lighting: 'BRIGHT' | 'DIM' | 'VARIABLE';
            weather?: 'CLEAR' | 'RAIN' | 'SNOW';
        };
    };
    dataPath: string;
    thumbnailPath?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SessionSchema: Schema = new Schema({
    sessionId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    sport: { type: String, enum: ['BASKETBALL', 'SOCCER', 'COMBAT', 'CUSTOM'], required: true },
    venue: String,
    startedAt: { type: Date, default: Date.now },
    endedAt: Date,
    duration: { type: Number, default: 0 },
    status: { type: String, enum: ['RECORDING', 'STOPPED', 'PROCESSING', 'READY'], default: 'RECORDING' },
    nodeIds: [String],
    stats: {
        totalFrames: { type: Number, default: 0 },
        totalEntities: { type: Number, default: 0 },
        totalAnomalies: { type: Number, default: 0 },
        anomalyBreakdown: {
            critical: { type: Number, default: 0 },
            high: { type: Number, default: 0 },
            medium: { type: Number, default: 0 },
            low: { type: Number, default: 0 }
        },
        avgOccupancy: { type: Number, default: 0 },
        peakOccupancy: { type: Number, default: 0 },
        avgActivityIndex: { type: Number, default: 0 }
    },
    scenario: {
        entityCount: { type: Number, default: 0 },
        crowdDensity: { type: Number, default: 0 },
        anomalyRate: { type: Number, default: 0 },
        environmentConfig: {
            lighting: { type: String, default: 'BRIGHT' },
            weather: String
        }
    },
    dataPath: String,
    thumbnailPath: String
}, { timestamps: true });

export const Session = mongoose.model<ISession>('Session', SessionSchema);
