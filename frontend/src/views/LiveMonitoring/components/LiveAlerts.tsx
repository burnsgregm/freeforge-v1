import { AlertTriangle, Clock } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

const ALERTS = [
    { id: 1, type: 'Crowd Crush', risk: 92, time: '10s ago', zone: 'Gate B' },
    { id: 2, type: 'Fight Precursor', risk: 78, time: '32s ago', zone: 'Concourse' },
    { id: 3, type: 'Fallen Object', risk: 45, time: '1m ago', zone: 'Aisle 12' },
];

export function LiveAlerts() {
    return (
        <Card className="w-80 bg-navy-900 border-navy-800 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-navy-800">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-status-critical" />
                    <h3 className="font-bold text-white text-sm">Live Alerts</h3>
                </div>
                <Badge variant="critical">3 Active</Badge>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
                {ALERTS.map(alert => (
                    <div key={alert.id} className="bg-navy-800 p-3 rounded-lg border border-navy-700 hover:border-red-500/50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-red-300">{alert.type}</span>
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {alert.time}
                            </span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="text-xs text-slate-400">{alert.zone}</div>
                            <div className="text-sm font-mono font-bold text-white">
                                {alert.risk}% <span className="text-xs font-sans font-normal text-slate-500">Risk</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
