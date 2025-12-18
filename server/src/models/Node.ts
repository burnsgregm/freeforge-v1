import mongoose, { Schema, Document } from 'mongoose';

export interface INode extends Document {
    nodeId: string;
    name: string;
    type: 'EDGE_NODE';
    status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
    position: { x: number; y: number; z: number };
    orientation: { pitch: number; yaw: number; roll: number };
    sensors: {
        camera: {
            enabled: boolean;
            resolution: { width: number; height: number };
            fps: number;
            fov: number;
            exposure: number;
            gain: number;
        };
        lidar: {
            enabled: boolean;
            model: string;
            channels: number;
            pointsPerSecond: number;
            range: number;
            accuracy: number;
        };
        imu: {
            enabled: boolean;
            sampleRate: number;
            accelRange: number;
            gyroRange: number;
        };
    };
    calibration: {
        intrinsic: {
            cameraMatrix: number[][];
            distortion: number[];
        };
        extrinsic: {
            rotationMatrix: number[][];
            translationVector: number[];
        };
        lidarToCameraTransform: number[][];
        calibrationQuality: number;
        calibratedAt: Date;
    };
    network: {
        ipAddress: string;
        port: number;
        ptpDomain: number;
        clockOffset: number;
        lastSyncAt: Date;
    };
    sessionId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const NodeSchema: Schema = new Schema({
    nodeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, default: 'EDGE_NODE' },
    status: { type: String, enum: ['ONLINE', 'OFFLINE', 'DEGRADED'], default: 'OFFLINE' },
    position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
    },
    orientation: {
        pitch: { type: Number, default: 0 },
        yaw: { type: Number, default: 0 },
        roll: { type: Number, default: 0 }
    },
    sensors: {
        camera: {
            enabled: { type: Boolean, default: true },
            resolution: {
                width: { type: Number, default: 1920 },
                height: { type: Number, default: 1080 }
            },
            fps: { type: Number, default: 30 },
            fov: { type: Number, default: 90 },
            exposure: { type: Number, default: 50 },
            gain: { type: Number, default: 0 }
        },
        lidar: {
            enabled: { type: Boolean, default: true },
            model: { type: String, default: 'VLP-16' },
            channels: { type: Number, default: 16 },
            pointsPerSecond: { type: Number, default: 300000 },
            range: { type: Number, default: 100 },
            accuracy: { type: Number, default: 0.03 }
        },
        imu: {
            enabled: { type: Boolean, default: true },
            sampleRate: { type: Number, default: 100 },
            accelRange: { type: Number, default: 16 },
            gyroRange: { type: Number, default: 2000 }
        }
    },
    calibration: {
        intrinsic: {
            cameraMatrix: [[Number]],
            distortion: [Number]
        },
        extrinsic: {
            rotationMatrix: [[Number]],
            translationVector: [Number]
        },
        lidarToCameraTransform: [[Number]],
        calibrationQuality: { type: Number, default: 0 },
        calibratedAt: Date
    },
    network: {
        ipAddress: String,
        port: Number,
        ptpDomain: { type: Number, default: 0 },
        clockOffset: { type: Number, default: 0 },
        lastSyncAt: Date
    },
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session' }
}, { timestamps: true });

export const Node = mongoose.model<INode>('Node', NodeSchema);
