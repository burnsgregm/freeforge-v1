import { Layers, Eye, Activity, Map, Users, Zap } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

const LAYERS = [
    { id: 'entities', label: 'Entities', icon: Users, default: true },
    { id: 'risk', label: 'Risk Halos', icon: Zap, default: true },
    { id: 'velocity', label: 'Velocity Vectors', icon: Activity, default: false },
    { id: 'trails', label: 'Path Trails', icon: Map, default: false },
    { id: 'social', label: 'Social Radar', icon: Users, default: false },
    { id: 'terrain', label: 'Behavior Terrain', icon: Layers, default: true },
];

export function LayerControls() {
    return (
        <Card className="w-64 bg-navy-900 border-navy-800 flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-navy-800">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">View Layers</h3>
            </div>

            <div className="space-y-3">
                {LAYERS.map(layer => (
                    <label key={layer.id} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3 text-slate-300 group-hover:text-white transition-colors">
                            <layer.icon className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                            <span className="text-sm font-medium">{layer.label}</span>
                        </div>
                        <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={layer.default} />
                            <div className="w-8 h-4 bg-navy-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                        </div>
                    </label>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-navy-800">
                <div className="text-xs text-slate-500 mb-2 uppercase font-bold">Camera Overlay</div>
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <Eye className="w-4 h-4" /> Show FOV Cones
                    <input type="checkbox" className="ml-auto accent-indigo-500" defaultChecked />
                </label>
            </div>
        </Card>
    );
}
