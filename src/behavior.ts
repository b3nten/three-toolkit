import { GameObject } from "./gameobject";
import { Scene } from "./scene";

export class Behavior {

	public id?: string | symbol;

	public tags = new Set<string | symbol>;

	parent: GameObject | null = null;

	scene: Scene | null = null;

	initialized = false;

	spawned = false;

	destroyed = false;

	create(){
		if(this.initialized) return;
		this.onCreate();
		this.initialized = true;
	}

	spawn(){
		if(!this.initialized || this.spawned || this.destroyed) return;
		this.onSpawn()
		this.spawned = true;
	}

	update(frametime: number, elapsed: number){
		if(!this.initialized || !this.spawned || this.destroyed) return;
		this.onUpdate(frametime, elapsed);
	}

	despawn(){
		if(!this.spawned || this.destroyed) return;
		this.onDespawn();
	}

	destroy(){
		if(this.destroyed) return;
		this.destructor();
	}

	resize(bounds: DOMRect){
		if(!this.initialized || this.destroyed) return;
		this.onResize(bounds);
	}

	onCreate(): void {};
	onSpawn(): void {};
	onUpdate(frametime: number, elapsedtime: number): void {};
	onDespawn(): void {};
	onResize(bounds: DOMRect): void {};
	destructor(): void {};
}
