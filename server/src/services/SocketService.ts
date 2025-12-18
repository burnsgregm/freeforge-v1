import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

class SocketService {
    private io: Server | null = null;

    init(io: Server) {
        this.io = io;
        this.setupListeners();
    }

    private setupListeners() {
        if (!this.io) return;

        // Authentication Middleware
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token || socket.handshake.query.token;

            if (!token) {
                return next(new Error('Authentication required'));
            }

            try {
                const secret = process.env.JWT_SECRET;
                if (!secret) {
                    if (process.env.NODE_ENV === 'production') {
                        throw new Error('CRITICAL: JWT_SECRET environment variable is missing in production!');
                    }
                    console.warn('⚠️ Using dev JWT secret - NOT FOR PRODUCTION');
                }
                const decoded = jwt.verify(token as string, secret || 'dev_secret_do_not_use_in_prod');
                (socket as any).user = decoded;
                next();
            } catch (err) {
                next(new Error('Invalid token'));
            }
        });

        this.setupHandlers();
    }

    private setupHandlers() {
        if (!this.io) return;

        this.io.on('connection', (socket: Socket) => {
            const user = (socket as any).user;
            console.log(`Client connected: ${socket.id} (User: ${user?.email || 'Unknown'})`);

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });

            // Handle subscriptions
            socket.on('subscribe:session', (data) => {
                console.log(`Client ${socket.id} subscribed to session ${data.sessionId}`);
                socket.join(`session:${data.sessionId}`);
            });

            socket.on('subscribe:node', (data) => {
                console.log(`Client ${socket.id} subscribed to node ${data.nodeId}`);
                socket.join(`node:${data.nodeId}`);
            });
        });
    }

    emit(event: string, data: any, room?: string) {
        if (!this.io) {
            console.warn('SocketService not initialized');
            return;
        }

        if (room) {
            this.io.to(room).emit(event, data);
        } else {
            this.io.emit(event, data);
        }
    }
}

export const socketService = new SocketService();
