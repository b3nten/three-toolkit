import * as three from "three";
import type PostProcessing from "postprocessing";
import type { Editor } from "./editor";
import { destroy } from "./destroy";

export class Scene {
  target: HTMLElement;
  root: three.Scene;
  renderer: three.WebGLRenderer;

  #camera: three.Camera;

  get camera(): three.Camera {
    return this.#camera;
  }

  set camera(camera: three.Camera) {
    this.#camera = camera;

    if (this.editor) {
      this.editor.camera = camera;
    }

    if (this.postprocessing) {
      this.postprocessing.setMainCamera(camera);
    }
  }

  postprocessing?: PostProcessing.EffectComposer;

  editor?: Editor;

  #clock: three.Clock = new three.Clock();

  #width: number;
  #height: number;

  #started: boolean = false;
  #destroyed: boolean = false;

  set dimensions({ width, height }: { width: number; height: number }) {
    this.#width = width;
    this.#height = height;

    this.renderer.setSize(width, height);

    if (this.postprocessing) {
      this.postprocessing.setSize(width, height);
    }

    if (this.camera.type === "PerspectiveCamera") {
      const c = this.camera as three.PerspectiveCamera;
      c.aspect = width / height;
      c.updateProjectionMatrix();
    }
  }

  get dimensions(): { width: number; height: number } {
    return { width: this.#width, height: this.#height };
  }

  constructor(args: {
    target?: HTMLElement;
    scene?: three.Scene;
    camera?: three.Camera;
    renderer?: three.WebGLRenderer;
    postprocessing?: PostProcessing.EffectComposer;
  }) {
    this.target = args.target ?? document.body;

    this.root = args.scene ?? new three.Scene();

    this.renderer = args.renderer || new three.WebGLRenderer({
      alpha: true,
      powerPreference: "high-performance",
      antialias: this.postprocessing ? false : true,
    });

    this.postprocessing = args.postprocessing;

    this.#camera = args.camera ??
      new three.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
    if (this.#camera.name.length === 0) {
      this.#camera.name = "Default Camera";
    }
    this.root.add(this.#camera);

    const dimensions = this.target.getBoundingClientRect();
    this.#height = dimensions.height;
    this.#width = dimensions.width;
    this.dimensions = { width: dimensions.width, height: dimensions.height };
  }

  async enableEditor(): Promise<void> {
    this.editor = new (await import("./editor")).Editor({
      scene: this.root,
      camera: this.camera,
      renderer: this.renderer,
      postprocessing: this.postprocessing,
    });
  }

  resize(): void {
    const dimensions = this.target.getBoundingClientRect();
    this.dimensions = { width: dimensions.width, height: dimensions.height };
  }

  #onRenderCallbacks: Set<(scene: this) => void> = new Set();

  onUpdate(callback: (scene: this) => void): () => void {
    this.#onRenderCallbacks.add(callback);
    return () => this.#onRenderCallbacks.delete(callback);
  }

  #onAfterRenderCallbacks = new Set<(scene: this) => void>();

  onAfterRender(callback: (scene: this) => void): () => void {
    this.#onAfterRenderCallbacks.add(callback);
    return () => this.#onAfterRenderCallbacks.delete(callback);
  }

  play(): void {
    if (!this.#started && !this.#destroyed) {
      this.#started = true;
      this.target.appendChild(this.renderer.domElement);
      requestAnimationFrame(() => this.#updateLoop());
    }
  }

  #updateLoop(): void {
    requestAnimationFrame(() => this.#updateLoop());
    const delta = this.#clock.getDelta();
    this.#onRenderCallbacks.forEach((callback) => callback(this));
    if (this.editor) {
      this.editor.render(delta);
    } else if (this.postprocessing) {
      this.postprocessing.render(delta);
    } else {
      this.renderer.render(this.root, this.camera);
    }
    this.#onAfterRenderCallbacks.forEach((callback) => callback(this));
  }

  destroy(): void {
    this.#onRenderCallbacks.clear();
    this.#onAfterRenderCallbacks.clear();
    this.#started = false;
    this.target.removeChild(this.renderer.domElement);
    if (this.editor) {
      this.editor.destroy();
      this.editor = undefined;
    }
    destroy(this.root);
    this.renderer.dispose();
    this.postprocessing?.dispose();
    this.#clock.stop();
  }
}
