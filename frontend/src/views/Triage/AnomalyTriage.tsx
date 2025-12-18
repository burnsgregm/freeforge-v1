import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { wsService } from '../../services/websocket';

interface TriageTask {
    id: string;
    title: string;
    time: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export const AnomalyTriage = () => {
    const [newIncidents, setNewIncidents] = useState<TriageTask[]>([]);

    // Mock existing state for other columns
    const [investigating] = useState<TriageTask[]>([
        { id: 'A-099', title: 'Crowd Density Warning', time: '09:30 AM', severity: 'MEDIUM' },
    ]);
    const [resolved] = useState<TriageTask[]>([
        { id: 'A-055', title: 'Sensor Dropout', time: 'Yesterday', severity: 'LOW' },
    ]);

    useEffect(() => {
        wsService.connect(import.meta.env.VITE_WS_URL || 'https://motiongrid-api-rrsyyeqnbq-uc.a.run.app');

        const unsubscribe = wsService.on('anomaly:detected', (data: any) => {
            const newTask: TriageTask = {
                id: data.anomalyId || 'unknown',
                title: data.headline || 'Unknown Anomaly',
                severity: data.severity || 'LOW',
                time: data.occurredAt ? new Date(data.occurredAt).toLocaleTimeString() : new Date().toLocaleTimeString()
            };
            setNewIncidents(prev => [newTask, ...prev]);
        });
        return () => { };
    }, []);

    return (
        <div className="p-6 h-full text-white overflow-hidden flex flex-col">
            <h1 className="text-2xl font-bold mb-6">Anomaly Triage (Live)</h1>

            <div className="flex-1 flex gap-6 min-h-0 overflow-x-auto">
                <Column title="New Incidents" color="border-red-500" items={newIncidents} />
                <Column title="Investigating" color="border-yellow-500" items={investigating} />
                <Column title="Resolved" color="border-green-500" items={resolved} />
            </div>
        </div>
    );
};

const Column = ({ title, color, items }: any) => (
    <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
        <div className={`font-semibold pb-2 border-b-2 ${color} flex justify-between`}>
            {title}
            <span className="text-slate-500 text-sm">{items.length}</span>
        </div>
        <div className="flex-1 bg-slate-900/50 rounded-lg p-2 space-y-3 overflow-y-auto">
            {items.map((item: any) => (
                <Card key={item.id} className="p-3 cursor-move hover:bg-slate-800 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-slate-500 font-mono">{item.id}</span>
                        <Badge variant={item.severity.toLowerCase()}>{item.severity}</Badge>
                    </div>
                    <div className="font-medium text-sm mb-2">{item.title}</div>
                    <div className="text-xs text-slate-400">{item.time}</div>
                </Card>
            ))}
        </div>
    </div>
);
