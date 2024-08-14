import { GameObject } from "../gameobject";
import * as THREE from "three"

export class MeshObject extends GameObject {

	override object3d = new THREE.Mesh()

	geometry: THREE.BufferGeometry

	material: THREE.Material

	constructor(geometry: THREE.BufferGeometry, material: THREE.Material){
		super();
		this.geometry = geometry;
		this.geometry.userData.owner = this;
		this.material = material;
		this.object3d.geometry = geometry;
		this.object3d.material = material;
	}
}