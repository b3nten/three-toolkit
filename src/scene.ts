import { Actor } from "./actor";
import { Component } from "./component";

export abstract class Scene {
	root = new Actor(this);

	public addChild(child: Actor | Component) {
		this.root.addChild(child);
	}

	public removeChild(child: Actor | Component) {
		this.root.removeChild(child);
	}

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

	#runCreationLogicOnEntity(entity: Actor | Component) {
		// creates an entity and all subchildren
	}

	#runSpawnLogicOnEntity(entity: Actor | Component) {
		// spawns an entity and all subchildren
	}

	#runUpdateLogicOnEntity(entity: Actor | Component) {
		// updates an entity and all subchildren
	}

	#runDespawnLogicOnEntity(entity: Actor | Component) {
		// despawns an entity and all subchildren
	}

	#runDestroyLogicOnEntity(entity: Actor | Component) {
		// destroys an entity and all subchildren
	}

	#addChildToEntity(parent: Actor | Component, child: Actor | Component) {
		// adds a child to an entity
	}

	#removeChildFromEntity(parent: Actor | Component, child: Actor | Component) {
		// removes a child from an entity
	}

	#enableEntity(entity: Actor | Component) {

	}

	#disableEntity(entity: Actor | Component) {

	}
}