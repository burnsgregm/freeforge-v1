import { io, Socket } from 'socket.io-client';

class WebSocketService {
    private socket: Socket | null = null;
    private callbacks: Map<string, Function[]> = new Map();

    connect(url: string) {
        const token = localStorage.getItem('auth_token');
        this.socket = io(url, {
            transports: ['websocket'],
            reconnection: true,
            auth: { token }
        });

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
            // Re-subscribe if we had active subscriptions? 
            // For now, simpler to leave it to the components.
        });

        this.socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        // Register for all expected events
        ['sensor:frame', 'anomaly:detected', 'entity:tracking', 'session:stats', 'node:status']
            .forEach(event => {
                this.socket!.on(event, (data: any) => {
                    const cbs = this.callbacks.get(event) || [];
                    cbs.forEach(cb => cb(data));
                });
            });
    }

    subscribeToSession(sessionId: string) {
        if (!this.socket) return;
        this.socket.emit('subscribe:session', { sessionId });
    }

    subscribeToNode(nodeId: string) {
        if (!this.socket) return;
        this.socket.emit('subscribe:node', { nodeId });
    }

    on(event: string, callback: Function) {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }
        this.callbacks.get(event)!.push(callback);
    }

    off(event: string, callback: Function) {
        if (!this.callbacks.has(event)) return;
        const cbs = this.callbacks.get(event) || [];
        this.callbacks.set(event, cbs.filter(cb => cb !== callback));
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const wsService = new WebSocketService();
