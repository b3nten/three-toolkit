import { GameObject } from "./gameobject";

export abstract class Scene {

	root: GameObject;

	canvas: HTMLCanvasElement | null = null;

	#frametime = 16.66;
	#elapsed = 0;

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
		this.root = new GameObject;
		this.root.scene = this;
	}

	async setup() {}

	play() {
		this.#isPlaying = true;
		this.root.create()
		this.root.spawn()
	}

	update() {
		const t = performance.now()
		this.root.update(t - this.#frametime, this.#elapsed)
		this.render(this.#frametime, this.#elapsed);
		this.#frametime = performance.now() - t;
		this.#elapsed += this.#frametime;
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