import { MeshObject } from "./MeshObject";
import * as THREE from "three"

export class SkeletalMeshObject extends MeshObject {
	override object3d = new THREE.SkinnedMesh()
}