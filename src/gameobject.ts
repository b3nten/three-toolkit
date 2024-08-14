import { Scene } from "./scene";
import * as three from "three";
import { Behavior } from "./behavior";
import { destroy } from "./destroy";
import { Asserts } from "./asserts";

export class GameObject {

	object3d: three.Object3D;

	scene: Scene | null = null;

	parent: GameObject | null = null;

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
		this.object3d = new three.Object3D;
		this.object3d.userData.owner = this;
	}

	addChild<T extends GameObject | Behavior>(child: T): T {
		if(this.destroyed) return child;

		if(Asserts.IsGameObject(child.parent)){
			child.parent.removeChild(child)
		}

		this.children.add(child)

		child.parent = this;

		if(Asserts.IsGameObject(child)){
			this.object3d.add(child.object3d)
		}

		if(this.initialized){
			child.create();
		}

		if(this.spawned){
			child.spawn();
		}

		return child;
	}

	removeChild<T extends GameObject | Behavior>(child: T): T {
		if(this.destroyed) return child;

		child.parent = null;

		this.children.delete(child)

		if(Asserts.IsGameObject(child)){
			this.object3d.remove(child.object3d)
		}

		return child;
	}

	create(){
		if(this.initialized || this.destroyed) return;

		this.object3d.userData.owner = this;

		this.onCreate();

		this.initialized = true;

		for(const child of this.children){
			child.scene = this.scene;
			child.create();
		}
	}

	spawn(){
		if(this.spawned || this.destroyed) return;
		this.onSpawn()
		this.spawned = true;
		this.parent?.object3d.add(this.object3d)
		for(const child of this.children){
			child.spawn()
		}
	}

	update(frametime: number, elapsedtime: number){
		if(!this.spawned || this.destroyed) return;
		this.onUpdate(frametime, elapsedtime)
		for(const child of this.children){
			child.update(frametime, elapsedtime)
		}
	}

	despawn(){
		if(!this.spawned || this.destroyed) return;
		this.onDespawn();
		this.parent?.object3d.remove(this.object3d)
		for(const child of this.children){
			child.despawn()
		}
	}

	destroy(){
		if(this.destroyed) return;
		this.destructor()
		this.destroyed = true;
		destroy(this.object3d)
		for(const child of this.children){
			child.despawn()
		}
	}

	onCreate(): void {};
	onSpawn(): void {};
	onUpdate(frametime: number, elapsedtime: number): void {};
	onDespawn(): void {};
	destructor(): void {};
}