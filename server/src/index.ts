import dotenv from 'dotenv';
// Load environment variables immediately
dotenv.config();

console.log('🚀 [STARTUP] Motion Intelligence Grid API initiating...');
console.log(`[STARTUP] Environment: ${process.env.NODE_ENV || 'development'}`);

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { connectDB } from './database';
import { socketService } from './services/SocketService';
import { authenticate as authMiddleware } from './middleware/auth';
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth';
import nodesRouter from './routes/nodes';
import sessionsRouter from './routes/sessions';
import anomaliesRouter from './routes/anomalies';
import entitiesRouter from './routes/entities';
import simulationRouter from './routes/simulation';
import analyticsRouter from './routes/analytics';

console.log('🚀 [STARTUP] Motion Intelligence Grid API initiating...');
console.log(`[STARTUP] Environment: ${process.env.NODE_ENV || 'development'}`);

const app = express();
const httpServer = createServer(app);

// BIND PORT IMMEDIATELY FOR CLOUD RUN HEALTH CHECKS
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`✅ [STARTUP] API listening on port ${PORT}`);
});

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || '*', // WebSocket CORS
        methods: ['GET', 'POST'],
    },
});

// Initialize SocketService
socketService.init(io);

// SECURITY MIDDLEWARE
// 1. Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
app.use(limiter);

app.use(cors({
    origin: process.env.CLIENT_URL || '*', // In production, set CLIENT_URL to your exact frontend domain
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Helmet headers
app.use(helmet());
app.use(express.json());

// Basic health check (Always available)
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime()
    });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/nodes', authMiddleware, nodesRouter);
app.use('/api/sessions', authMiddleware, sessionsRouter);
app.use('/api/anomalies', authMiddleware, anomaliesRouter);
app.use('/api/entities', authMiddleware, entitiesRouter);
app.use('/api/simulation', authMiddleware, simulationRouter);
app.use('/api/analytics', authMiddleware, analyticsRouter);

// Internal Endpoints for Simulation Bridge
app.post('/internal/entity-update', async (req, res) => {
    const { sessionId, entities, stats, sentAt } = req.body;
    const latencyMs = sentAt ? Math.round((Date.now() / 1000 - sentAt) * 1000) : 0;
    socketService.emit('entity:tracking', { entities, stats, latencyMs }, sessionId ? `session:${sessionId}` : undefined);
    res.json({ status: 'ok' });
});

app.post('/internal/anomaly', async (req, res) => {
    const { sessionId, anomaly } = req.body;
    socketService.emit('anomaly:detected', anomaly, sessionId ? `session:${sessionId}` : undefined);
    res.json({ status: 'ok' });
});

const startServer = async () => {
    try {
        console.log('[STARTUP] Connecting to database...');
        await connectDB();
        console.log('✅ [STARTUP] Database connected successfully.');

        if (mongoose.connection.readyState === 1) {
            const { User } = await import('./models/User');
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@freeforge.com';
            const adminPassword = process.env.ADMIN_PASSWORD || 'nimda';

            console.log(`[STARTUP] Checking for admin: ${adminEmail}`);
            const adminUser = await User.findOne({ email: adminEmail });

            if (!adminUser) {
                console.log(`[STARTUP] Seeding default admin user: ${adminEmail} with password: ${adminPassword}...`);
                const newAdmin = new User({
                    email: adminEmail,
                    passwordHash: adminPassword,
                    username: 'admin',
                    role: 'ADMIN'
                });
                await newAdmin.save();
                console.log('✅ [STARTUP] Default admin created.');
            } else {
                console.log(`[STARTUP] Admin user ${adminEmail} exists. Updating password to environment current value...`);
                adminUser.passwordHash = adminPassword;
                await adminUser.save();
                console.log('✅ [STARTUP] Admin password updated successfully.');
            }
        }
    } catch (error) {
        console.error('❌ [STARTUP] initialization failed:', error);
    }
};

startServer();
