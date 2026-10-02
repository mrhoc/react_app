import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Building() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function BIMViewer() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
      />

      <Building />

      <OrbitControls />
    </Canvas>
  );
}