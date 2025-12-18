import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

const ZONES = [
    { id: 'gate-a', name: 'GATE A', type: 'GATE', status: 'critical', x: '10%', y: '20%' },
    { id: 'gate-b', name: 'GATE B', type: 'GATE', status: 'normal', x: '80%', y: '20%' },
    { id: 'field', name: 'FIELD', type: 'FIELD', status: 'normal', x: '45%', y: '45%' },
    { id: 'concourse-n', name: 'CONCOURSE N', type: 'CONCOURSE', status: 'high', x: '45%', y: '10%' },
    { id: 'concourse-s', name: 'CONCOURSE S', type: 'CONCOURSE', status: 'normal', x: '45%', y: '80%' },
];

export function StadiumMap() {
    return (
        <div className="relative w-full h-[600px] bg-navy-900 rounded-2xl border border-navy-800 overflow-hidden shadow-inner">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            />

            {/* Stadium Visual Placeholder - Simple SVG representation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600">
                {/* Field */}
                <rect x="250" y="150" width="500" height="300" rx="40" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <circle cx="500" cy="300" r="50" fill="none" stroke="#334155" strokeWidth="2" />
                <line x1="500" y1="150" x2="500" y2="450" stroke="#334155" strokeWidth="2" />

                {/* Zones Outline */}
                <path d="M 150 100 Q 500 0 850 100 L 900 250 L 850 500 Q 500 600 150 500 L 100 250 Z"
                    fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="10 5" opacity="0.3" />
            </svg>

            {/* Zone Cards Overlay */}
            {ZONES.map((zone) => (
                <div
                    key={zone.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105 hover:z-10"
                    style={{ left: zone.x, top: zone.y }}
                >
                    <Card className={`w-48 p-3 bg-navy-800/90 backdrop-blur-sm border-l-4 ${zone.status === 'critical' ? 'border-l-status-critical shadow-[0_0_20px_rgba(220,38,38,0.2)]' :
                            zone.status === 'high' ? 'border-l-status-high' :
                                'border-l-status-success'
                        }`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-slate-300 tracking-wider">{zone.name}</span>
                            <Badge variant={zone.status as any} size="sm">{zone.status}</Badge>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-slate-400">Last event: 2m ago</div>
                            <div className="text-xs text-slate-400">Anomalies: <span className="text-white font-mono">3</span></div>
                        </div>
                    </Card>
                </div>
            ))}
        </div>
    );
}
