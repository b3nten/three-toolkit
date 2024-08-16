import { SceneObject } from "./game_objects/SceneObject";
import { Game } from "./game";
import { Behavior } from "./behavior";
import { SoundManager } from "./audio";
import * as Three from "three"
import { GameObject } from "./game_object";
import { ActiveCamera } from "./mod";
import { InputQueue } from "./input";

class PointerController {

	#raycaster = new Three.Raycaster;

	intersections = new Set<GameObject>;

	cast(pointer: Three.Vector2, camera: Three.Camera, scene: SceneObject){
		this.#raycaster.setFromCamera(pointer, camera);
		for(const i of this.#raycaster.intersectObjects(scene.object3d.children)){
			if(i.object.userData.owner) this.intersections.add(i.object.userData.owner)
		}
	}
}

export abstract class Scene {

	game?: Game;

	root: SceneObject;

	behaviorsById = new Map<string | symbol, Behavior>;

	behaviorsByTag = new Map<string | symbol, Set<Behavior>>

	gameObjectsById = new Map<string | symbol, GameObject>;

	gameObjectsByTag = new Map<string | symbol, Set<GameObject>>;

	get sound(){ return this.game!.sound; } 

	get input(){ return this.game!.input; }

	get clock(){ return this.game!.clock; }

	get pointerIntersections(){ return this.#pointerController.intersections; }

	get isLoading() { return this.#isLoading; }

	get hasLoaded() { return this.#hasLoaded; }

	get hasStarted() { return this.#hasStarted; }

	get isPlaying() { return this.#isPlaying; }

	get isEnding() { return this.#isEnding; }

	get isDestroyed() { return this.#isDestroyed; }

	constructor() {
		this.root = new SceneObject;
		this.root.scene = this;
	}

	async setup(): Promise<void> {}

	play() {
		this.#isPlaying = true;
		this.root.create()
		this.root.spawn()
	}

	update(frametime: number, elapsedtime: number) {
		const camera = this.getGameObjectsByTag(ActiveCamera).values().next().value

		this.#pointerController.intersections.clear();

		if(camera){
			this.#pointerController.cast(this.game!.pointer, camera.object3d as Three.Camera, this.root);
		}
		
		this.input.replay();
		
		this.root.update(frametime, elapsedtime)

		this.game!.renderPipeline.render(frametime, elapsedtime)
	}

	endPlay() {
		this.#isPlaying = false;
		this.#isEnding = true;
		this.root.despawn()
		this.root.destroy()
	}

	destructor() {
		this.#isDestroyed = true;
		this.root.despawn();
		this.root.destroy();
		this.sound.destructor();
	}

	getBehaviorById(id: string | symbol): Behavior | undefined {
		return this.behaviorsById.get(id);
	}

	getBehaviorsByTag(tag: string | symbol): Set<Behavior> {
		if(!this.behaviorsByTag.get(tag)){
			this.behaviorsByTag.set(tag, new Set);
		}
		return this.behaviorsByTag.get(tag)!;
	}

	getGameObjectById(id: string | symbol): GameObject | undefined {
		return this.gameObjectsById.get(id);
	}

	getGameObjectsByTag(tag: string | symbol): Set<GameObject> {
		if(!this.gameObjectsByTag.get(tag)){
			this.gameObjectsByTag.set(tag, new Set);
		}	
		return this.gameObjectsByTag.get(tag)!;
	}

	getActiveCamera(): GameObject<Three.Camera> | undefined {
		return this.getGameObjectsByTag(ActiveCamera).values().next().value;
	}

	setActiveCamera(gameObject: GameObject): void {
		const current = this.getActiveCamera()
		if(current){
			current.removeTag(ActiveCamera)
		}
		gameObject.addTag(ActiveCamera)
	}

	#pointerController = new PointerController

	#isLoading: boolean = false;

	#hasLoaded: boolean = false;

	#hasStarted: boolean = false;

	#isPlaying: boolean = false;

	#isEnding: boolean = false;

	#isDestroyed: boolean = false;
}
