import { MeshObject } from "./MeshObject";
import * as Three from "three";
export declare class SkeletalMeshObject extends MeshObject<Three.SkinnedMesh> {
    object3d: Three.SkinnedMesh<Three.BufferGeometry<Three.NormalBufferAttributes>, Three.Material | Three.Material[], Three.Object3DEventMap>;
}
