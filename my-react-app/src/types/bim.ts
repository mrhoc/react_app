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

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };

}