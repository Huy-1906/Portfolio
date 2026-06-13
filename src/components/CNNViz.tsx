"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type StageId = "input" | "conv1" | "pool" | "conv2" | "output";

type Stage = {
  id: StageId;
  label: string;
  x: number;
  grid: number; // tiles per side
  tile: number; // tile size
  spread: number; // gap multiplier
};

const STAGES: Stage[] = [
  { id: "input", label: "Input RVE", x: -4.4, grid: 8, tile: 0.18, spread: 1.0 },
  { id: "conv1", label: "Conv 3×3", x: -2.2, grid: 6, tile: 0.22, spread: 1.05 },
  { id: "pool", label: "Pool 2×2", x: 0, grid: 4, tile: 0.3, spread: 1.1 },
  { id: "conv2", label: "Conv features", x: 2.2, grid: 5, tile: 0.24, spread: 1.05 },
  { id: "output", label: "Predicted field", x: 4.4, grid: 8, tile: 0.18, spread: 1.0 },
];

// Viridis colormap — 5 anchor stops matching --v0..--v4. Linear interp in RGB.
const VIRIDIS: [number, number, number][] = [
  [0.267, 0.005, 0.329], // #440154
  [0.231, 0.322, 0.545], // #3B528B
  [0.129, 0.565, 0.549], // #21908C
  [0.365, 0.784, 0.388], // #5DC863
  [0.992, 0.906, 0.145], // #FDE725
];

function viridis(t: number): [number, number, number] {
  const c = Math.max(0, Math.min(1, t)) * (VIRIDIS.length - 1);
  const i = Math.floor(c);
  const f = c - i;
  const a = VIRIDIS[i];
  const b = VIRIDIS[Math.min(i + 1, VIRIDIS.length - 1)];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

const tmpObj = new THREE.Object3D();
const tmpColor = new THREE.Color();

// Keeps the demand-mode render loop alive while the user is interacting.
function RenderPump({ active }: { active: React.RefObject<boolean> }) {
  const { invalidate } = useThree();
  useFrame(() => {
    if (active.current) invalidate();
  });
  return null;
}

function LayerPlane({
  stage,
  onHover,
  onLeave,
}: {
  stage: Stage;
  onHover: (s: Stage) => void;
  onLeave: () => void;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = stage.grid * stage.grid;

  // Stable per-tile phase + base activation so the field is deterministic.
  const tiles = useMemo(() => {
    const arr: { ix: number; iy: number; phase: number; base: number }[] = [];
    let seed = stage.x * 1000 + stage.grid;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let iy = 0; iy < stage.grid; iy++) {
      for (let ix = 0; ix < stage.grid; ix++) {
        arr.push({ ix, iy, phase: rnd() * Math.PI * 2, base: 0.2 + rnd() * 0.8 });
      }
    }
    return arr;
  }, [stage.x, stage.grid]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    const half = (stage.grid - 1) / 2;
    const step = stage.tile * (1 + stage.spread * 0.35);
    for (let i = 0; i < count; i++) {
      const tile = tiles[i];
      const wave = 0.5 + 0.5 * Math.sin(t * 1.2 + tile.phase + stage.x * 0.5);
      const activation = Math.max(0, Math.min(1, tile.base * (0.55 + 0.45 * wave)));
      const depth = 0.06 + activation * 0.6;

      tmpObj.position.set(
        (tile.ix - half) * step,
        (tile.iy - half) * step,
        depth / 2,
      );
      tmpObj.scale.set(stage.tile, stage.tile, depth);
      tmpObj.updateMatrix();
      mesh.setMatrixAt(i, tmpObj.matrix);

      const [r, g, b] = viridis(activation);
      tmpColor.setRGB(r, g, b);
      mesh.setColorAt(i, tmpColor);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <group position={[stage.x, 0, 0]}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(stage);
        }}
        onPointerOut={() => onLeave()}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.35} metalness={0.15} />
      </instancedMesh>
    </group>
  );
}

function Connectors() {
  const lines = useMemo(() => {
    const objs: THREE.Line[] = [];
    for (let i = 0; i < STAGES.length - 1; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(STAGES[i].x + 0.7, 0, 0),
        new THREE.Vector3(STAGES[i + 1].x - 0.7, 0, 0),
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: "#2dd4bf",
        transparent: true,
        opacity: 0.35,
      });
      objs.push(new THREE.Line(geo, mat));
    }
    return objs;
  }, []);

  return (
    <group>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}

function Scene({ active }: { active: React.RefObject<boolean> }) {
  const [hovered, setHovered] = useState<Stage | null>(null);
  const { invalidate } = useThree();

  const handleHover = (s: Stage) => {
    setHovered(s);
    invalidate();
  };
  const handleLeave = () => {
    setHovered(null);
    invalidate();
  };

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 8]} intensity={1.3} />
      <directionalLight position={[-6, -2, -4]} intensity={0.4} color="#2dd4bf" />
      <pointLight position={[0, 0, 6]} intensity={0.6} color="#fde725" />

      <RenderPump active={active} />
      <Connectors />

      {STAGES.map((stage) => (
        <LayerPlane
          key={stage.id}
          stage={stage}
          onHover={handleHover}
          onLeave={handleLeave}
        />
      ))}

      {hovered ? (
        <Html
          position={[hovered.x, 1.6, 0]}
          center
          distanceFactor={9}
          style={{ pointerEvents: "none" }}
        >
          <div className="mono whitespace-nowrap rounded-md bg-surface-2 px-3 py-1.5 text-xs text-fg shadow-lg ring-1 ring-border">
            {hovered.label}
          </div>
        </Html>
      ) : null}

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={6}
        maxDistance={16}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
        autoRotate
        autoRotateSpeed={0.5}
        onChange={() => invalidate()}
      />
    </>
  );
}

export default function CNNViz() {
  const active = useRef(false);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.75]}
        camera={{ position: [0, 2.5, 11], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        className="relative h-full w-full"
        onPointerEnter={() => {
          active.current = true;
        }}
        onPointerLeave={() => {
          active.current = false;
        }}
      >
        <Scene active={active} />
      </Canvas>
    </div>
  );
}
