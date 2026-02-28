import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

const TECH_ITEMS = [
  "React 19",
  "Node 22",
  "MongoDB 8.0",
  "Express 5.0",
  "OpenAI GPT-4o",
  "Groq",
  "LangChain.js",
  "Pinecone",
  "Tailwind 4.0",
  "TypeScript 5.6",
  "Docker",
  "Vercel",
];

function TechOrbit() {
  const groupRef = useRef<THREE.Group>(null);

  const items = useMemo(() => {
    return TECH_ITEMS.map((text, i) => {
      const angle = (i / TECH_ITEMS.length) * Math.PI * 2;
      const radius = 3.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      return { text, position: [x, 0, z] as [number, number, number] };
    });
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Text
            position={item.position}
            color={i % 2 === 0 ? "#00d4ff" : "#ffffff"}
            fontSize={0.4}
            maxWidth={2}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            font="https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOV.woff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {item.text}
          </Text>
        </Float>
      ))}
    </group>
  );
}

export default function TechStack() {
  return (
    <section
      id="tech"
      className="py-32 bg-dark-surface relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-accent">Stack</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Modern MERN ecosystem supercharged with AI capabilities.
          </p>
        </motion.div>

        <div className="h-[500px] w-full relative">
          <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <TechOrbit />
          </Canvas>

          {/* Overlay gradient for depth */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-dark-surface via-transparent to-dark-surface" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-dark-surface via-transparent to-dark-surface" />
        </div>
      </div>
    </section>
  );
}
