import * as three from "three";
import { Actor } from "./actor";
import { Scene } from "./scene";
import { destroy } from "./destroy";
import { Asserts } from "./asserts";

export class Component {
	parent: Actor | Component | null = null;

	scene: Scene | null = null;

	initialized = false;
	spawned = false;
	destroyed = false;

	create(){
		if(this.initialized) return;
		this.onCreate?.();
		this.initialized = true;
	}
	spawn(){
		if(!this.initialized || this.spawned || this.destroyed) return;
		this.onSpawn?.()
		this.spawned = true;
	}
	update(frametime: number, elapsed: number){
		if(!this.initialized || !this.spawned || this.destroyed) return;
		this.onUpdate?.(frametime, elapsed);
	}
	despawn(){
		if(!this.spawned || this.destroyed) return;
		this.onDespawn?.();
	}
	destroy(){
		if(this.destroyed) return;
		this.destructor?.();
	}

	onCreate?(): void;
	onSpawn?(): void;
	onUpdate?(frametime: number, elapsedtime: number): void;
	onDespawn?(): void;
	destructor?(): void;
}

export class SceneComponent extends Component {

	#object3d: three.Object3D;

	#children: Set<Actor | Component> = new Set;

	get object3d() { return this.#object3d; }

	get position() { return this.object3d.position; }

	get rotation() { return this.object3d.rotation; }

	get scale() { return this.object3d.scale; }

	get quaternion() { return this.object3d.quaternion; }

	get matrix() { return this.object3d.matrix; }

	get visible() { return this.object3d.visible; }

	set visible(value: boolean) { this.object3d.visible = value; }

	get children() { return this.#children; }

	constructor() {
		super()
		this.#object3d = new three.Object3D;
		this.#object3d.userData.owner = this;
	}

	addChild<T extends Actor | Component>(child: T): T {
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
			if(child.parent instanceof SceneComponent || child.parent instanceof BehaviorComponent){
				child.parent.removeChild(child as Component)
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

	removeChild<T extends Actor | Component>(child: T): T {
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
		super.create();
		for(const child of this.children){
			child.scene = this.scene;
			child.create()
		}
	}

	spawn(){
		super.spawn()
		for(const child of this.children){
			child.spawn()
		}
	}

	update(frametime: number, elapsedtime: number){
		super.update(frametime, elapsedtime)
		for(const child of this.children){
			child.update(frametime, elapsedtime)
		}
	}

	despawn(){
		super.despawn()
		for(const child of this.children){
			child.despawn()
		}
	}

	destroy(){
		super.destroy()
		destroy(this.object3d)
		for(const child of this.children){
			child.destroy()
		}
	}
}

export class BehaviorComponent extends Component {

	#children: Set<BehaviorComponent> = new Set;

	get children() { return this.#children; }

	addChild<T extends BehaviorComponent>(child: T): T {
		if(Asserts.IsBehaviorComponent(child)) {
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

	removeChild<T extends BehaviorComponent>(child: T): T {
		if(Asserts.IsBehaviorComponent(child)) {
			child.parent = null;
			this.children.delete(child)
			return child;
		} else {
			throw Error(`Unknown child: ${String(child)}`)
		}
	}

	create(){
		super.create()
		for(const child of this.children){
			child.scene = this.scene;
			child.create();
		}
	}

	spawn(){
		super.spawn()
		for(const child of this.children){
			child.spawn()
		}
	}

	update(frametime: number, elapsedtime: number){
		super.update(frametime, elapsedtime)
		for(const child of this.children){
			child.update(frametime, elapsedtime)
		}
	}

	despawn(){
		super.despawn()
		for(const child of this.children){
			child.despawn()
		}
	}

	destroy(){
		super.destroy()
		for(const child of this.children){
			child.destroy()
		}
	}
}