import { Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

const ANOMALIES = [
    { id: 1, time: '11:22', zone: 'Gate B', type: 'Crowd Compression', severity: 'critical', score: 87, delta: '+150%' },
    { id: 2, time: '11:20', zone: 'Concourse N', type: 'Rapid Movement', severity: 'high', score: 65, delta: '+80%' },
    { id: 3, time: '11:15', zone: 'Field', type: 'Unauthorized Access', severity: 'medium', score: 45, delta: 'N/A' },
    { id: 4, time: '11:10', zone: 'Gate A', type: 'Loitering', severity: 'low', score: 20, delta: '+15%' },
];

export function AnomalyPanel() {
    return (
        <div className="w-full lg:w-[360px] bg-navy-900 border border-navy-800 rounded-2xl flex flex-col h-[600px]">
            {/* Header */}
            <div className="p-4 border-b border-navy-800 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white">Active Anomalies</h3>
                    <div className="text-xs text-slate-400">23 Detected • <span className="text-status-critical">4 Critical</span></div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon"><Filter className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {ANOMALIES.map((item) => (
                    <div
                        key={item.id}
                        className="group bg-navy-800 rounded-xl p-3 border border-navy-700 hover:border-indigo-500/50 hover:bg-navy-800/80 transition-all cursor-pointer relative overflow-hidden"
                    >
                        {/* Severity Indicator Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.severity === 'critical' ? 'bg-status-critical' :
                            item.severity === 'high' ? 'bg-status-high' :
                                item.severity === 'medium' ? 'bg-status-medium' : 'bg-status-low'
                            }`} />

                        <div className="pl-3">
                            <div className="flex justify-between items-start mb-1">
                                <Badge variant={item.severity as any} size="sm">{item.severity}</Badge>
                                <span className="text-xs font-mono text-slate-500">{item.time}</span>
                            </div>

                            <h4 className="font-bold text-white text-sm mb-1 group-hover:text-indigo-300 transition-colors">{item.type}</h4>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 uppercase tracking-wide font-semibold">{item.zone}</span>
                                <div className="flex gap-3 text-slate-500">
                                    <span>Risk: <span className={item.score > 80 ? 'text-red-400' : 'text-slate-300'}>{item.score}</span></span>
                                    <span>Δ: {item.delta}</span>
                                </div>
                            </div>
                        </div>

                        {/* Hover Actions Overlay (Simulated) */}
                        <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="secondary" className="h-7 text-xs px-2">View</Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-navy-800 bg-navy-950/50 rounded-b-2xl">
                <Button variant="primary" fullWidth size="md">View All Anomalies</Button>
            </div>
        </div>
    );
}
