import { ASSERT } from "./assert.js";
import * as Three from "three";
import { SoundManager } from "./audio.js";
import { InputQueue } from "./input.js";
export class Game {
  currentScene = null;
  currentSceneLoaded = false;
  sound = new SoundManager();
  input = new InputQueue();
  clock = new Three.Clock();
  pointer = new Three.Vector2();
  renderPipeline;
  constructor(args) {
    this.loadScene = this.loadScene.bind(this);
    this.play = this.play.bind(this);
    this.gameloop = this.gameloop.bind(this);
    this.resize = this.resize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.renderPipeline = args.renderPipeline;
  }
  async loadScene(scene) {
    ASSERT(scene, "Scene must be defined");
    if (this.currentScene) {
      this.currentScene.destructor?.();
    }
    scene.game = this;
    this.currentScene = scene;
    await scene.setup?.();
    this.renderPipeline.onLoadScene?.(this, scene);
    this.renderPipeline.getRenderer().domElement.addEventListener("mousemove", this.onPointerMove.bind(this));
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    this.currentSceneLoaded = true;
  }
  play() {
    ASSERT(this.currentSceneLoaded, "Scene must be loaded before playing");
    ASSERT(this.currentScene);
    this.clock.elapsedTime = 0;
    this.currentScene.play();
    requestAnimationFrame(this.gameloop.bind(this));
  }
  gameloop() {
    requestAnimationFrame(this.gameloop.bind(this));
    this.currentScene.update(this.clock.getDelta(), this.clock.getElapsedTime());
  }
  resize() {
    const bounds = this.renderPipeline.getRenderer().domElement.getBoundingClientRect();
    this.renderPipeline.onResize?.(bounds);
    this.currentScene?.root.resize(bounds);
  }
  onPointerMove(event) {
    this.pointer.x = event.clientX / window.innerWidth * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
}
