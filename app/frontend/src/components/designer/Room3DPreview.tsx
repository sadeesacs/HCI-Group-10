import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from "react";
import { Canvas, useThree, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoomConfig, PlacedFurniture } from "@/types/designer";
import type { DragFurnitureTemplate } from "./FurnitureLibraryPanel";
import { getRoomPolygon, getRoomBoundingBox } from "@/lib/room-geometry";

/* ─── Constants ─── */
const PX_PER_M = 120;
const WALL_THICKNESS = 0.06;
const FURNITURE_HEIGHT = 0.4;
const SNAP_M = 0.125; // ~15px at 120 px/m
const snapM = (v: number) => Math.round(v / SNAP_M) * SNAP_M;

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
  showGrid?: boolean;
  /** Interactive mode — enables click-select, drag-move, and furniture dropping */
  interactive?: boolean;
  /** Top-down mode — hides walls/ceiling, locks camera from above */
  topDown?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onFurnitureUpdate?: (id: string, attrs: Partial<PlacedFurniture>) => void;
  onDropFurniture?: (item: PlacedFurniture) => void;
}

/* ─── Error Boundary for GLB models ─── */
interface ModelErrorBoundaryProps { children: ReactNode; fallback: ReactNode; }
interface ModelErrorBoundaryState { hasError: boolean; }

class ModelErrorBoundary extends Component<ModelErrorBoundaryProps, ModelErrorBoundaryState> {
  state: ModelErrorBoundaryState = { hasError: false };
  static getDerivedStateFromError(): ModelErrorBoundaryState { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Failed to render GLB furniture model", error, errorInfo);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
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
      const normalX = length > 0 ? -dz / length : 0;
      const normalZ = length > 0 ? dx / length : 0;
      return { length, centerX: (v[0] + next[0]) / 2, centerZ: (v[2] + next[2]) / 2, angle: Math.atan2(-dz, dx), normalX, normalZ };
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
function CameraController({ preset, locked }: { preset: CameraPresetData; locked?: boolean }) {
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
    for (let i = 1; i < shapePoints.length; i++) shape.lineTo(shapePoints[i][0], shapePoints[i][1]);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [shapePoints]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={geometry} receiveShadow>
      <meshStandardMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─── R3F: Ceiling ─── */
function RoomCeiling({ shapePoints, color, height }: { shapePoints: [number, number][]; color: string; height: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(shapePoints[0][0], shapePoints[0][1]);
    for (let i = 1; i < shapePoints.length; i++) shape.lineTo(shapePoints[i][0], shapePoints[i][1]);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [shapePoints]);

  useFrame(() => { if (meshRef.current) meshRef.current.visible = camera.position.y < height; });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, height, 0]} geometry={geometry}>
      <meshStandardMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─── R3F: Walls ─── */
function RoomWalls({
  walls, wallH, color, hideIdx,
}: {
  walls: { length: number; centerX: number; centerZ: number; angle: number; normalX: number; normalZ: number }[];
  wallH: number; color: string; hideIdx?: number;
}) {
  const meshRefs = useRef<Map<number, THREE.Mesh>>(new Map());
  const { camera } = useThree();

  useFrame(() => {
    const camPos = camera.position;
    const scores: { idx: number; dot: number }[] = [];
    for (let i = 0; i < walls.length; i++) {
      const w = walls[i];
      if (w.length < 0.01) continue;
      scores.push({ idx: i, dot: (camPos.x - w.centerX) * w.normalX + (camPos.z - w.centerZ) * w.normalZ });
    }
    scores.sort((a, b) => b.dot - a.dot);
    const hiddenSet = new Set<number>();
    if (scores.length > 0 && scores[0].dot > 0) hiddenSet.add(scores[0].idx);
    if (scores.length > 1 && scores[1].dot > 0) hiddenSet.add(scores[1].idx);
    if (hideIdx !== undefined) hiddenSet.add(hideIdx);
    meshRefs.current.forEach((mesh, i) => { mesh.visible = !hiddenSet.has(i); });
  });

  return (
    <group>
      {walls.map((wall, i) => {
        if (wall.length < 0.01) return null;
        return (
          <mesh key={i} ref={(el) => { if (el) meshRefs.current.set(i, el); else meshRefs.current.delete(i); }}
            position={[wall.centerX, wallH / 2, wall.centerZ]} rotation={[0, wall.angle, 0]}>
            <boxGeometry args={[wall.length, wallH, WALL_THICKNESS]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─── R3F: GLB furniture ─── */

/** Deep-clone a scene AND its materials so each instance is independent */
function deepCloneWithMaterials(source: THREE.Object3D): THREE.Object3D {
  const clone = source.clone(true);
  clone.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (Array.isArray(child.material)) {
        child.material = child.material.map((m) => m.clone());
      } else {
        child.material = child.material.clone();
      }
    }
  });
  return clone;
}

/**
 * Heuristic to detect wood / structural materials that should NOT be recolored.
 * We check the material's original HSL: wood tends to be warm brown (H≈20-40, S>0.2, L<0.5).
 * Very dark items (legs, metal, etc.) are also kept.
 */
function isWoodMaterial(mat: THREE.MeshStandardMaterial): boolean {
  const name = mat.name.toLowerCase();
  if (name.includes("wood") || name.includes("leg") || name.includes("frame") || name.includes("base") || name.includes("metal")) return true;

  const hsl = { h: 0, s: 0, l: 0 };
  mat.color.getHSL(hsl);
  // Very dark materials (metal, legs) — leave untouched
  if (hsl.l < 0.12) return true;
  // Warm brown range typical of wood: hue 15°-50° (0.04-0.14 in 0-1), some saturation, not too bright
  if (hsl.h >= 0.04 && hsl.h <= 0.14 && hsl.s > 0.2 && hsl.l < 0.55) return true;
  return false;
}

function applyUpholsteryColor(scene: THREE.Object3D, cushionColor: string) {
  const targetColor = new THREE.Color(cushionColor);
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((mat) => {
      if (mat instanceof THREE.MeshStandardMaterial && !isWoodMaterial(mat)) {
        mat.color.set(targetColor);
        mat.needsUpdate = true;
      }
    });
  });
}

function GLBFurnitureItem({ item, bbox }: { item: PlacedFurniture; bbox: { width: number; height: number } }) {
  const { scene } = useGLTF(item.glbPath!);
  // Re-clone when cushionColor changes so we get fresh materials to tint
  const clonedScene = useMemo(() => {
    const clone = deepCloneWithMaterials(scene);
    if (item.cushionColor) {
      applyUpholsteryColor(clone, item.cushionColor);
    }
    return clone;
  }, [scene, item.cushionColor]);
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

  return <primitive object={clonedScene} position={[xM, yOffset, zM]} rotation={[0, -item.rotation * (Math.PI / 180), 0]} scale={scale} />;
}

function FurnitureFallbackMesh({ item, bbox }: { item: PlacedFurniture; bbox: { width: number; height: number } }) {
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

/* ─── R3F: Interactive furniture item (click/drag) ─── */
function InteractiveFurnitureItem({
  item, bbox, selected, onSelect, onUpdate, controlsRef,
}: {
  item: PlacedFurniture;
  bbox: { width: number; height: number };
  selected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, attrs: Partial<PlacedFurniture>) => void;
  controlsRef: React.MutableRefObject<any>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const dragOffset = useRef(new THREE.Vector3());

  const wM = item.width / PX_PER_M;
  const dM = item.height / PX_PER_M;
  const xM = item.x / PX_PER_M + wM / 2 - bbox.width / 2;
  const zM = bbox.height / 2 - (item.y / PX_PER_M + dM / 2);

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onSelect(item.id);
    isDragging.current = true;

    // Disable orbit controls during drag
    if (controlsRef.current) controlsRef.current.enabled = false;

    // Compute offset from pointer to item center on XZ plane
    const intersect = new THREE.Vector3();
    e.ray.intersectPlane(dragPlane.current, intersect);
    dragOffset.current.set(xM - intersect.x, 0, zM - intersect.z);

    // Capture pointer on the canvas
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  }, [item.id, xM, zM, onSelect, controlsRef]);

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    const intersect = new THREE.Vector3();
    e.ray.intersectPlane(dragPlane.current, intersect);
    const newXm = intersect.x + dragOffset.current.x;
    const newZm = intersect.z + dragOffset.current.z;

    // Convert back to pixel coords
    const newPxX = snapM(newXm - wM / 2 + bbox.width / 2) * PX_PER_M;
    const newPxY = snapM(bbox.height / 2 - newZm - dM / 2) * PX_PER_M;

    onUpdate(item.id, {
      x: Math.max(0, newPxX),
      y: Math.max(0, newPxY),
    });
  }, [item.id, wM, dM, bbox, onUpdate]);

  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (controlsRef.current) controlsRef.current.enabled = true;
    (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
  }, [controlsRef]);

  // Selection outline
  const outlineColor = selected ? "#6B4226" : undefined;

  return (
    <group ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {item.glbPath ? (
        <ModelErrorBoundary fallback={<FurnitureFallbackMesh item={item} bbox={bbox} />}>
          <Suspense fallback={<FurnitureFallbackMesh item={item} bbox={bbox} />}>
            <GLBFurnitureItem item={item} bbox={bbox} />
          </Suspense>
        </ModelErrorBoundary>
      ) : (
        <mesh position={[xM, FURNITURE_HEIGHT / 2, zM]} rotation={[0, -item.rotation * (Math.PI / 180), 0]}>
          <boxGeometry args={[wM, FURNITURE_HEIGHT, dM]} />
          <meshStandardMaterial color={item.color} />
        </mesh>
      )}

      {/* Selection ring */}
      {selected && (
        <mesh position={[xM, 0.01, zM]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(wM, dM) * 0.6, Math.max(wM, dM) * 0.65, 48]} />
          <meshBasicMaterial color={outlineColor} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

/* ─── R3F: Non-interactive furniture group ─── */
function FurnitureItems({ furniture, bbox }: { furniture: PlacedFurniture[]; bbox: { width: number; height: number } }) {
  if (furniture.length === 0) return null;
  return (
    <group>
      {furniture.map((item) => {
        if (item.glbPath) {
          return (
            <ModelErrorBoundary key={item.id} fallback={<FurnitureFallbackMesh item={item} bbox={bbox} />}>
              <Suspense fallback={<FurnitureFallbackMesh item={item} bbox={bbox} />}>
                <GLBFurnitureItem item={item} bbox={bbox} />
              </Suspense>
            </ModelErrorBoundary>
          );
        }
        const wM = item.width / PX_PER_M;
        const dM = item.height / PX_PER_M;
        const xM = item.x / PX_PER_M + wM / 2 - bbox.width / 2;
        const zM = bbox.height / 2 - (item.y / PX_PER_M + dM / 2);
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

/* ─── R3F: Interactive furniture group ─── */
function InteractiveFurniture({
  furniture, bbox, selectedId, onSelect, onUpdate, controlsRef,
}: {
  furniture: PlacedFurniture[];
  bbox: { width: number; height: number };
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdate: (id: string, attrs: Partial<PlacedFurniture>) => void;
  controlsRef: React.MutableRefObject<any>;
}) {
  return (
    <group>
      {furniture.map((item) => (
        <InteractiveFurnitureItem
          key={item.id}
          item={item}
          bbox={bbox}
          selected={selectedId === item.id}
          onSelect={onSelect}
          onUpdate={onUpdate}
          controlsRef={controlsRef}
        />
      ))}
    </group>
  );
}

/* ─── R3F: Ceiling light grid — one point light every 1 m ─── */
function CeilingLightGrid({ bbox, wallH }: { bbox: { width: number; height: number }; wallH: number }) {
  const lights = useMemo(() => {
    const spacing = 1;
    const halfW = bbox.width / 2;
    const halfH = bbox.height / 2;
    const y = wallH - 0.05;
    const pts: [number, number, number][] = [];
    for (let x = -halfW + spacing / 2; x <= halfW; x += spacing) {
      for (let z = -halfH + spacing / 2; z <= halfH; z += spacing) {
        pts.push([x, y, z]);
      }
    }
    return pts;
  }, [bbox.width, bbox.height, wallH]);

  const perLight = Math.min(1.5, 6 / Math.max(lights.length, 1));

  return (
    <group>
      {lights.map((pos, i) => (
        <pointLight key={i} position={pos} intensity={perLight} distance={wallH * 2.5} decay={1.8} />
      ))}
    </group>
  );
}

/* ─── R3F: Floor hit plane for deselection & drop targeting ─── */function FloorClickPlane({ onDeselect }: { onDeselect: () => void }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}
      onPointerDown={(e) => { e.stopPropagation(); onDeselect(); }}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}

/* ─── R3F: Interactive scene controller with orbit ref ─── */
function InteractiveOrbitalControls({
  preset, locked, innerRef,
}: {
  preset: CameraPresetData;
  locked?: boolean;
  innerRef: React.MutableRefObject<any>;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...preset.position);
    camera.up.set(...(preset.up ?? [0, 1, 0]));
    camera.lookAt(new THREE.Vector3(...preset.target));
    if (innerRef.current) {
      innerRef.current.target.set(...preset.target);
      innerRef.current.update();
    }
  }, [preset, camera, innerRef]);

  return (
    <OrbitControls
      ref={innerRef}
      enableRotate={!locked}
      enablePan={!locked}
      minDistance={1}
      maxDistance={40}
      maxPolarAngle={Math.PI * 0.48}
      makeDefault
    />
  );
}

/* ═══════════════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════════════ */

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
  showGrid,
  interactive,
  topDown,
  selectedId,
  onSelect,
  onFurnitureUpdate,
  onDropFurniture,
}: Props) => {
  const { shapePoints, walls, bbox, wallH } = useRoomGeometry(roomConfig);
  const presets = useMemo(() => getCameraPresets(bbox, wallH), [bbox, wallH]);
  const controlsRef = useRef<any>(null);

  // For non-interactive: manage preset internally
  const effectiveInitialPreset = topDown ? "top" : (initialPreset ?? "default");
  const [activePreset, setActivePreset] = useState<CameraPresetName>(effectiveInitialPreset);

  useEffect(() => {
    if (topDown) {
      setActivePreset("top");
    } else if (initialPreset) {
      setActivePreset(initialPreset);
    }
  }, [initialPreset, topDown]);

  const preset = presets[activePreset];
  const hasFurniture = furniture.length > 0;
  const isLocked = topDown || cameraLocked;
  const hideStructure = topDown; // In top-down mode, hide walls and ceiling

  /* ── Drag-and-drop from furniture library ── */
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!onDropFurniture || !containerRef.current) return;
    const raw = e.dataTransfer.getData("application/furniture");
    if (!raw) return;
    const template = JSON.parse(raw) as DragFurnitureTemplate;

    // Calculate drop position on the floor plane
    const rect = containerRef.current.getBoundingClientRect();
    // Normalise to center of container
    const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // For top-down, approximate world position from NDC
    const maxDim = Math.max(bbox.width, bbox.height);
    const worldX = ndcX * maxDim;
    const worldZ = -ndcY * maxDim;

    const wPx = Math.round(template.widthM * PX_PER_M);
    const hPx = Math.round(template.depthM * PX_PER_M);

    // Convert world to pixel coords
    const pxX = Math.max(0, Math.round((worldX + bbox.width / 2 - template.widthM / 2) * PX_PER_M));
    const pxY = Math.max(0, Math.round((bbox.height / 2 - worldZ - template.depthM / 2) * PX_PER_M));

    onDropFurniture({
      id: `p${Date.now()}`,
      name: template.name,
      label: template.label,
      color: template.color,
      glbPath: template.glbPath,
      cushionColor: template.cushionColor,
      x: pxX,
      y: pxY,
      width: wPx,
      height: hPx,
      rotation: 0,
    });
  }, [onDropFurniture, bbox]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full flex-col overflow-hidden"
      onDragOver={interactive ? (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; } : undefined}
      onDrop={interactive ? handleDrop : undefined}
    >
      <div className="relative flex-1 bg-[hsl(0,0%,96%)]">
        <Canvas camera={{ fov: 50, near: 0.1, far: 100 }} style={{ width: "100%", height: "100%" }}>
          <ambientLight intensity={0.7} />
          <hemisphereLight args={["#fff8f0", "#b8956a", 0.5]} />
          <directionalLight position={[0, wallH + 2, 0]} intensity={1.0} castShadow />
          <directionalLight position={[5, 8, 5]} intensity={0.5} />
          <directionalLight position={[-3, 6, -3]} intensity={0.4} />
          <CeilingLightGrid bbox={bbox} wallH={wallH} />

          <RoomFloor shapePoints={shapePoints} color={roomConfig.floorColor || "#B8956A"} />
          {!hideStructure && (
            <>
              <RoomWalls walls={walls} wallH={wallH} color={roomConfig.wallColor || "#F0F0F0"} hideIdx={hideWallIdx} />
              <RoomCeiling shapePoints={shapePoints} color={roomConfig.ceilingColor || "#FFFFFF"} height={wallH} />
            </>
          )}

          {interactive && onSelect && onFurnitureUpdate ? (
            <>
              <FloorClickPlane onDeselect={() => onSelect(null)} />
              <InteractiveFurniture
                furniture={furniture}
                bbox={bbox}
                selectedId={selectedId ?? null}
                onSelect={onSelect}
                onUpdate={onFurnitureUpdate}
                controlsRef={controlsRef}
              />
            </>
          ) : (
            <FurnitureItems furniture={furniture} bbox={bbox} />
          )}

          {(showGrid || topDown) && (
            <gridHelper args={[20, 40, "#c5c5c5", "#e0e0e0"]} position={[0, -0.005, 0]} />
          )}

          {interactive ? (
            <InteractiveOrbitalControls preset={preset} locked={isLocked} innerRef={controlsRef} />
          ) : (
            <CameraController preset={preset} locked={isLocked} />
          )}
        </Canvas>


      </div>

      {/* Camera presets & reset — shown in 3D (non-top-down) mode */}
      {!isLocked && (
        <>
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {PRESET_BUTTONS.map(({ name, label }) => (
              <Button key={name} variant="outline" size="sm"
                className={`h-6 rounded-md border-border bg-background text-[10px] font-medium px-2 ${
                  activePreset === name
                    ? "bg-[hsl(28,35%,32%)] text-white border-[hsl(28,35%,32%)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                onClick={() => setActivePreset(name)} title={label}>
                {label}
              </Button>
            ))}
          </div>
          <div className="absolute bottom-3 right-3">
            <Button variant="outline" size="icon"
              className="h-7 w-7 rounded-md border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={() => setActivePreset("default")} aria-label="Reset View" title="Reset View">
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
