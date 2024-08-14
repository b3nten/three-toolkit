import { GameObject } from "../gameobject";
import * as three from "three"
import { ASSERT } from "../asserts";

export class OrthographicCameraObject extends GameObject {
	override object3d: three.OrthographicCamera;

	#left: number;
	get left() {
		return this.#left;
	}
	set left(value: number) {
		this.#left = value;
		this.object3d.left = value;
		this.object3d.updateProjectionMatrix();
	}

	#right: number;
	get right() {
		return this.#right;
	}
	set right(value: number) {
		this.#right = value;
		this.object3d.right = value;
		this.object3d.updateProjectionMatrix();
	}

	#top: number;
	get top() {
		return this.#top;
	}
	set top(value: number) {
		this.#top = value;
		this.object3d.top = value;
		this.object3d.updateProjectionMatrix();
	}

	#bottom: number;
	get bottom() {
		return this.#bottom;
	}
	set bottom(value: number) {
		this.#bottom = value;
		this.object3d.bottom = value;
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
		left?: number,
		right?: number,
		top?: number,
		bottom?: number,
		near?: number,
		far?: number,
	} = {}){
		super();

		this.#left = settings.left ?? -1;
		this.#right = settings.right ?? 1;
		this.#top = settings.top ?? 1;
		this.#bottom = settings.bottom ?? -1;
		this.#near = settings.near ?? 0.1;
		this.#far = settings.far ?? 1000;

		this.object3d = new three.OrthographicCamera(
			this.#left,
			this.#right,
			this.#top,
			this.#bottom,
			this.#near,
			this.#far
		);

		this.object3d.userData.owner = this;
	}

	override onCreate() {
		super.onCreate();

		ASSERT(this.scene?.game?.renderTarget, "OrthographicCameraObject must be used in a scene with a render target");

		const aspect = this.scene?.game?.renderTarget ? (this.scene.game.renderTarget.clientWidth / this.scene.game.renderTarget.clientHeight) : 1;
		this.object3d.left = -aspect;
		this.object3d.right = aspect;
		this.object3d.updateProjectionMatrix();
	}

	override onResize() {
		const aspect = this.scene?.game?.renderTarget ? (this.scene.game.renderTarget.clientWidth / this.scene.game.renderTarget.clientHeight) : 1;
		this.object3d.left = -aspect;
		this.object3d.right = aspect;
		this.object3d.updateProjectionMatrix();
	}
}