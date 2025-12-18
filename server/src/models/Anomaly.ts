import mongoose, { Schema, Document } from 'mongoose';

export interface IAnomaly extends Document {
    anomalyId: string;
    sessionId: mongoose.Types.ObjectId;
    entityIds: mongoose.Types.ObjectId[];
    nodeIds: string[];
    occurredAt: Date;
    duration: number;
    type: 'GEOGRAPHICS' | 'KINETICS' | 'PROXEMICS' | 'ATMOSPHERICS';
    subtype: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    scenario?: string;
    headline: string;
    description: string;
    baselineText: string;
    anomalyText: string;
    metrics: {
        baselineDelta: number;
        confidence: number;
        riskScore: number;
    };
    ruleOfThreeHit: boolean;
    relatedAnomalies: mongoose.Types.ObjectId[];
    zone: string;
    location: { x: number; y: number; z: number };
    triage: {
        status: 'UNREVIEWED' | 'CONFIRMED' | 'DOWNGRADED' | 'FALSE_POSITIVE';
        notes?: string;
    };
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const AnomalySchema: Schema = new Schema({
    anomalyId: { type: String, required: true, unique: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    entityIds: [{ type: Schema.Types.ObjectId, ref: 'Entity' }],
    nodeIds: [String],
    occurredAt: { type: Date, default: Date.now },
    duration: { type: Number, default: 0 },
    type: { type: String, enum: ['GEOGRAPHICS', 'KINETICS', 'PROXEMICS', 'ATMOSPHERICS'], required: true },
    subtype: String,
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' },
    scenario: String,
    headline: String,
    description: String,
    baselineText: String,
    anomalyText: String,
    metrics: {
        baselineDelta: Number,
        confidence: Number,
        riskScore: Number
    },
    ruleOfThreeHit: { type: Boolean, default: false },
    relatedAnomalies: [{ type: Schema.Types.ObjectId, ref: 'Anomaly' }],
    zone: String,
    location: {
        x: Number,
        y: Number,
        z: Number
    },
    triage: {
        status: { type: String, enum: ['UNREVIEWED', 'CONFIRMED', 'DOWNGRADED', 'FALSE_POSITIVE'], default: 'UNREVIEWED' },
        notes: String,
        triageAt: Date,
        triagedBy: String
    },
    tags: [String]
}, { timestamps: true });

export const Anomaly = mongoose.model<IAnomaly>('Anomaly', AnomalySchema);
