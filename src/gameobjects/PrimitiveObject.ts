import * as three from "three"
import { GameObject } from "../gameobject";


const PRIMITIVE_COLOR = '#c4c4c4'

type PrimitiveMeshMaterial =
	| three.MeshStandardMaterial
	| three.MeshBasicMaterial
	| three.MeshLambertMaterial
	| three.MeshMatcapMaterial
	| three.MeshPhongMaterial
	| three.MeshPhysicalMaterial
	| three.MeshToonMaterial


type PrimitiveArgs = {
	material?: PrimitiveMeshMaterial
	color?: string | three.Color
	position?: three.Vector3
	rotation?: three.Euler
	scale?: three.Vector3
}

export class PrimitiveCubeObject extends GameObject {
	declare object3d: three.Mesh;

	#material: PrimitiveMeshMaterial;

	get material(){ return this.#material; }

	set material(value: PrimitiveMeshMaterial){
		this.#material = value;
		this.object3d.material = value;
	}

	#color: string | three.Color = PRIMITIVE_COLOR;

	get color(){ return this.#color; }

	set color(value: string | three.Color){
		this.#color = value;
		this.#material.color = new three.Color(value);
	}

	constructor(args: PrimitiveArgs = {}) {
		super();

		if(args.color){
			this.#color = args.color;
		}

		if(args.material){
			this.#material = args.material
		} else {
			this.#material = new three.MeshStandardMaterial({ color: this.#color });
		}

		this.object3d = new three.Mesh(
			new three.BoxGeometry(1, 1, 1),
			this.#material
		);

		if(args.position){
			this.position.copy(args.position);
		}

		if(args.rotation){
			this.rotation.copy(args.rotation);
		}

		if(args.scale){
			this.scale.copy(args.scale);
		}

		this.object3d.userData.owner = this;
	}
}
