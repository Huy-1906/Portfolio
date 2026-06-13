"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { extend, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

/* ------------------------------------------------------------------ */
/* Shaders                                                            */
/* ------------------------------------------------------------------ */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform vec2  uMouse;        // -1..1 across the plane
  uniform float uMouseStrength;
  uniform float uPointSize;
  uniform float uIsLine;       // 0 = points, 1 = lines

  varying float vHeight;
  varying float vFresnel;
  varying float vViewZ;

  // --- Ashima simplex noise 2D (compact) ---
  vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                             + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x  = 2.0 * fract(p * C.www) - 1.0;
    vec3 h  = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // layered fbm — the "scalar field"
  float field(vec2 p){
    float t = uTime * 0.12;
    float f = uFrequency;
    float amp = 1.0;
    float sum = 0.0;
    float norm = 0.0;
    // traveling wave component
    sum += sin(p.x * f * 1.3 + t * 2.0) * cos(p.y * f * 1.1 - t * 1.6) * 0.5;
    // fbm layers
    for (int i = 0; i < 4; i++){
      sum  += snoise(p * f + vec2(t, -t)) * amp;
      norm += amp;
      amp  *= 0.5;
      f    *= 2.0;
    }
    return sum / (norm + 0.5);
  }

  void main(){
    vec3 pos = position;
    float h = field(pos.xy);

    // cursor gaussian force bump
    vec2 m = uMouse * 5.0; // plane half-extent ~5
    float d2 = dot(pos.xy - m, pos.xy - m);
    float bump = exp(-d2 * 0.35) * uMouseStrength;
    h += bump * 1.4;

    h *= uAmplitude;
    pos.z += h;
    vHeight = h;

    // cheap analytic-ish normal from finite differences of the field
    float e = 0.15;
    float hx = (field(pos.xy + vec2(e, 0.0)) - field(pos.xy - vec2(e, 0.0))) * uAmplitude;
    float hy = (field(pos.xy + vec2(0.0, e)) - field(pos.xy - vec2(0.0, e))) * uAmplitude;
    vec3 nrm = normalize(vec3(-hx, -hy, 2.0 * e));

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vViewZ = -mv.z;

    vec3 viewNrm = normalize(normalMatrix * nrm);
    vec3 viewDir = normalize(-mv.xyz);
    vFresnel = pow(1.0 - clamp(dot(viewNrm, viewDir), 0.0, 1.0), 2.5);

    gl_Position = projectionMatrix * mv;

    // perspective-attenuated point size
    if (uIsLine < 0.5){
      gl_PointSize = uPointSize * (300.0 / max(vViewZ, 0.1));
    }
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform vec3  uFg;            // foreground (point) color
  uniform vec3  uBg;            // background / fog color
  uniform float uOpacity;
  uniform float uIsLine;
  uniform float uLineSharpness;
  uniform float uFogNear;
  uniform float uFogFar;

  varying float vHeight;
  varying float vFresnel;
  varying float vViewZ;

  void main(){
    // soft round sprite for points
    float mask = 1.0;
    if (uIsLine < 0.5){
      vec2 c = gl_PointCoord - 0.5;
      float r = length(c);
      mask = smoothstep(0.5, 0.34, r);
      if (mask <= 0.001) discard;
    }

    // luminance from displacement: peaks lighter, valleys darker
    float lum = clamp(0.5 + vHeight * 0.55, 0.0, 1.0);
    vec3 col = mix(uBg, uFg, lum);

    // fresnel rim -> near-white (toward fg in a monochrome sense)
    vec3 rim = mix(uFg, vec3(dot(uFg, vec3(0.333)) > 0.5 ? 1.0 : 0.0), 0.0);
    // push rim toward the "bright" monochrome extreme
    float bright = step(0.5, (uFg.r + uFg.g + uFg.b) / 3.0);
    vec3 rimCol = mix(vec3(1.0), vec3(0.95), bright);
    col = mix(col, rimCol, vFresnel * 0.85);

    // fog depth-fade toward bg
    float fog = smoothstep(uFogNear, uFogFar, vViewZ);
    col = mix(col, uBg, fog);

    float a = uOpacity * mask * (1.0 - fog * 0.85);
    if (uIsLine > 0.5){
      // crisper, fainter contour lines; sharpness tightens them
      a *= mix(0.18, 0.42, clamp(uLineSharpness * 0.4, 0.0, 1.0));
    }
    gl_FragColor = vec4(col, a);
  }
`;

/* ------------------------------------------------------------------ */
/* Material                                                           */
/* ------------------------------------------------------------------ */

export interface FieldUniforms {
  uTime: number;
  uAmplitude: number;
  uFrequency: number;
  uLineSharpness: number;
  uMouse: THREE.Vector2;
  uMouseStrength: number;
  uPointSize: number;
  uIsLine: number;
  uOpacity: number;
  uFg: THREE.Color;
  uBg: THREE.Color;
  uFogNear: number;
  uFogFar: number;
}

const FieldMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uAmplitude: 1,
    uFrequency: 1.2,
    uLineSharpness: 1,
    uMouse: new THREE.Vector2(0, 0),
    uMouseStrength: 0,
    uPointSize: 2.4,
    uIsLine: 0,
    uOpacity: 0.9,
    uFg: new THREE.Color("#ededed"),
    uBg: new THREE.Color("#0a0a0a"),
    uFogNear: 4,
    uFogFar: 16,
  },
  VERT,
  FRAG
);

extend({ FieldMaterialImpl });

// drei's ShaderMaterial instances also expose the uniform keys as fields
type FieldMaterial = THREE.ShaderMaterial & FieldUniforms;

declare module "@react-three/fiber" {
  interface ThreeElements {
    fieldMaterialImpl: ThreeElement<typeof FieldMaterialImpl>;
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

/** Materials the parent mutates each frame. */
export interface FieldMaterials {
  pointMat: FieldMaterial | null;
  lineMat: FieldMaterial | null;
}

export interface SolvingFieldProps {
  /** plane size in world units */
  size?: number;
  /** segments per side (≈200 => high-res) */
  segments?: number;
  /** populated with the live ShaderMaterials so the parent can write uniforms */
  materialsRef?: React.MutableRefObject<FieldMaterials | null>;
}

/**
 * The field mesh: GPU points + thin iso-contour line grid sharing the same
 * vertex displacement. All animation lives in the shader; the parent updates
 * uniforms in `useFrame` (no per-frame React state).
 */
export const SolvingField = ({
  size = 11,
  segments = 200,
  materialsRef,
}: SolvingFieldProps) => {
  const pointMat = useRef<FieldMaterial>(null);
  const lineMat = useRef<FieldMaterial>(null);

  const publish = () => {
    if (materialsRef) {
      materialsRef.current = {
        pointMat: pointMat.current,
        lineMat: lineMat.current,
      };
    }
  };

  // shared plane geometry (lies in XY; shader pushes +Z)
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(size, size, segments, segments);
    return g;
  }, [size, segments]);

  // line geometry = wireframe edges of the same grid (the iso-lattice)
  const lineGeometry = useMemo(() => {
    const wire = new THREE.WireframeGeometry(geometry);
    return wire;
  }, [geometry]);

  return (
    <group>
      <points geometry={geometry} frustumCulled={false}>
        <fieldMaterialImpl
          ref={pointMat}
          onUpdate={publish}
          transparent
          depthWrite={false}
          uIsLine={0}
          uPointSize={2.4}
          uOpacity={0.92}
          blending={THREE.NormalBlending}
        />
      </points>

      <lineSegments geometry={lineGeometry} frustumCulled={false}>
        <fieldMaterialImpl
          ref={lineMat}
          onUpdate={publish}
          transparent
          depthWrite={false}
          uIsLine={1}
          uOpacity={0.35}
          blending={THREE.NormalBlending}
        />
      </lineSegments>
    </group>
  );
};

export default SolvingField;
