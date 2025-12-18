import { useEffect } from 'react';
import { MeshView3D } from './MeshView3D';
import { LayerControls } from './components/LayerControls';
import { LiveAlerts } from './components/LiveAlerts';
import { CameraStrip } from './components/CameraStrip';
import { wsService } from '../../services/websocket';
import { Button } from '../../components/ui/Button';
import { Pause, RefreshCw } from 'lucide-react';

export const LiveMonitoring = () => {
    useEffect(() => {
        const wsUrl = (import.meta as any).env?.VITE_WS_URL || 'https://motiongrid-api-rrsyyeqnbq-uc.a.run.app';
        wsService.connect(wsUrl);
    }, []);

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] gap-4">
            {/* Top Controls */}
            <div className="flex items-center justify-between pb-2 border-b border-navy-800">
                <div className="flex gap-4 items-center">
                    <h2 className="text-lg font-bold text-white">Zone A: Main Concourse</h2>
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs text-green-400 font-mono">LIVE FEED</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button size="icon" variant="ghost"><RefreshCw className="w-4 h-4" /></Button>
                    <Button size="icon" variant="secondary"><Pause className="w-4 h-4" /></Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 gap-4 overflow-hidden">
                {/* Left: Layers */}
                <div className="flex-shrink-0">
                    <LayerControls />
                </div>

                {/* Center: 3D View */}
                <div className="flex-1 bg-black rounded-2xl border border-navy-800 relative overflow-hidden group">
                    <MeshView3D />

                    {/* Camera Strip Overlay */}
                    <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <CameraStrip />
                    </div>
                </div>

                {/* Right: Alerts */}
                <div className="flex-shrink-0">
                    <LiveAlerts />
                </div>
            </div>
        </div>
    );
};

