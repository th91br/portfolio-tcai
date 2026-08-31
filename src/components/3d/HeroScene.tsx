import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 1. Futuristic Liquid Glass Core Artifact
const FloatingGlassArtifact: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x -= delta * 0.1;
      wireframeRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group position={[2.2, 0.2, 0]}>
      {/* 1. Main Liquid Smoke Glass Icosahedron */}
      <mesh ref={meshRef} scale={1.4}>
        <icosahedronGeometry args={[1.3, 2]} />
        <meshPhysicalMaterial
          color="#061226"
          emissive="#002b55"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.12}
          transmission={0.92}
          ior={1.5}
          thickness={1.6}
          transparent={true}
          opacity={0.88}
        />
      </mesh>

      {/* 2. Outer Geodesic Quantum Wireframe Cage */}
      <mesh ref={wireframeRef} scale={1.65}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshBasicMaterial
          color="#00D2F6"
          wireframe={true}
          transparent={true}
          opacity={0.22}
        />
      </mesh>

      {/* 3. Inner Glowing Quantum Energy Core */}
      <mesh scale={0.7}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial
          color="#00D2F6"
          transparent={true}
          opacity={0.15}
        />
      </mesh>
    </group>
  );
};

// 2. Main High-Performance Isolated 3D Scene
export const HeroScene: React.FC = () => {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 select-none overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        {/* Cinematic Studio Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[8, 10, 5]} intensity={1.8} color="#00D2F6" />
        <directionalLight position={[-8, -8, -4]} intensity={1.4} color="#015EEF" />
        <pointLight position={[0, 4, 3]} intensity={2.0} color="#ffffff" />
        <pointLight position={[3, -2, 2]} intensity={1.5} color="#0096F5" />

        {/* Ambient Neural Particle Field */}
        <Sparkles
          count={65}
          scale={12}
          size={2.8}
          speed={0.4}
          color="#00D2F6"
          opacity={0.55}
        />

        {/* Floating Physical Glass Sculpture with Inertial Physics */}
        <Float
          speed={1.6}
          rotationIntensity={0.8}
          floatIntensity={1.2}
          floatingRange={[-0.25, 0.25]}
        >
          <FloatingGlassArtifact />
        </Float>
      </Canvas>
    </div>
  );
};

export default HeroScene;
