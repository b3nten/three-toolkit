import { GameObject } from "../game_object";
import * as Three from "three";
export declare class MeshObject<T extends Three.Mesh = Three.Mesh> extends GameObject<Three.Mesh> {
    #private;
    object3d: Three.Mesh<Three.BufferGeometry<Three.NormalBufferAttributes>, Three.Material | Three.Material[], Three.Object3DEventMap>;
    get geometry(): Three.BufferGeometry;
    set geometry(value: Three.BufferGeometry);
    get material(): Three.Material;
    set material(value: Three.Material);
    constructor(geometry: Three.BufferGeometry, material: Three.Material);
}
