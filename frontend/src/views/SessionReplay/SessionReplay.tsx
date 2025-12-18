import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Play, Pause, SkipBack, SkipForward, ArrowLeft } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface SessionData {
    id: string;
    name: string;
    sport: string;
    startTime: string;
    duration: number;
    status: string;
}

export const SessionReplay = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState<SessionData | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const playbackRef = useRef<number>();

    // Mock fetch session details
    useEffect(() => {
        // In real app: fetch(`/api/sessions/${id}`)
        setSession({
            id: id || '1',
            name: 'Championship Final Game 3',
            sport: 'BASKETBALL',
            startTime: new Date().toISOString(),
            duration: 1200, // 20 mins
            status: 'COMPLETED'
        });
    }, [id]);

    // Playback loop
    useEffect(() => {
        if (isPlaying) {
            playbackRef.current = window.setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= (session?.duration || 0)) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000); // 1x Speed
        } else {
            clearInterval(playbackRef.current);
        }
        return () => clearInterval(playbackRef.current);
    }, [isPlaying, session]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full gap-4 p-4 text-white">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/sessions')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <div>
                    <h1 className="text-xl font-bold">{session?.name || 'Loading...'}</h1>
                    <div className="text-sm text-slate-400">
                        {session?.sport} • {new Date(session?.startTime || '').toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* 3D Replay Viewport */}
                <div className="flex-1 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800">
                    <div className="absolute top-4 left-4 z-10 bg-black/50 px-2 py-1 rounded text-xs">
                        REPLAY MODE
                    </div>
                    <Canvas camera={{ position: [0, -40, 30] }}>
                        <ambientLight intensity={0.5} />
                        <gridHelper args={[100, 100, 0x334155, 0x0f172a]} rotation={[Math.PI / 2, 0, 0]} />
                        <OrbitControls />
                        {/* Placeholder for entities at currentTime */}
                        <mesh position={[Math.sin(currentTime * 0.1) * 5, Math.cos(currentTime * 0.1) * 5, 1]}>
                            <sphereGeometry args={[0.5]} />
                            <meshStandardMaterial color="orange" />
                        </mesh>
                    </Canvas>
                </div>

                {/* Sidebar Stats */}
                <div className="w-80 flex flex-col gap-4">
                    <Card className="flex-1">
                        <div className="p-4">
                            <h3 className="font-semibold mb-4">Events Log</h3>
                            <div className="space-y-2 text-sm text-slate-400">
                                <div className="flex justify-between">
                                    <span>Sync Start</span>
                                    <span>0:00</span>
                                </div>
                                <div className="flex justify-between text-yellow-400">
                                    <span>Anomaly Detected</span>
                                    <span>0:45</span>
                                </div>
                                <div className="flex justify-between text-red-400">
                                    <span>Speed Violation</span>
                                    <span>1:20</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Controls Bar */}
            <Card className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="flex flex-col gap-2">
                    {/* Scrubber */}
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="w-12 text-right">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={session?.duration || 100}
                            value={currentTime}
                            onChange={(e) => setCurrentTime(Number(e.target.value))}
                            className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="w-12">{formatTime(session?.duration || 0)}</span>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}>
                            <SkipBack className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="primary"
                            size="icon"
                            className="w-12 h-12 rounded-full"
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setCurrentTime(Math.min(session?.duration || 0, currentTime + 10))}>
                            <SkipForward className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
