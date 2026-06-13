"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Apple-style hero centerpiece: a metallic space-frame truss (a 3D Warren/
 * octet lattice). On-brand for a structural / truss-solver engineer. Crisp
 * brushed-metal members + joints, slow cinematic rotation, dark background.
 * No blurred gradients — every edge reads.
 */

export interface TrussLive {
  intro: number; // 0 -> 1 reveal
}

function buildLattice() {
  // Two parallel grids (top & bottom chord) joined by diagonals — a space frame.
  const nx = 4;
  const nz = 2;
  const sx = 0.92;
  const sz = 0.92;
  const h = 0.85;

  const nodes: THREE.Vector3[] = [];
  const idx = (level: number, i: number, j: number) =>
    level * (nx + 1) * (nz + 1) + i * (nz + 1) + j;

  for (let level = 0; level < 2; level++) {
    for (let i = 0; i <= nx; i++) {
      for (let j = 0; j <= nz; j++) {
        nodes.push(
          new THREE.Vector3(
            (i - nx / 2) * sx,
            level === 0 ? -h / 2 : h / 2,
            (j - nz / 2) * sz
          )
        );
      }
    }
  }

  const edges: [number, number][] = [];
  const add = (a: number, b: number) => edges.push([a, b]);

  for (let level = 0; level < 2; level++) {
    for (let i = 0; i <= nx; i++) {
      for (let j = 0; j <= nz; j++) {
        if (i < nx) add(idx(level, i, j), idx(level, i + 1, j));
        if (j < nz) add(idx(level, i, j), idx(level, i, j + 1));
      }
    }
  }
  // verticals + diagonals between chords
  for (let i = 0; i <= nx; i++) {
    for (let j = 0; j <= nz; j++) {
      add(idx(0, i, j), idx(1, i, j));
      if (i < nx) add(idx(0, i, j), idx(1, i + 1, j));
      if (j < nz) add(idx(0, i, j), idx(1, i, j + 1));
    }
  }

  return { nodes, edges };
}

export function TrussStructure({ live }: { live: React.RefObject<TrussLive> }) {
  const group = useRef<THREE.Group>(null);
  const { nodes, edges } = useMemo(buildLattice, []);

  // One instanced cylinder per member.
  const memberRef = useRef<THREE.InstancedMesh>(null);
  const jointRef = useRef<THREE.InstancedMesh>(null);

  const memberData = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    return edges.map(([a, b]) => {
      const va = nodes[a];
      const vb = nodes[b];
      const mid = va.clone().add(vb).multiplyScalar(0.5);
      const dir = vb.clone().sub(va);
      const len = dir.length();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        up,
        dir.clone().normalize()
      );
      return { mid, quat, len };
    });
  }, [nodes, edges]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.12;
    }
    const intro = live.current?.intro ?? 1;
    const m = memberRef.current;
    if (m) {
      memberData.forEach((d, i) => {
        dummy.position.copy(d.mid);
        dummy.quaternion.copy(d.quat);
        dummy.scale.set(1, Math.max(0.0001, d.len * intro), 1);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      });
      m.instanceMatrix.needsUpdate = true;
    }
    const j = jointRef.current;
    if (j) {
      nodes.forEach((n, i) => {
        dummy.position.copy(n);
        dummy.quaternion.identity();
        const s = intro;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        j.setMatrixAt(i, dummy.matrix);
      });
      j.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <instancedMesh
        ref={memberRef}
        args={[undefined, undefined, edges.length]}
        castShadow
      >
        <cylinderGeometry args={[0.022, 0.022, 1, 12]} />
        <meshStandardMaterial
          color="#c8ccd2"
          metalness={0.95}
          roughness={0.28}
        />
      </instancedMesh>

      <instancedMesh ref={jointRef} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[0.052, 20, 20]} />
        <meshStandardMaterial
          color="#2dd4bf"
          metalness={0.6}
          roughness={0.2}
          emissive="#0c4f47"
          emissiveIntensity={0.5}
        />
      </instancedMesh>
    </group>
  );
}
