import { MeshObject } from "./MeshObject";
import * as Three from "three"

export class SkeletalMeshObject extends MeshObject<Three.SkinnedMesh> {
	override object3d = new Three.SkinnedMesh()
}