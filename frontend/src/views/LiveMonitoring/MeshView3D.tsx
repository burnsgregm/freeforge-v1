import { useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { wsService } from '../../services/websocket';

interface Entity {
    id: string;
    type: string;
    position: { x: number; y: number; z: number };
    velocity: { x: number; y: number; z: number };
    radius?: number;
    color?: number[];
    severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

const EntityMesh = ({ entity }: { entity: Entity }) => {
    // Convert array color or hex to THREE.Color
    const color = useMemo(() => {
        if (Array.isArray(entity.color)) {
            return new THREE.Color(entity.color[0] / 255, entity.color[1] / 255, entity.color[2] / 255);
        }
        return new THREE.Color(entity.color || 'white');
    }, [entity.color]);

    const VelocityArrow = ({ velocity }: { velocity: { x: number; y: number; z: number } }) => {
        const length = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);
        if (length < 0.1) return null;
        // Normalize direction
        const dir = new THREE.Vector3(velocity.x, velocity.y, velocity.z).normalize();
        return (
            <arrowHelper args={[dir, new THREE.Vector3(0, 0, 0), Math.min(length, 2), 0xffff00]} />
        );
    };

    const RiskHalo = ({ severity }: { severity?: string }) => {
        if (!severity || severity === 'LOW') return null;
        const color = severity === 'CRITICAL' ? 'red' : severity === 'HIGH' ? 'orange' : 'yellow';
        return (
            <mesh position={[0, -0.9, 0]} rotation={[0, 0, 0]}>
                <ringGeometry args={[0.5, 0.7, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
        );
    };

    return (
        <group position={[entity.position.x, entity.position.y, entity.position.z]}>
            {/* Entity Body */}
            <mesh castShadow receiveShadow>
                <capsuleGeometry args={[entity.radius || 0.3, 1.8, 4, 8]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>

            <RiskHalo severity={entity.severity} />
            <VelocityArrow velocity={entity.velocity} />

            {/* ID Tag */}
            <Html position={[0, 2.2, 0]} center distanceFactor={15}>
                <div className={`text-[10px] px-1.5 py-0.5 rounded backdrop-blur-md whitespace-nowrap border font-mono
                    ${entity.severity === 'CRITICAL' ? 'bg-red-500/20 border-red-500 text-red-200' :
                        entity.severity === 'HIGH' ? 'bg-orange-500/20 border-orange-500 text-orange-200' :
                            'bg-slate-900/60 border-slate-700 text-slate-300'}`}>
                    {entity.id}
                </div>
            </Html>
        </group>
    );
};

const Floor = () => {
    return (
        <mesh receiveShadow rotation={[0, 0, 0]} position={[0, 0, -0.01]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.2} />
            <gridHelper args={[100, 50, 0x334155, 0x1e293b]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
    );
};

export const MeshView3D = () => {
    const [entities, setEntities] = useState<Entity[]>([]);
    const [stats, setStats] = useState({ fps: 0, frame: 0, time: 0 });

    useEffect(() => {
        wsService.connect(import.meta.env.VITE_WS_URL || 'https://motiongrid-api-rrsyyeqnbq-uc.a.run.app');
        const unsubscribe = wsService.on('entity:tracking', (data: { entities: Entity[], stats?: any }) => {
            if (data && data.entities) setEntities(data.entities);
            if (data && data.stats) setStats(data.stats);
        });
        return () => { }; // Connection managed globally or by context in real app
    }, []);

    return (
        <div className="w-full h-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative shadow-inner">
            <div className="absolute top-4 left-4 z-10 space-y-2">
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 backdrop-blur shadow-lg space-y-2">
                    <div className="font-bold text-slate-100 mb-1 border-b border-slate-700 pb-1">Live Telemetry</div>

                    <div className="flex items-center justify-between gap-4">
                        <span>Entities</span>
                        <span className="font-mono text-white text-right">{entities.length}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <span>Sim FPS</span>
                        <span className={`font-mono text-right ${stats.fps < 25 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {stats.fps.toFixed(1)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <span>Sync</span>
                        <div className="flex items-center gap-1.5 justify-end">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="font-mono text-white">ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>

            <Canvas shadows camera={{ position: [0, -30, 20], fov: 50, up: [0, 0, 1] }}>
                <color attach="background" args={['#020617']} />
                <fog attach="fog" args={['#020617', 20, 90]} />

                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[10, -20, 20]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <pointLight position={[-10, 10, 5]} intensity={0.5} color="#3b82f6" />

                <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />

                <Floor />
                <axesHelper args={[2]} position={[0, 0, 0.1]} />

                {entities.map(e => (
                    <EntityMesh key={e.id} entity={e} />
                ))}
            </Canvas>
        </div>
    );
};
