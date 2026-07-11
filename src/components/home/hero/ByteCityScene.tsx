'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

/** Mutable progress container shared with Hero — never React state. */
export type ProgressRef = { current: number };

export type ByteCitySceneProps = {
  /** Scroll progress 0→1, written by the pinned ScrollTrigger in Hero. */
  progressRef: ProgressRef;
  /** Called on webglcontextlost so Hero can fall back to the poster. */
  onContextLost?: () => void;
};

/* ────────────────────────────────────────────────────────────────
   Deterministic layout — seeded pseudorandom, no Math.random at
   render time, so every visit builds the identical city.
   ──────────────────────────────────────────────────────────────── */

const seeded = (i: number): number => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** smoothstep between edges a→b */
const smooth = (a: number, b: number, x: number): number => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* ── Eight capability structures ringing the Core ── */

type StructureDef = { pos: THREE.Vector3; h: number };

const STRUCTURES: StructureDef[] = Array.from({ length: 8 }, (_, k) => {
  const angle = (k / 8) * Math.PI * 2 + Math.PI / 8;
  return {
    pos: new THREE.Vector3(Math.cos(angle) * 6.2, 0, Math.sin(angle) * 6.2),
    h: 2.8 + seeded(k + 41) * 1.6,
  };
});

/** Main data path — a closed street-level loop threading the 8 structures.
    Kept near the ground so it reads as a data conduit through the city, not
    a ring floating in the sky (which also crossed the camera path). */
const CURVE = new THREE.CatmullRomCurve3(
  STRUCTURES.map((s, k) => {
    const inward = 1 - (k % 2) * 0.18;
    return new THREE.Vector3(s.pos.x * inward, 0.35, s.pos.z * inward);
  }),
  true,
  'catmullrom',
  0.5
);

const TUBE_SEGMENTS = 240;
const RADIAL_SEGMENTS = 6;
/** TubeGeometry index layout: radialSegments quads (6 indices each) per ring. */
const INDICES_PER_SEGMENT = RADIAL_SEGMENTS * 6;

/* ── ~120 filler buildings on a jittered grid (deterministic) ── */

type BuildingDef = { x: number; z: number; h: number; sx: number; sz: number; shade: number };

const BUILDINGS: BuildingDef[] = (() => {
  const out: BuildingDef[] = [];
  const N = 15;
  const SPACING = 1.35;
  for (let ix = 0; ix < N; ix++) {
    for (let iz = 0; iz < N; iz++) {
      const i = ix * N + iz;
      const x = (ix - (N - 1) / 2) * SPACING + (seeded(i * 3 + 1) - 0.5) * 0.5;
      const z = (iz - (N - 1) / 2) * SPACING + (seeded(i * 3 + 2) - 0.5) * 0.5;
      const r = Math.hypot(x, z);
      if (r < 2.2 || r > 9.8) continue; // keep the Core plaza + a bounded skyline
      if (STRUCTURES.some((s) => Math.hypot(x - s.pos.x, z - s.pos.z) < 1.4)) continue;
      if (seeded(i * 5 + 7) < 0.28) continue; // thin out for breathing room
      out.push({
        x,
        z,
        h: 0.5 + seeded(i) * 2.3,
        sx: 0.55 + seeded(i * 2) * 0.4,
        sz: 0.55 + seeded(i * 2 + 9) * 0.4,
        shade: 0.75 + seeded(i * 7 + 5) * 0.35,
      });
    }
  }
  return out;
})();

/* ── Camera keyframes matching the stage choreography ── */

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

const CAM_KEYS: { t: number; pos: THREE.Vector3; look: THREE.Vector3 }[] = [
  // Camera never drops below the tower tops or inside the structure ring —
  // earlier keys dove through geometry and filled the frame with clipped faces.
  { t: 0, pos: v(14.5, 12.5, 14.5), look: v(0, 0.6, 0) }, // wide isometric hold
  { t: 0.15, pos: v(14.5, 12.5, 14.5), look: v(0, 0.6, 0) },
  { t: 0.35, pos: v(11.5, 9, 11.5), look: v(0, 1.0, 0) }, // dolly in while path draws
  { t: 0.6, pos: v(9.5, 7.5, 9.5), look: v(0, 1.2, 0) }, // approaching the ring
  { t: 0.75, pos: v(8.5, 7, 8.5), look: v(0, 1.5, 0) }, // Core activation
  { t: 0.9, pos: v(7, 11, 7), look: v(0, 2.2, 0) }, // camera rises
  { t: 1, pos: v(6, 14.5, 6), look: v(0, 3, 0) },
];

const TMP_POS = new THREE.Vector3();
const TMP_LOOK = new THREE.Vector3();

function sampleCamera(p: number, outPos: THREE.Vector3, outLook: THREE.Vector3): void {
  let i = 0;
  while (i < CAM_KEYS.length - 2 && p > CAM_KEYS[i + 1].t) i++;
  const a = CAM_KEYS[i];
  const b = CAM_KEYS[i + 1];
  const span = b.t - a.t || 1;
  const l = clamp01((p - a.t) / span);
  const s = l * l * (3 - 2 * l); // ease each leg so keyframe joins feel intentional
  outPos.lerpVectors(a.pos, b.pos, s);
  outLook.lerpVectors(a.look, b.look, s);
}

/* ── Shared geometries/materials, created once, disposed on unmount ── */

type CityAssets = {
  boxGeo: THREE.BoxGeometry;
  icoGeo: THREE.IcosahedronGeometry;
  groundGeo: THREE.PlaneGeometry;
  tubeGeo: THREE.TubeGeometry;
  buildingMat: THREE.MeshStandardMaterial;
  groundMat: THREE.MeshStandardMaterial;
  coreMat: THREE.MeshStandardMaterial;
  tubeMat: THREE.MeshBasicMaterial;
  structureMats: THREE.MeshStandardMaterial[];
  capMats: THREE.MeshStandardMaterial[];
  dispose: () => void;
};

function createAssets(): CityAssets {
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const icoGeo = new THREE.IcosahedronGeometry(1.1, 0);
  const groundGeo = new THREE.PlaneGeometry(90, 90);
  const tubeGeo = new THREE.TubeGeometry(CURVE, TUBE_SEGMENTS, 0.045, RADIAL_SEGMENTS, true);
  tubeGeo.setDrawRange(0, 0); // path is drawn in by scroll progress

  // Base color white → per-instance navy shades multiply through.
  const buildingMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85, metalness: 0.08 });
  const groundMat = new THREE.MeshStandardMaterial({ color: '#050D1C', roughness: 1 });
  const coreMat = new THREE.MeshStandardMaterial({
    color: '#0C1D36',
    emissive: new THREE.Color('#2F6BFF'),
    emissiveIntensity: 0.2,
    roughness: 0.35,
    flatShading: true,
  });
  const tubeMat = new THREE.MeshBasicMaterial({ color: '#4C92FF' });
  const structureMats = STRUCTURES.map(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#12294A',
        emissive: new THREE.Color('#4C92FF'),
        emissiveIntensity: 0,
        roughness: 0.55,
        metalness: 0.15,
      })
  );
  // Small spire beacons — the only part of a tower that goes bright.
  const capMats = STRUCTURES.map(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#12294A',
        emissive: new THREE.Color('#72DAFF'),
        emissiveIntensity: 0.15,
        roughness: 0.4,
      })
  );

  const disposables: { dispose: () => void }[] = [
    boxGeo,
    icoGeo,
    groundGeo,
    tubeGeo,
    buildingMat,
    groundMat,
    coreMat,
    tubeMat,
    ...structureMats,
    ...capMats,
  ];

  return {
    boxGeo,
    icoGeo,
    groundGeo,
    tubeGeo,
    buildingMat,
    groundMat,
    coreMat,
    tubeMat,
    structureMats,
    capMats,
    dispose: () => disposables.forEach((d) => d.dispose()),
  };
}

/* ── Instanced filler city ── */

function CityBuildings({ geo, mat }: { geo: THREE.BoxGeometry; mat: THREE.MeshStandardMaterial }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const helper = new THREE.Object3D();
    const color = new THREE.Color();
    BUILDINGS.forEach((b, i) => {
      helper.position.set(b.x, b.h / 2, b.z);
      helper.scale.set(b.sx, b.h, b.sz);
      helper.updateMatrix();
      mesh.setMatrixAt(i, helper.matrix);
      color.set('#0C1D36').multiplyScalar(b.shade);
      mesh.setColorAt(i, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  return <instancedMesh ref={ref} args={[geo, mat, BUILDINGS.length]} frustumCulled={false} />;
}

/* ── Scene contents + per-frame rig ── */

function CityContents({ progressRef }: { progressRef: ProgressRef }) {
  const assets = useMemo(createAssets, []);
  useEffect(() => () => assets.dispose(), [assets]);

  const coreRef = useRef<THREE.Mesh>(null);
  const pointerTarget = useRef(new THREE.Vector2()).current;
  const pointerSmooth = useRef(new THREE.Vector2()).current;

  const gl = useThree((s) => s.gl);
  const setFrameloop = useThree((s) => s.setFrameloop);

  // Pause all rAF-driven work while the canvas is offscreen or the tab hidden.
  useEffect(() => {
    let inView = true;
    const update = () => setFrameloop(inView && !document.hidden ? 'always' : 'never');
    const io = new IntersectionObserver((entries) => {
      inView = entries.some((e) => e.isIntersecting);
      update();
    });
    io.observe(gl.domElement);
    document.addEventListener('visibilitychange', update);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', update);
      setFrameloop('always');
    };
  }, [gl, setFrameloop]);

  // Pointer parallax — pointer-fine devices only, matchMedia read once.
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      pointerTarget.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointerTarget]);

  useFrame((state) => {
    if (document.hidden) return;

    const p = clamp01(progressRef.current);
    const t = state.clock.elapsedTime;

    /* camera along keyframed path */
    sampleCamera(p, TMP_POS, TMP_LOOK);
    // ±1.5° parallax offset on the look target (≈0.45 units at this distance)
    pointerSmooth.lerp(pointerTarget, 0.05);
    TMP_LOOK.x += pointerSmooth.x * 0.45;
    TMP_LOOK.y -= pointerSmooth.y * 0.3;
    state.camera.position.copy(TMP_POS);
    state.camera.lookAt(TMP_LOOK);

    /* 0.15–0.35 — data path draws in along the loop */
    const draw = smooth(0.15, 0.35, p);
    assets.tubeGeo.setDrawRange(0, Math.floor(draw * TUBE_SEGMENTS) * INDICES_PER_SEGMENT);

    /* 0.35–0.6 — eight structures illuminate sequentially with a soft pulse */
    for (let k = 0; k < STRUCTURES.length; k++) {
      const start = 0.35 + (k / 8) * 0.21;
      const on = smooth(start, start + 0.045, p);
      // Tower bodies stay dark shaded forms; the beacon caps carry the signal.
      assets.structureMats[k].emissiveIntensity = on * (0.12 + 0.03 * Math.sin(t * 2.4 + k * 1.7));
      assets.capMats[k].emissiveIntensity = 0.15 + on * (1.0 + 0.25 * Math.sin(t * 2.4 + k * 1.7));
    }

    /* 0.6–0.75 — the Core activates: scale + emissive */
    const activation = smooth(0.6, 0.75, p);
    assets.coreMat.emissiveIntensity = 0.2 + activation * 0.85;
    const core = coreRef.current;
    if (core) {
      core.scale.setScalar(1 + activation * 0.22 + activation * 0.05 * Math.sin(t * 2.2));
      core.rotation.y = t * 0.18;
      core.rotation.x = Math.sin(t * 0.4) * 0.08;
    }
  });

  return (
    <group>
      <mesh
        geometry={assets.groundGeo}
        material={assets.groundMat}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
      />

      <CityBuildings geo={assets.boxGeo} mat={assets.buildingMat} />

      {STRUCTURES.map((s, k) => (
        <group key={k} position={[s.pos.x, 0, s.pos.z]}>
          {/* base tower + stepped setback + spire cap, all sharing one geometry */}
          <mesh geometry={assets.boxGeo} material={assets.structureMats[k]} position={[0, s.h / 2, 0]} scale={[1.15, s.h, 1.15]} />
          <mesh
            geometry={assets.boxGeo}
            material={assets.structureMats[k]}
            position={[0, s.h * 1.19, 0]}
            scale={[0.78, s.h * 0.38, 0.78]}
          />
          <mesh
            geometry={assets.boxGeo}
            material={assets.capMats[k]}
            position={[0, s.h * 1.38 + 0.14, 0]}
            scale={[0.42, 0.28, 0.42]}
          />
        </group>
      ))}

      {/* central Core */}
      <mesh ref={coreRef} geometry={assets.icoGeo} material={assets.coreMat} position={[0, 1.8, 0]} />

      {/* main data path — draw length follows progress via setDrawRange */}
      <mesh geometry={assets.tubeGeo} material={assets.tubeMat} frustumCulled={false} />
    </group>
  );
}

/* ── Canvas root ── */

export default function ByteCityScene({ progressRef, onContextLost }: ByteCitySceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      frameloop="always"
      camera={{ fov: 35, near: 0.5, far: 80, position: [14.5, 12.5, 14.5] }}
      onCreated={({ gl, camera }) => {
        camera.lookAt(0, 0.6, 0);
        gl.domElement.addEventListener(
          'webglcontextlost',
          (e) => {
            e.preventDefault();
            onContextLost?.();
          },
          false
        );
      }}
    >
      <color attach="background" args={['#071426']} />
      <fog attach="fog" args={['#071426', 18, 42]} />
      <ambientLight intensity={0.35} />
      {/* soft studio key from upper-left — no shadow maps, no postprocessing */}
      <directionalLight position={[-8, 12, 6]} intensity={1.15} color="#f2f7fc" />
      <CityContents progressRef={progressRef} />
    </Canvas>
  );
}
