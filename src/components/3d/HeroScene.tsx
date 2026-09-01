import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

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
        <ambientLight intensity={0.8} />
        {/* Soft subtle sapphire & sky particles */}
        <Sparkles
          count={35}
          scale={10}
          size={2.4}
          speed={0.25}
          color="#0284C7"
          opacity={0.25}
        />
      </Canvas>
    </div>
  );
};

export default HeroScene;
