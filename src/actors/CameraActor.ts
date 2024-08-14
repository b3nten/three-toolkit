import { GameObject } from "../gameobject";
import * as three from "three"
import { Asserts } from "../asserts";

export class PerspectiveCameraObject extends GameObject {

	override object3d: three.PerspectiveCamera;

	#fov: number;
	get fov() {
		return this.#fov;
	}
	set fov(value: number) {
		this.#fov = value;
		this.object3d.fov = value;
		this.object3d.updateProjectionMatrix();
	}

	#near: number;
	get near() {
		return this.#near;
	}
	set near(value: number) {
		this.#near = value;
		this.object3d.near = value;
		this.object3d.updateProjectionMatrix();
	}

	#far: number;
	get far() {
		return this.#far;
	}
	set far(value: number) {
		this.#far = value;
		this.object3d.far = value;
		this.object3d.updateProjectionMatrix();
	}

	constructor(settings: {
		fov?: number,
		near?: number,
		far?: number,
	} = {}){
		super();

		this.#fov = settings.fov ?? 75;
		this.#near = settings.near ?? 0.1;
		this.#far = settings.far ?? 1000;

		this.object3d = new three.PerspectiveCamera(
			this.#fov,
			1,
			this.#near,
			this.#far
		);

		this.object3d.userData.owner = this;
	}

	override onCreate() {
		super.onCreate();
		const aspect = this.scene?.canvas ? (this.scene.canvas.clientWidth / this.scene.canvas.clientHeight) : 1;
		this.object3d.aspect = aspect;
		this.object3d.updateProjectionMatrix();
	}

}

export class OrthographicCameraObject extends GameObject {

	override object3d: three.OrthographicCamera;

	constructor(settings: {
		left: number,
		right: number,
		top: number,
		bottom: number,
		near?: number,
		far?: number,
	}){
		super();

		this.object3d = new three.OrthographicCamera(
			settings.left,
			settings.right,
			settings.top,
			settings.bottom,
			settings.near ?? 0.1,
			settings.far ?? 1000
		);
		this.object3d.userData.owner = this;
	}

	onCreate() {
		super.onCreate?.();
		const aspect = this.scene?.canvas ? (this.scene.canvas.clientWidth / this.scene.canvas.clientHeight) : 1;
		this.object3d.left = -aspect;
		this.object3d.right = aspect;
		this.object3d.updateProjectionMatrix();
	}
}