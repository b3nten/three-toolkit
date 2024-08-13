import { Scene } from "./scene";
import * as three from "three";
import { Behavior } from "./behavior";
import { destroy } from "../destroy";
import { Asserts } from "../asserts";

export class GameObject {

	#object3d: three.Object3D;

	scene: Scene | null = null;

	parent: GameObject | null = null;

	get object3d() { return this.#object3d; }

	get position() { return this.object3d.position; }

	get rotation() { return this.object3d.rotation; }

	get scale() { return this.object3d.scale; }

	get quaternion() { return this.object3d.quaternion; }

	get matrix() { return this.object3d.matrix; }

	get visible() { return this.object3d.visible; }

	set visible(value: boolean) { this.object3d.visible = value; }

	children: Set<GameObject | Behavior> = new Set;

	initialized = false;
	spawned = false;
	destroyed = false;

	constructor() {
		this.#object3d = new three.Object3D;
		this.#object3d.userData.owner = this;
	}

	addChild<T extends GameObject | Behavior>(child: T): T {
		if(Asserts.IsActor(child)){
			child.parent?.removeChild(child)
			child.parent = this;
			if(this.initialized && !child.initialized){
				child.create()
			}
			if(this.spawned && !child.spawned){
				child.spawn()
			}
			return child;
		} else if(Asserts.IsComponent(child)) {
			if(child.parent instanceof Component || child.parent instanceof Behavior){
				child.parent.removeChild(child as Behavior)
			}
			child.parent = this;
			if(this.initialized && !child.initialized){
				child.create()
			}
			if(this.spawned && !child.spawned){
				child.spawn()
			}
			return child;
		} else {
			throw Error(`Unknown child: ${String(child)}`)
		}
	}

	removeChild<T extends GameObject | Behavior>(child: T): T {
		if(Asserts.IsActor(child)){
			child.parent = null;
			this.children.delete(child)
			return child;
		} else if(Asserts.IsComponent(child)) {
			child.parent = null;
			this.children.delete(child)
			return child;
		} else {
			throw Error(`Unknown child: ${String(child)}`)
		}
	}

	create(){
		if(this.initialized || this.destroyed) return;

		this.onCreate?.();

		this.initialized = true;

		for(const child of this.children){
			child.scene = this.scene;
			child.create();
		}
	}

	spawn(){
		if(this.spawned || this.destroyed) return;
		this.onSpawn?.()
		for(const child of this.children){
			child.spawn()
		}
	}

	update(frametime: number, elapsedtime: number){
		if(!this.spawned || this.destroyed) return;
		this.onUpdate?.(frametime, elapsedtime)
		for(const child of this.children){
			child.update(frametime, elapsedtime)
		}
	}

	despawn(){
		if(!this.spawned || this.destroyed) return;

		this.onDespawn?.();

		for(const child of this.children){
			child.despawn()
		}
	}

	destroy(){
		if(this.destroyed) return;
		this.destructor?.()
		this.destroyed = true;
		destroy(this.object3d)
		for(const child of this.children){
			child.despawn()
		}
	}

	onCreate?(): void;
	onSpawn?(): void;
	onUpdate?(frametime: number, elapsedtime: number): void;
	onDespawn?(): void;
	destructor?(): void;
}