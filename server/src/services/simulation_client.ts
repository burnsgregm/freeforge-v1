import axios from 'axios';

const SIMULATION_API_URL = process.env.SIMULATION_API_URL || 'http://localhost:8000';

export class SimulationClient {

    static async healthCheck(): Promise<boolean> {
        try {
            const response = await axios.get(`${SIMULATION_API_URL}/health`);
            return response.data.status === 'ok';
        } catch (error) {
            console.error('Simulation API unhealthy:', error.message);
            return false;
        }
    }

    static async startSimulation(config: any): Promise<boolean> {
        try {
            const response = await axios.post(`${SIMULATION_API_URL}/simulation/start`, config);
            return response.data.status === 'started';
        } catch (error) {
            console.error('Failed to start simulation:', error.message);
            return false;
        }
    }

    static async stopSimulation(): Promise<boolean> {
        try {
            const response = await axios.post(`${SIMULATION_API_URL}/simulation/stop`);
            return response.data.status === 'stopped';
        } catch (error) {
            console.error('Failed to stop simulation:', error.message);
            return false;
        }
    }
}
