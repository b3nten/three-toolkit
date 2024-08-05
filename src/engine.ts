import * as three from 'three'

type Constructor<T, Args extends any[]> = new (...args: Args) => T;

const isActor = (object: any): object is Actor => object instanceof Actor;
const isComponent = (object: any): object is Component => object instanceof Component;
const isBehaviorComponent = (object: any): object is BehaviorComponent => object instanceof BehaviorComponent;
const isSceneComponent = (object: any): object is SceneComponent => object instanceof SceneComponent;

/*
	Lifecycle:

	Actor: onCreate -> onSpawn -> onUpdate -> onDespawn -> onDestroy
	Component: onCreate -> onAddedToActor -> onSpawn -> onUpdate -> onDespawn -> onRemovedFromActor -> onDestroy

	Scene->load()
		Scene->loadAssets()
	Scene->play()
		Actor->onCreate()
			Component->onCreate()
			Component->onAddedToActor()
		Actor->onSpawn()
			Component->onSpawn()
		Actor->onUpdate()
			Component->onUpdate()
		Actor->onPostUpdate()
			Component->onPostUpdate()
		Actor->onDespawn()
			Component->onDespawn()
		Actor->onDestroy()
			Component->onRemovedFromActor()
			Component->onDespawn()
			Component->onDestroy()
	Scene->endPlay()
		Actor->onDespawn()
			Component->onDespawn()
		Actor->onDestroy()
			Component->onDestroy()
*/

export class Game {

}

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

	async load() {}

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

	#runCreationLogicOnEntity(entity: Actor | Component){
		// creates an entity and all subchildren
	}
	#runSpawnLogicOnEntity(entity: Actor | Component){
		// spawns an entity and all subchildren
	}
	#runUpdateLogicOnEntity(entity: Actor | Component){
		// updates an entity and all subchildren
	}
	#runDespawnLogicOnEntity(entity: Actor | Component){
		// despawns an entity and all subchildren
	}
	#runDestroyLogicOnEntity(entity: Actor | Component){
		// destroys an entity and all subchildren
	}
	#addChildToEntity(parent: Actor | Component, child: Actor | Component){
		// adds a child to an entity
	}
	#removeChildFromEntity(parent: Actor | Component, child: Actor | Component){
		// removes a child from an entity
	}
	#enableEntity(entity: Actor | Component){

	}
	#disableEntity(entity: Actor | Component){

	}
}

export class Actor {
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

	hasBeenCreated: boolean = false;
	isSpawned: boolean = false;
	isMarkedForDestruction: boolean = false;
	isDestroyed: boolean = false;

	children: Set<Actor | Component> = new Set;
	addChild(child: Actor | Component) {}
	removeChild(child: Actor | Component) {}

	constructor(scene: Scene) {
		this.#object3d = new three.Object3D;
		this.#object3d.userData.owner = this;
		this.#scene = scene;
	}

	destroy(){}

	onCreate() {}
	onSpawn() {}
	onUpdate() {}
	onPostUpdate() {}
	onDespawn() {}
	onDestroy() {}
	onComponentAdded(component: Component) {}
	onComponentRemoved(component: Component) {}
	onComponentsRegistered () {}
}

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

	destroy(){}

	onCreate() {}
	onAddedToActor() {}
	onSpawn() {}
	onUpdate() {}
	onPostUpdate() {}
	onDespawn() {}
	onRemovedFromActor() {}
	onDestroy() {}
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
