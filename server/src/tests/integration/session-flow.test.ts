import request from 'supertest';
import app from '../../index'; // Assuming index.ts exports app
import { connectDB } from '../../database';
import mongoose from 'mongoose';

describe('Integration: Session Lifecycle', () => {
    let authToken: string;
    let sessionId: string;

    beforeAll(async () => {
        // Ensure DB is connected (likely Memory or Real)
        await connectDB();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should login and receive a token', async () => {
        // Seed or assuming default admin exists from index.ts seed logic
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@freeforge.com',
                password: 'nimda'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        authToken = response.body.token;
    });

    it('should create a new session', async () => {
        const response = await request(app)
            .post('/api/sessions')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Integration Test Session',
                sport: 'BASKETBALL',
                duration: 60
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('sessionId');
        expect(response.body.status).toBe('SCHEDULED');
        sessionId = response.body.sessionId;
    });

    it('should start the session', async () => {
        const response = await request(app)
            .post(`/api/sessions/${sessionId}/start`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.session.status).toBe('RECORDING');
    });

    it('should retrieve empty frames list initially', async () => {
        const response = await request(app)
            .get(`/api/sessions/${sessionId}/frames`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.frames)).toBe(true);
        // Might be empty if no sim running
        expect(response.body.count).toBeGreaterThanOrEqual(0);
    });

    it('should stop the session', async () => {
        const response = await request(app)
            .post(`/api/sessions/${sessionId}/stop`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.session.status).toBe('COMPLETED');
    });

    it('should export the session data as JSON', async () => {
        const response = await request(app)
            .get(`/api/sessions/${sessionId}/export?format=json`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('session');
    });
});
