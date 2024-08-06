import * as three from "three";
import { Actor } from "./actor";
import { Scene } from "./scene";

export class Component {
	#parentActor: Actor;
	get parentActor() {
		return this.#parentActor;
	}

	hasBeenCreated: boolean = false;
	isSpawned: boolean = false;
	isMarkedForDestruction: boolean = false;
	isDestroyed: boolean = false;

	constructor(parentActor: Actor) {
		this.#parentActor = parentActor;
	}

	destroy() {
	}

	onCreate() {
	}

	onAddedToActor() {
	}

	onSpawn() {
	}

	onUpdate() {
	}

	onPostUpdate() {
	}

	onDespawn() {
	}

	onRemovedFromActor() {
	}

	onDestroy() {
	}
}

export class SceneComponent extends Component {
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

	#children: Set<Actor | Component> = new Set;
	get children() {
		return this.#children;
	}

	addChild(child: Actor | Component) {
		this.children.add(child);
	}

	removeChild(child: Actor | Component) {
		this.children.delete(child);
	}

	constructor(scene: Scene, parentActor: Actor) {
		super(parentActor);
		this.#object3d = new three.Object3D;
		this.#object3d.userData.owner = this;
		this.#scene = scene;
	}
}

export class BehaviorComponent extends Component {
	#children: Set<BehaviorComponent> = new Set;
	get children() {
		return this.#children;
	}

	addChild(child: BehaviorComponent) {
		this.children.add(child);
	}

	removeChild(child: BehaviorComponent) {
		this.children.delete(child);
	}
}