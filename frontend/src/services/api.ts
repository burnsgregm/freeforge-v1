import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://motiongrid-api-rrsyyeqnbq-uc.a.run.app/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const Api = {
    // Nodes
    getNodes: async () => (await api.get('/nodes')).data,
    getNode: async (id: string) => (await api.get(`/nodes/${id}`)).data,
    createNode: async (data: any) => (await api.post('/nodes', data)).data,
    updateNode: async (id: string, data: any) => (await api.patch(`/nodes/${id}`, data)).data,
    deleteNode: async (id: string) => (await api.delete(`/nodes/${id}`)).data,
    calibrateNode: async (id: string) => (await api.post(`/nodes/${id}/calibrate`)).data,

    // Sessions
    getSessions: async () => (await api.get('/sessions')).data,
    getSession: async (id: string) => (await api.get(`/sessions/${id}`)).data,
    createSession: async (data: any) => (await api.post('/sessions', data)).data,
    updateSession: async (id: string, data: any) => (await api.patch(`/sessions/${id}`, data)).data,
    deleteSession: async (id: string) => (await api.delete(`/sessions/${id}`)).data,
    startSession: async (id: string) => (await api.post(`/sessions/${id}/start`)).data,
    stopSession: async (id: string) => (await api.post(`/sessions/${id}/stop`)).data,

    // Simulation
    startSimulation: async (config: any) => (await api.post('/simulation/start', config)).data,
    stopSimulation: async () => (await api.post('/simulation/stop')).data,
    getSimulationStatus: async () => (await api.get('/simulation/status')).data,

    // Entities
    getEntities: async () => (await api.get('/entities')).data,

    // Analytics
    getStats: async () => (await api.get('/analytics/stats')).data
};
