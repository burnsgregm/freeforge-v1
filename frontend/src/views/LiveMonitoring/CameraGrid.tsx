
import { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { VideoPlaceholder } from './components/VideoPlaceholder';
import { Api } from '../../../services/api';

interface CameraNode {
    id: string; // real ID (uuid)
    nodeId: string; // human readable (CAM_01)
    status: string;
}

export const CameraGrid = () => {
    const [cameras, setCameras] = useState<CameraNode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const data = await Api.getNodes();
                // Map backend nodes to camera view
                // Backend node has: nodeId (string), id (uuid), config...
                const mapped = data.nodes.map((n: any) => ({
                    id: n._id,
                    nodeId: n.nodeId,
                    status: 'ONLINE' // Assume online if fetched for now
                }));

                if (mapped.length > 0) {
                    setCameras(mapped);
                } else {
                    // Fallback to placeholders if no real nodes found (for demo preservation)
                    setCameras([
                        { id: 'mock1', nodeId: 'CAM_01 (Sim)', status: 'ONLINE' },
                        { id: 'mock2', nodeId: 'CAM_02 (Sim)', status: 'ONLINE' },
                    ]);
                }
            } catch (e) {
                console.error("Failed to fetch camera nodes", e);
                // Fallback
                setCameras([
                    { id: 'mock1', nodeId: 'CAM_01 (Offline)', status: 'OFFLINE' },
                    { id: 'mock2', nodeId: 'CAM_02 (Offline)', status: 'OFFLINE' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchNodes();
    }, []);

    if (loading) {
        return <div className="text-white text-center p-4">Loading streams...</div>;
    }

    return (
        <div className="grid grid-cols-2 gap-2 h-full">
            {cameras.map(cam => (
                <div key={cam.id} className="relative bg-black rounded overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                        {cam.status === 'ONLINE' ? (
                            <div className="flex-1 bg-black relative w-full h-full">
                                {/* Pass nodeId only if it's not a mock ID, or handle mock logic inside VideoPlaceholder? 
                                    Actually, if we want real stream, we need real nodeId (CAM_01 etc from sim).
                                    If mapped from real API, cam.nodeId is what we want.
                                */}
                                <VideoPlaceholder
                                    label={cam.nodeId}
                                    // Use cam.nodeId as endpoint parameter. 
                                    // If it's a mock fallback, this might fail to stream (404) and component will fallback to noise.
                                    nodeId={cam.nodeId}
                                />
                            </div>) : (
                            <div className="flex flex-col items-center">
                                <Camera className="h-8 w-8 mb-2 opacity-50" />
                                <span className="text-xs">OFFLINE</span>
                            </div>
                        )}
                    </div>

                    {/* Overlay */}
                    <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white backdrop-blur-sm">
                        {cam.nodeId}
                    </div>
                    <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${cam.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
            ))}
        </div>
    );
};
