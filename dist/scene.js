import { SceneObject } from "./game_objects/SceneObject.js";
import * as Three from "three";
import { ActiveCamera } from "./mod.js";
class PointerController {
  #raycaster = new Three.Raycaster();
  intersections = /* @__PURE__ */ new Set();
  cast(pointer, camera, scene) {
    this.#raycaster.setFromCamera(pointer, camera);
    for (const i of this.#raycaster.intersectObjects(scene.object3d.children)) {
      if (i.object.userData.owner) this.intersections.add(i.object.userData.owner);
    }
  }
}
export class Scene {
  game;
  root;
  behaviorsById = /* @__PURE__ */ new Map();
  behaviorsByTag = /* @__PURE__ */ new Map();
  gameObjectsById = /* @__PURE__ */ new Map();
  gameObjectsByTag = /* @__PURE__ */ new Map();
  get sound() {
    return this.game.sound;
  }
  get input() {
    return this.game.input;
  }
  get clock() {
    return this.game.clock;
  }
  get pointerIntersections() {
    return this.#pointerController.intersections;
  }
  get isLoading() {
    return this.#isLoading;
  }
  get hasLoaded() {
    return this.#hasLoaded;
  }
  get hasStarted() {
    return this.#hasStarted;
  }
  get isPlaying() {
    return this.#isPlaying;
  }
  get isEnding() {
    return this.#isEnding;
  }
  get isDestroyed() {
    return this.#isDestroyed;
  }
  constructor() {
    this.root = new SceneObject();
    this.root.scene = this;
  }
  async setup() {
  }
  play() {
    this.#isPlaying = true;
    this.root.create();
    this.root.spawn();
  }
  update(frametime, elapsedtime) {
    const camera = this.getGameObjectsByTag(ActiveCamera).values().next().value;
    this.#pointerController.intersections.clear();
    if (camera) {
      this.#pointerController.cast(this.game.pointer, camera.object3d, this.root);
    }
    this.input.replay();
    this.root.update(frametime, elapsedtime);
    this.game.renderPipeline.render(frametime, elapsedtime);
  }
  endPlay() {
    this.#isPlaying = false;
    this.#isEnding = true;
    this.root.despawn();
    this.root.destroy();
  }
  destructor() {
    this.#isDestroyed = true;
    this.root.despawn();
    this.root.destroy();
    this.sound.destructor();
  }
  getBehaviorById(id) {
    return this.behaviorsById.get(id);
  }
  getBehaviorsByTag(tag) {
    if (!this.behaviorsByTag.get(tag)) {
      this.behaviorsByTag.set(tag, /* @__PURE__ */ new Set());
    }
    return this.behaviorsByTag.get(tag);
  }
  getGameObjectById(id) {
    return this.gameObjectsById.get(id);
  }
  getGameObjectsByTag(tag) {
    if (!this.gameObjectsByTag.get(tag)) {
      this.gameObjectsByTag.set(tag, /* @__PURE__ */ new Set());
    }
    return this.gameObjectsByTag.get(tag);
  }
  getActiveCamera() {
    return this.getGameObjectsByTag(ActiveCamera).values().next().value;
  }
  setActiveCamera(gameObject) {
    const current = this.getActiveCamera();
    if (current) {
      current.removeTag(ActiveCamera);
    }
    gameObject.addTag(ActiveCamera);
  }
  #pointerController = new PointerController();
  #isLoading = false;
  #hasLoaded = false;
  #hasStarted = false;
  #isPlaying = false;
  #isEnding = false;
  #isDestroyed = false;
}
