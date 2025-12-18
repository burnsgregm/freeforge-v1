import { Plus } from 'lucide-react';
import { TopologyCanvas } from './TopologyCanvas';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

const NODES = [
    { id: 'NODE_001', name: 'Gate B Cam 1', status: 'online', type: 'Camera' },
    { id: 'NODE_002', name: 'Gate B LIDAR', status: 'offline', type: 'LIDAR' },
    { id: 'NODE_003', name: 'Field Cam Main', status: 'online', type: 'Camera' },
];

export function NodeTopology() {
    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
            {/* Left Panel: Node List */}
            <div className="w-full lg:w-[300px] flex flex-col gap-4">
                <Card className="flex-1 flex flex-col p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white">Nodes</h3>
                        <Button size="icon" variant="ghost"><Plus className="w-4 h-4" /></Button>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                        {NODES.map(node => (
                            <div key={node.id} className="p-3 bg-navy-900 rounded-lg border border-navy-700 hover:border-indigo-500 cursor-pointer transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="font-mono text-xs text-slate-500">{node.id}</div>
                                    <Badge variant={node.status === 'online' ? 'success' : 'critical'} size="sm" className="h-2 w-2 p-0 rounded-full"> </Badge>
                                </div>
                                <div className="font-bold text-sm text-slate-200">{node.name}</div>
                                <div className="text-xs text-indigo-400 mt-1">{node.type}</div>
                            </div>
                        ))}
                    </div>

                    <Button variant="secondary" fullWidth className="mt-4">Add New Node</Button>
                </Card>
            </div>

            {/* Right Panel: 3D View */}
            <div className="flex-1 bg-navy-900 rounded-2xl border border-navy-800 overflow-hidden relative">
                <TopologyCanvas />
                <div className="absolute top-4 right-4 bg-navy-800/80 p-2 rounded text-xs text-slate-400">
                    <p>Left Click: Rotate</p>
                    <p>Right Click: Pan</p>
                    <p>Scroll: Zoom</p>
                </div>

                {/* Overlay Controls */}
                <div className="absolute top-4 right-4 bg-navy-800/80 backdrop-blur p-3 rounded-lg border border-navy-700 space-y-2">
                    <label className="flex items-center gap-2 text-xs text-slate-300">
                        <input type="checkbox" checked readOnly className="rounded bg-navy-900 border-navy-600" /> Show Frustums
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300">
                        <input type="checkbox" checked readOnly className="rounded bg-navy-900 border-navy-600" /> Show LIDAR
                    </label>
                </div>
            </div>
        </div>
    );
}
