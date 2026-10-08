export type BIMObjectType =
  | "wall"
  | "floor"
  | "column"
  | "door"
  | "window";

export interface BIMObject {
  id: string;
  name: string;
  type: BIMObjectType;
  floor: number;
}