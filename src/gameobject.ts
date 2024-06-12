import { Group, Object3D, Scene } from "three";

/***********************************************************
    Generic Types
 ************************************************************/

type ConstructorOf<T, Args extends any[] = any[]> = new (
  ...args: Args
) => T;

type Component = any;

/***********************************************************
    GameObject Container
 ************************************************************/

class GameObjectContainer {
  #root = new Scene();
  get root() {
    return this.#root;
  }

  private gameObjects: Set<GameObject> = new Set();

  #state: "idle" | "running" | "destroyed" = "idle";
  get state() {
    return this.#state;
  }

  public run(): void {
    if (this.#state !== "idle") return;
    this.#state = "running";
    for (const gameObject of this.gameObjects) {
      this.#startGameObject(gameObject);
    }
  }

  public tick(delta: number, elapsed: number): void {
    if (this.#state !== "running") return;
    for (const gameObject of this.gameObjects) {
      this.#updateGameObject(gameObject, delta, elapsed);
    }
  }

  public destroy(): void {
    if (this.#state !== "running") return;
    this.#state = "destroyed";
    for (const gameObject of this.gameObjects) {
      this.destroyGameObject(gameObject);
    }
  }

  addGameObject<T extends GameObject, Args extends any[]>(
    gameObject: ConstructorOf<T, Args>,
    ...args: Args
  ): T {
    const instance = GameObject.Create(this, gameObject, ...args);
    this.#root.add(instance.root);
    this.gameObjects.add(instance);
    if (this.#state === "running") {
      this.#startGameObject(instance);
    }
    return instance;
  }

  destroyGameObject<T extends GameObject>(gameObject: T): T {
    this.#destroyGameObject(gameObject);
    return gameObject;
  }

  addComponentToGameObject<T extends Component>(
    gameObject: GameObject,
    component: T,
  ): T {
    gameObject.components.push(component);
    if (component instanceof Object3D) {
      gameObject.root.add(component);
    }
    return component;
  }

  removeComponentFromGameObject<T extends Component>(
    gameObject: GameObject,
    component: T,
  ): T {
    const index = gameObject.components.indexOf(component);
    if (index !== -1) {
      gameObject.components.splice(index, 1);
    }
    if (component instanceof Object3D) {
      gameObject.root.remove(component);
    }
    return component;
  }

  addBehaviorToGameObject<T extends Behavior, Args extends any[]>(
    gameObject: GameObject,
    behavior: ConstructorOf<T, [GameObject, ...Args]>,
    ...args: Args
  ): T {
    const instance = Behavior.Create(gameObject, behavior, ...args);
    gameObject.behaviors.push(instance);
    return instance;
  }

  removeBehaviorFromGameObject<T extends Behavior>(behavior: T): T {
    const index = behavior.gameObject.behaviors.indexOf(behavior);
    if (index !== -1) {
      behavior.gameObject.behaviors.splice(index, 1);
    }
    this.#destroyBehavior(behavior);
    return behavior;
  }

  destroyBehavior<T extends Behavior>(behavior: T): T {
    this.#destroyBehavior(behavior);
    return behavior;
  }

  #startGameObject(gameObject: GameObject): void {
    if (this.#state !== "running") return;
    gameObject.onCreate?.();
    gameObject.created = true;
    for (const behavior of gameObject.behaviors) {
      this.#startBehavior(behavior);
    }
  }

  #updateGameObject(
    gameObject: GameObject,
    delta: number,
    elapsed: number,
  ): void {
    if (this.#state !== "running") return;
    if (gameObject.enabled) {
      if (!gameObject.created) this.#startGameObject(gameObject);
      gameObject.onUpdate?.(delta, elapsed);
      gameObject.behaviors.forEach((behavior) => {
        this.#updateBehavior(behavior, delta, elapsed);
      });
    }
  }

  #destroyGameObject(gameObject: GameObject): void {
    if (gameObject.created && !gameObject.destroyed) {
      gameObject.onDestroy?.();
      gameObject.created = false;
      gameObject.destroyed = true;
    }
    for (const behavior of gameObject.behaviors) {
      this.#destroyBehavior(behavior);
    }
  }

  #startBehavior(behavior: Behavior): void {
    behavior.onCreate?.();
    behavior.created = true;
  }

  #updateBehavior(behavior: Behavior, delta: number, elapsed: number): void {
    if (behavior.enabled) {
      if (!behavior.created) this.#startBehavior(behavior);
      behavior.onUpdate?.(delta, elapsed);
    }
  }

  #destroyBehavior(behavior: Behavior): void {
    if (behavior.created && !behavior.destroyed) {
      behavior.onDestroy?.();
      behavior.created = false;
      behavior.destroyed = true;
    }
  }
}

/***************************************************************************************
 GAME OBJECT
 ***************************************************************************************/

let currentGameObjectContainer: GameObjectContainer | null = null;
const setCurrentGameObjectContainer = (scene: GameObjectContainer | null) =>
  currentGameObjectContainer = scene;
const getCurrentGameObjectContainer = () => {
  if (!currentGameObjectContainer) {
    throw new Error(
      "GameObject created without a provided GameObjectContainer. If you encounter this through normal usage it's a bug.",
    );
  }
  return currentGameObjectContainer;
};

class GameObject {
  static Create<T extends GameObject, Args extends any[]>(
    scene: GameObjectContainer,
    gameObject: ConstructorOf<T, Args>,
    ...args: Args
  ): T {
    setCurrentGameObjectContainer(scene);
    const instance = new gameObject(...args);
    setCurrentGameObjectContainer(null);
    return instance;
  }

  #root = new Group();
  get root() {
    return this.#root;
  }

  container: GameObjectContainer = getCurrentGameObjectContainer();

  /***************************************************************************************
	 PROPERTIES
	 ***************************************************************************************/

  get position() {
    return this.#root.position;
  }
  get rotation() {
    return this.#root.rotation;
  }
  get scale() {
    return this.#root.scale;
  }
  get quaternion() {
    return this.#root.quaternion;
  }
  get matrix() {
    return this.#root.matrix;
  }
  get visible() {
    return this.#root.visible;
  }
  set visible(value: boolean) {
    this.#root.visible = value;
  }

  components: Component[] = [];
  behaviors: Behavior[] = [];

  created: boolean = false;
  destroyed: boolean = false;
  #enabled: boolean = true;
  get enabled() {
    return this.#enabled;
  }
  set enabled(value: boolean) {
    if (value !== this.#enabled) {
      this.#enabled = value;
      if (!value) {
        this.visible = false;
      } else {
        this.visible = true;
      }
    }
  }

  tag: symbol | null = null;
  name: string = "GameObject";

  /**************************************************************************************
	 LIFE CYCLE
	 **************************************************************************************/

  onCreate?(): void;
  onUpdate?(delta: number, elapsed: number): void;
  onDestroy?(): void;

  /***************************************************************************************
	 METHODS
	 ***************************************************************************************/

  public addComponent<T extends Component>(component: T): T {
    return this.container.addComponentToGameObject(this, component);
  }

  public removeComponent<T extends Component>(component: T): T {
    return this.container.removeComponentFromGameObject(this, component);
  }

  public addBehavior<T extends Behavior, Args extends any[]>(
    behavior: ConstructorOf<T, [GameObject, ...Args]>,
    ...args: Args
  ): T {
    return this.container.addBehaviorToGameObject(this, behavior, ...args);
  }

  public removeBehavior<T extends Behavior>(behavior: T): T {
    return this.container.destroyBehavior(behavior);
  }
}

/***************************************************************************************
 BEHAVIOR
 ***************************************************************************************/

let currentGameObject: GameObject | null = null;
const setCurrentGameObject = (scene: GameObject | null) =>
  currentGameObject = scene;
const getCurrentGameObject = () => {
  if (!currentGameObject) {
    throw new Error(
      "Behavior created without a provided GameObject. If you encounter this through normal usage it's a bug.",
    );
  }
  return currentGameObject;
};

abstract class Behavior {
  static Create<T extends Behavior, Args extends any[]>(
    gameObject: GameObject,
    behavior: ConstructorOf<T, [GameObject, ...Args]>,
    ...args: Args
  ): T {
    setCurrentGameObject(gameObject);
    const instance = new behavior(gameObject, ...args);
    setCurrentGameObject(null);
    return instance;
  }

  gameObject: GameObject = getCurrentGameObject()!;

  /***************************************************************************************
	 PROPERTIES
	 ***************************************************************************************/
  created: boolean = false;
  destroyed: boolean = false;
  enabled: boolean = true;

  tag?: symbol;
  name: string = "Behavior";

  /**************************************************************************************
	 LIFE CYCLE
	 **************************************************************************************/

  onCreate?(): void;

  onUpdate?(delta: number, elapsed: number): void;

  onDestroy?(): void;
}

export { Behavior, type Component, GameObject, GameObjectContainer };
