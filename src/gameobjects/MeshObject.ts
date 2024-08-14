import { GameObject } from "../gameobject";
import * as THREE from "three"

export class MeshObject extends GameObject {

	override object3d = new THREE.Mesh()

	#geometry: THREE.BufferGeometry

	get geometry(){
		return this.#geometry;
	}

	set geometry(value: THREE.BufferGeometry){
		this.#geometry = value;
		this.#geometry.userData.owner = this;
		this.object3d.geometry = value;
	}

	#material: THREE.Material

	get material(){
		return this.#material;
	}

	set material(value: THREE.Material){
		this.#material = value;
		this.object3d.material = value;
	}

	constructor(geometry: THREE.BufferGeometry, material: THREE.Material){
		super();
		this.#geometry = geometry;
		this.#geometry.userData.owner = this;
		this.#material = material;
		this.object3d.geometry = geometry;
		this.object3d.material = material;
	}
}