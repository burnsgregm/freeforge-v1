import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Center, Text } from '@react-three/drei';

const Node = ({ position, color, label }: { position: [number, number, number], color: string, label: string }) => {
    return (
        <group position={position}>
            {/* Node visual */}
            <mesh>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Frustum Visual (Cone) */}
            <mesh position={[0, 0, 2]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[1, 4, 32, 1, true]} />
                <meshStandardMaterial color={color} wireframe opacity={0.3} transparent />
            </mesh>

            {/* Label */}
            <Text position={[0, 1.2, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
                {label}
            </Text>
        </group>
    );
};

export function TopologyCanvas() {
    return (
        <div className="w-full h-full bg-slate-950 rounded-lg overflow-hidden">
            <Canvas>
                <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={50} />
                <OrbitControls makeDefault />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                <Grid infiniteGrid fadeDistance={50} sectionColor="#4f46e5" cellColor="#4f46e5" sectionSize={5} cellSize={1} />

                <Center>
                    <Node position={[0, 2, 0]} color="#10b981" label="Cam-01" />
                    <Node position={[-5, 2, 5]} color="#3b82f6" label="Lidar-01" />
                    <Node position={[5, 2, 5]} color="#3b82f6" label="Lidar-02" />
                </Center>
            </Canvas>
        </div>
    );
}
