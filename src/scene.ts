import { Actor } from "./actor";
import { Component } from "./component";

export abstract class Scene {

	root: Actor;

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
		this.root = new Actor;
		this.root.scene = this;
	}


	async load() {
	}

	play() {
		this.#isPlaying = true;
	}

	update() {

		this.render();
	}

	abstract render(): void;

	endPlay() {
		this.#isPlaying = false;
		this.#isEnding = true;
	}

	destructor() {
		this.#isDestroyed = true;
	}
}