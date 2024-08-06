import { Scene } from "./scene";
import * as three from "three";
import { Component } from "./component";

export class Actor {
	#object3d: three.Object3D;
	get object3d() {
		return this.#object3d;
	}

	#scene: Scene;
	get scene() {
		return this.#scene;
	}

	get position() {
		return this.object3d.position;
	}

	get rotation() {
		return this.object3d.rotation;
	}

	get scale() {
		return this.object3d.scale;
	}

	get quaternion() {
		return this.object3d.quaternion;
	}

	get matrix() {
		return this.object3d.matrix;
	}

	get visible() {
		return this.object3d.visible;
	}

	set visible(value: boolean) {
		this.object3d.visible = value;
	}

	hasBeenCreated: boolean = false;
	isSpawned: boolean = false;
	isMarkedForDestruction: boolean = false;
	isDestroyed: boolean = false;

	children: Set<Actor | Component> = new Set;

	addChild(child: Actor | Component) {
	}

	removeChild(child: Actor | Component) {
	}

	constructor(scene: Scene) {
		this.#object3d = new three.Object3D;
		this.#object3d.userData.owner = this;
		this.#scene = scene;
	}

	destroy() {
	}

	onCreate() {
	}

	onSpawn() {
	}

	onUpdate() {
	}

	onPostUpdate() {
	}

	onDespawn() {
	}

	onDestroy() {
	}

	onComponentAdded(component: Component) {
	}

	onComponentRemoved(component: Component) {
	}

	onComponentsRegistered() {
	}
}