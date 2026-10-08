import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useCallback } from "react";

interface BIMObject {
  id: string;
  name: string;
  type: "wall" | "floor" | "column" | "door" | "window";
  floor: number;
}

// Component cho từng mesh có thể click được
interface ClickableMeshProps {
  position: [number, number, number];
  args?: number[];
  color: string;
  objectData: BIMObject;
  isSelected: boolean;
  onClick: (obj: BIMObject) => void;
}

function ClickableMesh({
  position,
  args,
  color,
  objectData,
  isSelected,
  onClick,
}: ClickableMeshProps) {
  const highlightColor = "#ff6b00";

  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(objectData);
      }}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={isSelected ? highlightColor : color}
        emissive={isSelected ? highlightColor : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

// Component Floor với click
interface FloorProps {
  y: number;
  floorNumber: number;
  selectedObject: BIMObject | null;
  onSelect: (obj: BIMObject) => void;
}

function Floor({ y, floorNumber, selectedObject, onSelect }: FloorProps) {
  const floorData: BIMObject = {
    id: `floor-${floorNumber}`,
    name: `Tầng ${floorNumber}`,
    type: "floor",
    floor: floorNumber,
  };

  const isFloorSelected = selectedObject?.id === floorData.id;

  return (
    <group position={[0, y, 0]}>
      {/* Floor plate */}
      <mesh
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(floorData);
        }}
      >
        <boxGeometry args={[6, 0.2, 6]} />
        <meshStandardMaterial
          color={isFloorSelected ? "#ff6b00" : "gray"}
          emissive={isFloorSelected ? "#ff6b00" : "#000000"}
          emissiveIntensity={isFloorSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Back wall */}
      <mesh
        position={[0, 1.5, -3]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect({
            id: `wall-back-${floorNumber}`,
            name: `Tường sau - Tầng ${floorNumber}`,
            type: "wall",
            floor: floorNumber,
          });
        }}
      >
        <boxGeometry args={[6, 3, 0.2]} />
        <meshStandardMaterial
          color={isFloorSelected ? "#ff6b00" : "blue"}
          emissive={isFloorSelected ? "#ff6b00" : "#000000"}
          emissiveIntensity={isFloorSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Left wall */}
      <mesh
        position={[-3, 1.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect({
            id: `wall-left-${floorNumber}`,
            name: `Tường trái - Tầng ${floorNumber}`,
            type: "wall",
            floor: floorNumber,
          });
        }}
      >
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial
          color={isFloorSelected ? "#ff6b00" : "white"}
          emissive={isFloorSelected ? "#ff6b00" : "#000000"}
          emissiveIntensity={isFloorSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Right wall */}
      <mesh
        position={[3, 1.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect({
            id: `wall-right-${floorNumber}`,
            name: `Tường phải - Tầng ${floorNumber}`,
            type: "wall",
            floor: floorNumber,
          });
        }}
      >
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial
          color={isFloorSelected ? "#ff6b00" : "white"}
          emissive={isFloorSelected ? "#ff6b00" : "#000000"}
          emissiveIntensity={isFloorSelected ? 0.3 : 0}
        />
      </mesh>
    </group>
  );
}

// Component Column với click
interface ColumnProps {
  position: [number, number, number];
  columnIndex: number;
  floorNumber: number;
  selectedObject: BIMObject | null;
  onSelect: (obj: BIMObject) => void;
}

function Column({ position, columnIndex, floorNumber, selectedObject, onSelect }: ColumnProps) {
  const columnData: BIMObject = {
    id: `column-${floorNumber}-${columnIndex}`,
    name: `Cột ${columnIndex + 1} - Tầng ${floorNumber}`,
    type: "column",
    floor: floorNumber,
  };

  const isColumnSelected = selectedObject?.id === columnData.id;

  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(columnData);
      }}
    >
      <boxGeometry args={[0.3, 3, 0.3]} />
      <meshStandardMaterial
        color={isColumnSelected ? "#ff6b00" : "gray"}
        emissive={isColumnSelected ? "#ff6b00" : "#000000"}
        emissiveIntensity={isColumnSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

// Main Building component
interface BuildingProps {
  selectedObject: BIMObject | null;
  onSelect: (obj: BIMObject) => void;
}

function Building({ selectedObject, onSelect }: BuildingProps) {
  return (
    <group>
      <Floor y={0} floorNumber={1} selectedObject={selectedObject} onSelect={onSelect} />
      <Floor y={3.2} floorNumber={2} selectedObject={selectedObject} onSelect={onSelect} />
      <Floor y={6.4} floorNumber={3} selectedObject={selectedObject} onSelect={onSelect} />

      {/* Columns */}
      {[
        { pos: [2, 1.5, 2] as [number, number, number], idx: 0 },
        { pos: [2, 1.5, -2] as [number, number, number], idx: 1 },
        { pos: [-2, 1.5, 2] as [number, number, number], idx: 2 },
        { pos: [-2, 1.5, -2] as [number, number, number], idx: 3 },
      ].map((col, i) => (
        <Column
          key={`col-t1-${i}`}
          position={col.pos}
          columnIndex={col.idx}
          floorNumber={1}
          selectedObject={selectedObject}
          onSelect={onSelect}
        />
      ))}
      {[
        { pos: [2, 4.7, 2] as [number, number, number], idx: 0 },
        { pos: [2, 4.7, -2] as [number, number, number], idx: 1 },
        { pos: [-2, 4.7, 2] as [number, number, number], idx: 2 },
        { pos: [-2, 4.7, -2] as [number, number, number], idx: 3 },
      ].map((col, i) => (
        <Column
          key={`col-t2-${i}`}
          position={col.pos}
          columnIndex={col.idx}
          floorNumber={2}
          selectedObject={selectedObject}
          onSelect={onSelect}
        />
      ))}
      {[
        { pos: [2, 7.9, 2] as [number, number, number], idx: 0 },
        { pos: [2, 7.9, -2] as [number, number, number], idx: 1 },
        { pos: [-2, 7.9, 2] as [number, number, number], idx: 2 },
        { pos: [-2, 7.9, -2] as [number, number, number], idx: 3 },
      ].map((col, i) => (
        <Column
          key={`col-t3-${i}`}
          position={col.pos}
          columnIndex={col.idx}
          floorNumber={3}
          selectedObject={selectedObject}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

// Component 3D Scene
interface SceneProps {
  selectedObject: BIMObject | null;
  onSelect: (obj: BIMObject) => void;
}

function Scene({ selectedObject, onSelect }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <Building selectedObject={selectedObject} onSelect={onSelect} />
      <OrbitControls />
    </>
  );
}

// Panel hiển thị thông tin chi tiết
interface InfoPanelProps {
  selectedObject: BIMObject | null;
  onClose: () => void;
}

function InfoPanel({ selectedObject, onClose }: InfoPanelProps) {
  if (!selectedObject) return null;

  const typeLabels: Record<string, string> = {
    floor: "Sàn",
    wall: "Tường",
    column: "Cột",
    door: "Cửa",
    window: "Cửa sổ",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        background: "rgba(255, 255, 255, 0.95)",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        minWidth: 250,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
        <h3 style={{ margin: 0, color: "#333" }}>Chi tiết đối tượng</h3>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "#f0f0f0",
            borderRadius: 50,
            width: 28,
            height: 28,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ×
        </button>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        <div>
          <span style={{ color: "#666", fontSize: 12 }}>Tên:</span>
          <div style={{ fontWeight: 600, color: "#333" }}>{selectedObject.name}</div>
        </div>
        <div>
          <span style={{ color: "#666", fontSize: 12 }}>Loại:</span>
          <div style={{ fontWeight: 600, color: "#333" }}>{typeLabels[selectedObject.type]}</div>
        </div>
        <div>
          <span style={{ color: "#666", fontSize: 12 }}>Tầng:</span>
          <div style={{ fontWeight: 600, color: "#333" }}>{selectedObject.floor}</div>
        </div>
        <div>
          <span style={{ color: "#666", fontSize: 12 }}>ID:</span>
          <div style={{ fontSize: 12, color: "#888", fontFamily: "monospace" }}>{selectedObject.id}</div>
        </div>
      </div>
    </div>
  );
}

// Component chính
export default function BIMViewer() {
  const [selectedObject, setSelectedObject] = useState<BIMObject | null>(null);

  const handleSelect = useCallback((obj: BIMObject) => {
    setSelectedObject((prev) => (prev?.id === obj.id ? null : obj));
  }, []);

  const handleClose = useCallback(() => {
    setSelectedObject(null);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Canvas camera={{ position: [10, 8, 10], fov: 50 }}>
        <Scene selectedObject={selectedObject} onSelect={handleSelect} />
      </Canvas>

      <InfoPanel selectedObject={selectedObject} onClose={handleClose} />

      {/* Hướng dẫn */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          background: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "10px 15px",
          borderRadius: 8,
          fontSize: 13,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        🖱️ Click vào đối tượng để xem chi tiết | Kéo để xoay | Cuộn để zoom
      </div>
    </div>
  );
}
