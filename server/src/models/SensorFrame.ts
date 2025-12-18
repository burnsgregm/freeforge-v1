import mongoose, { Schema, Document } from 'mongoose';

export interface ISensorFrame extends Document {
    frameId: string;
    sessionId: mongoose.Types.ObjectId;
    nodeId: string;
    timestamp: Date;
    frameNumber: number;
    camera?: {
        imagePath: string;
        resolution: { width: number; height: number };
    };
    lidar?: {
        pointCloudPath: string;
        pointCount: number;
    };
    fusion?: {
        detectedEntities: any[];
        processingTime: number;
    };
    createdAt: Date;
}

const SensorFrameSchema: Schema = new Schema({
    frameId: { type: String, required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    nodeId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    frameNumber: Number,
    camera: {
        imagePath: String,
        resolution: { width: Number, height: Number }
    },
    lidar: {
        pointCloudPath: String,
        pointCount: Number
    },
    fusion: {
        detectedEntities: [],
        processingTime: Number
    }
}, {
    timeseries: {
        timeField: 'timestamp',
        metaField: 'nodeId',
        granularity: 'seconds'
    },
    expireAfterSeconds: 86400 * 7 // 7 days retention
});

export const SensorFrame = mongoose.model<ISensorFrame>('SensorFrame', SensorFrameSchema);
