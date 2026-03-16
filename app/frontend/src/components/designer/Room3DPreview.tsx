import { Component, Suspense, useEffect, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoomConfig } from "@/types/designer";
import type { PlacedFurniture } from "./RoomCanvas2D";
import { getRoomPolygon, getRoomBoundingBox } from "@/lib/room-geometry";

/* ─── Constants ─── */
const PX_PER_M = 120;
const WALL_THICKNESS = 0.06;
const FURNITURE_HEIGHT = 0.4;

/* ─── Types ─── */
export type CameraPresetName = "front" | "back" | "left" | "right" | "top" | "default";

interface CameraPresetData {
  position: [number, number, number];
  target: [number, number, number];
  up?: [number, number, number];
}

interface Props {
  roomConfig: RoomConfig;
  furniture: PlacedFurniture[];
  hideWallIdx?: number;
  cameraPreset?: CameraPresetName;
  cameraLocked?: boolean;
}

interface ModelErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ModelErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<ModelErrorBoundaryProps, ModelErrorBoundaryState> {
  state: ModelErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ModelErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Failed to render GLB furniture model", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

/* ─── Room geometry hook ─── */
function useRoomGeometry(config: RoomConfig) {
  return useMemo(() => {
    const poly = getRoomPolygon(config);
    const bbox = getRoomBoundingBox(config);
    const wallH = config.wallHeight ?? 2.8;
    const cx = bbox.width / 2;
    const cz = bbox.height / 2;

    const shapePoints: [number, number][] = [];
    const floorVertices: [number, number, number][] = [];

    for (let i = 0; i < poly.length; i += 2) {
      const x3d = poly[i] - cx;
      const z3d = cz - poly[i + 1];
      floorVertices.push([x3d, 0, z3d]);
      shapePoints.push([x3d, -z3d]);
    }

    const walls = floorVertices.map((v, i) => {
      const next = floorVertices[(i + 1) % floorVertices.length];
      const dx = next[0] - v[0];
      const dz = next[2] - v[2];
      const length = Math.sqrt(dx * dx + dz * dz);
      // Outward normal for clockwise winding in XZ
      const normalX = length > 0 ? -dz / length : 0;
      const normalZ = length > 0 ? dx / length : 0;
      return {
        length,
        centerX: (v[0] + next[0]) / 2,
        centerZ: (v[2] + next[2]) / 2,
        angle: Math.atan2(-dz, dx),
        normalX,
        normalZ,
      };
    });

    return { shapePoints, floorVertices, walls, bbox, wallH };
  }, [config]);
}

/* ─── Camera presets ─── */
function getCameraPresets(
  bbox: { width: number; height: number },
  wallH: number,
): Record<CameraPresetName, CameraPresetData> {
  const maxDim = Math.max(bbox.width, bbox.height, wallH);
  const dist = maxDim * 1.5;
  const eyeY = wallH * 0.55;
  const tY = wallH * 0.4;
  return {
    front: { position: [0, eyeY, bbox.height / 2 + dist], target: [0, tY, 0] },
    back: { position: [0, eyeY, -(bbox.height / 2 + dist)], target: [0, tY, 0] },
    right: { position: [bbox.width / 2 + dist, eyeY, 0], target: [0, tY, 0] },
    left: { position: [-(bbox.width / 2 + dist), eyeY, 0], target: [0, tY, 0] },
    top: { position: [0, maxDim * 2, 0.01], target: [0, 0, 0], up: [0, 0, -1] },
    default: {
      position: [bbox.width * 0.7, wallH * 1.5, bbox.height * 0.8],
      target: [0, wallH * 0.3, 0],
    },
  };
}

/* ─── R3F: Camera controller ─── */
function CameraController({
  preset,
  locked,
}: {
  preset: CameraPresetData;
  locked?: boolean;
}) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...preset.position);
    camera.up.set(...(preset.up ?? [0, 1, 0]));
    camera.lookAt(new THREE.Vector3(...preset.target));
    if (controlsRef.current) {
      controlsRef.current.target.set(...preset.target);
      controlsRef.current.update();
    }
  }, [preset, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableRotate={!locked}
      enablePan={!locked}
      minDistance={1}
      maxDistance={40}
      maxPolarAngle={Math.PI * 0.48}
      makeDefault
    />
  );
}

/* ─── R3F: Floor ─── */
function RoomFloor({ shapePoints, color }: { shapePoints: [number, number][]; color: string }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(shapePoints[0][0], shapePoints[0][1]);
    for (let i = 1; i < shapePoints.length; i++) {
      shape.lineTo(shapePoints[i][0], shapePoints[i][1]);
    }
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [shapePoints]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={geometry} receiveShadow>
      <meshStandardMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─── R3F: Ceiling (auto-hides when camera is above) ─── */
function RoomCeiling({
  shapePoints,
  color,
  height,
}: {
  shapePoints: [number, number][];
  color: string;
  height: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(shapePoints[0][0], shapePoints[0][1]);
    for (let i = 1; i < shapePoints.length; i++) {
      shape.lineTo(shapePoints[i][0], shapePoints[i][1]);
    }
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [shapePoints]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.visible = camera.position.y < height;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, height, 0]} geometry={geometry}>
      <meshStandardMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─── R3F: Walls (auto-hide closest to camera) ─── */
function RoomWalls({
  walls,
  wallH,
  color,
  hideIdx,
}: {
  walls: { length: number; centerX: number; centerZ: number; angle: number; normalX: number; normalZ: number }[];
  wallH: number;
  color: string;
  hideIdx?: number;
}) {
  const meshRefs = useRef<Map<number, THREE.Mesh>>(new Map());
  const { camera } = useThree();

  useFrame(() => {
    const camPos = camera.position;

    // Score each wall by how much it faces the camera
    const scores: { idx: number; dot: number }[] = [];
    for (let i = 0; i < walls.length; i++) {
      const w = walls[i];
      if (w.length < 0.01) continue;
      const dot = (camPos.x - w.centerX) * w.normalX + (camPos.z - w.centerZ) * w.normalZ;
      scores.push({ idx: i, dot });
    }

    // Sort descending — top 2 are the closest-facing walls
    scores.sort((a, b) => b.dot - a.dot);
    const hiddenSet = new Set<number>();
    if (scores.length > 0 && scores[0].dot > 0) hiddenSet.add(scores[0].idx);
    if (scores.length > 1 && scores[1].dot > 0) hiddenSet.add(scores[1].idx);
    if (hideIdx !== undefined) hiddenSet.add(hideIdx);

    meshRefs.current.forEach((mesh, i) => {
      mesh.visible = !hiddenSet.has(i);
    });
  });

  return (
    <group>
      {walls.map((wall, i) => {
        if (wall.length < 0.01) return null;
        return (
          <mesh
            key={i}
            ref={(el) => { if (el) meshRefs.current.set(i, el); else meshRefs.current.delete(i); }}
            position={[wall.centerX, wallH / 2, wall.centerZ]}
            rotation={[0, wall.angle, 0]}
          >
            <boxGeometry args={[wall.length, wallH, WALL_THICKNESS]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─── R3F: Single GLB furniture item ─── */
function GLBFurnitureItem({
  item,
  bbox,
}: {
  item: PlacedFurniture;
  bbox: { width: number; height: number };
}) {
  const { scene } = useGLTF(item.glbPath!);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  const wM = item.width / PX_PER_M;
  const dM = item.height / PX_PER_M;
  const xM = item.x / PX_PER_M + wM / 2 - bbox.width / 2;
  const zM = bbox.height / 2 - (item.y / PX_PER_M + dM / 2);

  const { scale, yOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    if (size.x < 0.001 || size.z < 0.001) return { scale: [1, 1, 1] as [number, number, number], yOffset: 0 };
    const s = Math.min(wM / size.x, dM / size.z);
    return { scale: [s, s, s] as [number, number, number], yOffset: -box.min.y * s };
  }, [clonedScene, wM, dM]);

  return (
    <primitive
      object={clonedScene}
      position={[xM, yOffset, zM]}
      rotation={[0, -item.rotation * (Math.PI / 180), 0]}
      scale={scale}
    />
  );
}

function FurnitureFallbackMesh({
  item,
  bbox,
}: {
  item: PlacedFurniture;
  bbox: { width: number; height: number };
}) {
  const wM = item.width / PX_PER_M;
  const dM = item.height / PX_PER_M;
  const xM = item.x / PX_PER_M + wM / 2 - bbox.width / 2;
  const zM = bbox.height / 2 - (item.y / PX_PER_M + dM / 2);

  return (
    <mesh position={[xM, FURNITURE_HEIGHT / 2, zM]} rotation={[0, -item.rotation * (Math.PI / 180), 0]}>
      <boxGeometry args={[wM, FURNITURE_HEIGHT, dM]} />
      <meshStandardMaterial color={item.color} opacity={0.75} transparent />
    </mesh>
  );
}

/* ─── R3F: Furniture ─── */
function FurnitureItems({
  furniture,
  bbox,
}: {
  furniture: PlacedFurniture[];
  bbox: { width: number; height: number };
}) {
  if (furniture.length === 0) return null;
  return (
    <group>
      {furniture.map((item) => {
        const wM = item.width / PX_PER_M;
        const dM = item.height / PX_PER_M;
        const xM = item.x / PX_PER_M + wM / 2 - bbox.width / 2;
        const zM = bbox.height / 2 - (item.y / PX_PER_M + dM / 2);

        if (item.glbPath) {
          return (
            <ModelErrorBoundary
              key={item.id}
              fallback={<FurnitureFallbackMesh item={item} bbox={bbox} />}
            >
              <Suspense fallback={<FurnitureFallbackMesh item={item} bbox={bbox} />}>
                <GLBFurnitureItem item={item} bbox={bbox} />
              </Suspense>
            </ModelErrorBoundary>
          );
        }

        return (
          <mesh key={item.id} position={[xM, FURNITURE_HEIGHT / 2, zM]} rotation={[0, -item.rotation * (Math.PI / 180), 0]}>
            <boxGeometry args={[wM, FURNITURE_HEIGHT, dM]} />
            <meshStandardMaterial color={item.color} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─── Main component ─── */
const PRESET_BUTTONS: { name: CameraPresetName; label: string }[] = [
  { name: "top", label: "Top" },
  { name: "front", label: "Front" },
  { name: "back", label: "Back" },
  { name: "right", label: "Right" },
  { name: "left", label: "Left" },
];

const Room3DPreview = ({
  roomConfig,
  furniture,
  hideWallIdx,
  cameraPreset: initialPreset,
  cameraLocked,
}: Props) => {
  const { shapePoints, walls, bbox, wallH } = useRoomGeometry(roomConfig);
  const presets = useMemo(() => getCameraPresets(bbox, wallH), [bbox, wallH]);
  const [activePreset, setActivePreset] = useState<CameraPresetName>(initialPreset ?? "default");

  useEffect(() => {
    if (initialPreset) setActivePreset(initialPreset);
  }, [initialPreset]);

  const preset = presets[activePreset];
  const hasFurniture = furniture.length > 0;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <div className="relative flex-1 bg-[hsl(0,0%,96%)]">
        <Canvas camera={{ fov: 50, near: 0.1, far: 100 }} style={{ width: "100%", height: "100%" }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={0.8} />
          <directionalLight position={[-3, 4, -3]} intensity={0.3} />

          <RoomFloor shapePoints={shapePoints} color={roomConfig.floorColor || "#B8956A"} />
          <RoomWalls walls={walls} wallH={wallH} color={roomConfig.wallColor || "#F0F0F0"} hideIdx={hideWallIdx} />
          <RoomCeiling shapePoints={shapePoints} color={roomConfig.ceilingColor || "#FFFFFF"} height={wallH} />
          <FurnitureItems furniture={furniture} bbox={bbox} />

          <CameraController preset={preset} locked={cameraLocked} />
        </Canvas>

        {!hasFurniture && !cameraLocked && (
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
              <Box size={14} className="text-muted-foreground" />
            </div>
            <p className="text-[11px] text-muted-foreground">Add furniture in 2D view to preview here.</p>
          </div>
        )}
      </div>

      {/* Camera presets & reset — hidden when locked */}
      {!cameraLocked && (
        <>
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {PRESET_BUTTONS.map(({ name, label }) => (
              <Button
                key={name}
                variant="outline"
                size="sm"
                className={`h-6 rounded-md border-border bg-background text-[10px] font-medium px-2 ${
                  activePreset === name
                    ? "bg-[hsl(28,35%,32%)] text-white border-[hsl(28,35%,32%)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                onClick={() => setActivePreset(name)}
                title={label}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="absolute bottom-3 right-3">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-md border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={() => setActivePreset("default")}
              aria-label="Reset View"
              title="Reset View"
            >
              <RotateCcw size={13} />
            </Button>
          </div>

          <p className="absolute bottom-3 left-3 text-[10px] text-muted-foreground/60">Drag to rotate · Scroll to zoom</p>
        </>
      )}
    </div>
  );
};

useGLTF.preload("/models/kandy.glb");

export default Room3DPreview;
