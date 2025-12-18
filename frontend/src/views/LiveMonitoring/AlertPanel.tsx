import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { wsService } from '../../services/websocket';

interface Anomaly {
    id: string;
    headline: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    time: string;
}

export const AlertPanel = () => {
    const [alerts, setAlerts] = useState<Anomaly[]>([]);

    useEffect(() => {
        // Connect if not already (MeshView also connects, but idempotent)
        wsService.connect(import.meta.env.VITE_WS_URL || 'https://motiongrid-api-rrsyyeqnbq-uc.a.run.app');

        const unsubscribe = wsService.on('anomaly:detected', (data: any) => {
            console.log('Anomaly received:', data);

            // Map Python payload to frontend model
            // Python sends: { anomalyId, headline, severity, occurredAt, ... }
            const newAlert: Anomaly = {
                id: data.anomalyId || 'unknown',
                headline: data.headline || 'Unknown Anomaly',
                severity: data.severity || 'LOW',
                // occurredAt is ISO string now
                time: data.occurredAt ? new Date(data.occurredAt).toLocaleTimeString() : new Date().toLocaleTimeString()
            };

            setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep last 50
        });

        return () => {
            // Unsubscribe logic if wsService supports it, or just let it exist
        };
    }, []);

    return (
        <div className="bg-gray-800 border-l border-gray-700 w-80 flex flex-col h-full">
            <div className="p-4 border-b border-gray-700">
                <h3 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    Active Alerts
                </h3>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3">
                {alerts.length === 0 && (
                    <div className="text-gray-500 text-center text-sm py-8">
                        No active alerts.
                    </div>
                )}
                {alerts.map(alert => (
                    <div key={alert.id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300' :
                                alert.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300' : 'bg-blue-500/20 text-blue-300'
                                }`}>
                                {alert.severity}
                            </span>
                            <span className="text-xs text-gray-400">{alert.time}</span>
                        </div>
                        <h4 className="text-sm font-medium mb-2">{alert.headline}</h4>

                        {/* Triage Actions */}
                        <div className="flex gap-2 mt-2">
                            <button className="flex-1 flex items-center justify-center gap-1 bg-green-900/30 hover:bg-green-900/50 text-green-300 py-1 rounded text-xs transition-colors">
                                <CheckCircle className="h-3 w-3" /> Confirm
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-1 bg-gray-600/30 hover:bg-gray-600/50 text-gray-300 py-1 rounded text-xs transition-colors">
                                <XCircle className="h-3 w-3" /> Dismiss
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
