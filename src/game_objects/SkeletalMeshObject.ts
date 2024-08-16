import * as Three from "three";
import { MeshObject } from "./MeshObject";

export class SkeletalMeshObject extends MeshObject<Three.SkinnedMesh> {
	override object3d = new Three.SkinnedMesh();
}
