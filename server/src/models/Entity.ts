import mongoose, { Schema, Document } from 'mongoose';

export interface IEntity extends Document {
    entityId: string;
    type: 'PERSON' | 'OBJECT';
    role: 'PLAYER' | 'OFFICIAL' | 'SPECTATOR' | 'BALL';
    team?: 'HOME' | 'AWAY';
    name?: string;
    lastPosition: { x: number; y: number; z: number };
    lastVelocity: { x: number; y: number; z: number };
    lastSeenAt: Date;
    sessionId?: string;
}

const EntitySchema: Schema = new Schema({
    entityId: { type: String, required: true, unique: true },
    type: { type: String, enum: ['PERSON', 'OBJECT'], required: true },
    role: { type: String, enum: ['PLAYER', 'OFFICIAL', 'SPECTATOR', 'BALL'], default: 'SPECTATOR' },
    team: { type: String, enum: ['HOME', 'AWAY'] },
    name: String,
    lastPosition: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
    },
    lastVelocity: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
    },
    lastSeenAt: { type: Date, default: Date.now },
    sessionId: String
}, { timestamps: true });

export const Entity = mongoose.model<IEntity>('Entity', EntitySchema);
