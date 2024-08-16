import * as Three from "three";
import { GameObject } from "../game_object";
type PrimitiveMeshMaterial = Three.MeshStandardMaterial | Three.MeshBasicMaterial | Three.MeshLambertMaterial | Three.MeshMatcapMaterial | Three.MeshPhongMaterial | Three.MeshPhysicalMaterial | Three.MeshToonMaterial;
type PrimitiveArgs = {
    material?: PrimitiveMeshMaterial;
    color?: string | Three.Color;
    position?: Three.Vector3;
    rotation?: Three.Euler;
    scale?: Three.Vector3;
};
export declare class PrimitiveCubeObject extends GameObject<Three.Mesh> {
    #private;
    get material(): PrimitiveMeshMaterial;
    set material(value: PrimitiveMeshMaterial);
    get color(): string | Three.Color;
    set color(value: string | Three.Color);
    constructor(args?: PrimitiveArgs);
}
export {};
