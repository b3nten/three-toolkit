import * as three from 'three';
import { SceneObject } from "./gameobjects/SceneObject";

export abstract class Scene {

	root: SceneObject;

	canvas: HTMLCanvasElement | null = null;

	renderer: three.WebGLRenderer | null = null;

	#isLoading: boolean = false;
	get isLoading() {
		return this.#isLoading;
	}

	#hasLoaded: boolean = false;
	get hasLoaded() {
		return this.#hasLoaded;
	}

	#hasStarted: boolean = false;
	get hasStarted() {
		return this.#hasStarted;
	}

	#isPlaying: boolean = false;
	get isPlaying() {
		return this.#isPlaying;
	}

	#isEnding: boolean = false;
	get isEnding() {
		return this.#isEnding;
	}

	#isDestroyed: boolean = false;
	get isDestroyed() {
		return this.#isDestroyed;
	}

	constructor() {
		this.root = new SceneObject;
		this.root.scene = this;
	}

	async setup() {}

	play() {
		this.#isPlaying = true;
		this.root.create()
		this.root.spawn()
	}

	update(frametime: number, elapsedtime: number) {
		this.root.update(frametime, elapsedtime)
		this.render(frametime, elapsedtime);
	}

	abstract render(frametime: number, elapsedtime: number): void;

	endPlay() {
		this.#isPlaying = false;
		this.#isEnding = true;
		this.root.despawn()
		this.root.destroy()
	}

	destructor() {
		this.#isDestroyed = true;
		this.root.despawn()
		this.root.destroy()
	}
}