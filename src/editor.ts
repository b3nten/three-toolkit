import type { BloomEffect, EffectComposer, EffectPass } from "postprocessing";
import CameraControls from "camera-controls";
import * as three from "three";
import { FolderApi, ListBladeApi, Pane } from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";

class DebugGrid {
  constructor(private scene: three.Scene) {}

  #grid?: three.GridHelper;
  #axis?: three.AxesHelper;

  #enabled = false;

  get enabled() {
    return this.#enabled;
  }

  set enabled(value: boolean) {
    this.#enabled = value;

    if (value) {
      if (!this.#grid) {
        this.#grid = new three.GridHelper(20, 20, "gray", "gray");
        const mat = this.#grid.material as three.Material;
        mat.transparent = true;
        mat.opacity = 0.25;
        this.#grid.visible = this.#enabled;
        this.scene.add(this.#grid);
      }
      if (!this.#axis) {
        this.#axis = new three.AxesHelper(10);
        this.#axis.visible = this.#enabled;
        this.scene.add(this.#axis);
      }
      this.#grid.visible = true;
      this.#axis.visible = true;
    } else {
      if (this.#grid) {
        this.#grid.visible = false;
      }
      if (this.#axis) {
        this.#axis.visible = false;
      }
    }
  }
}

class DebugAxis {
  #axis: three.AxesHelper;

  constructor(private scene: three.Scene) {
    this.#axis = new three.AxesHelper(1);
    // this.scene.add(this.#axis)
  }

  onUpdate(camera: three.Camera) {
  }
}

class DebugLightHelpers {
  constructor(private scene: three.Scene) {}

  #enabled = false;

  #helpers: three.Object3D[] = [];

  get enabled() {
    return this.#enabled;
  }

  set enabled(value: boolean) {
    this.#enabled = value;
    if (value) {
      this.scene.traverse((object) => {
        console.log(object);
        if (object instanceof three.PointLight) {
          const helper = new three.PointLightHelper(object, 1, "yellow");
          this.#helpers.push(helper);
          this.scene.add(helper);
        }
        if (object instanceof three.DirectionalLight) {
          const helper = new three.DirectionalLightHelper(object, 1, "yellow");
          this.#helpers.push(helper);
          this.scene.add(helper);
        }
        if (object instanceof three.SpotLight) {
          const helper = new three.SpotLightHelper(object, "yellow");
          this.#helpers.push(helper);
          this.scene.add(helper);
        }
        if (object instanceof three.HemisphereLight) {
          const helper = new three.HemisphereLightHelper(object, 1);
          this.#helpers.push(helper);
          this.scene.add(helper);
        }
      });
    } else {
      this.#helpers.forEach((helper) => {
        this.scene.remove(helper);
      });
    }
  }
}

class DebugCamera {
  #helpers = new Map<three.Object3D, three.CameraHelper>();

  constructor(private scene: three.Scene) {
  }

  #enabled = false;

  get enabled() {
    return this.#enabled;
  }

  set enabled(value: boolean) {
    this.#enabled = value;
    if (value) {
      this.scene.traverse((object) => {
        if (object instanceof three.Camera) {
          const helper = new three.CameraHelper(object);
          this.#helpers.set(object, helper);
          this.scene.add(helper);
        }
      });
    } else {
      this.#helpers.forEach((helper) => {
        this.scene.remove(helper);
        this.#helpers.delete(helper);
      });
    }
  }
}

class EditorCamera {
  camera: three.PerspectiveCamera;
  controls: CameraControls;

  constructor(renderer: three.WebGLRenderer, scene: three.Scene) {
    const size = new three.Vector2();
    renderer.getSize(size);
    this.camera = new three.PerspectiveCamera(75, size.x / size.y, 0.1, 1000);
    this.camera.name = "Editor Camera";
    CameraControls.install({ THREE: three });
    this.camera.position.z = 5;
    this.controls = new CameraControls(this.camera, renderer.domElement);
    scene.add(this.camera);
  }

  update(delta: number) {
    this.controls.update(delta);
  }
}

class PostProcessingUI {
  composer: EffectComposer;

  constructor(composer: EffectComposer) {
    this.composer = composer;
  }

  buildUI(folder: FolderApi) {
    // @ts-ignore
    const effects = this.composer.passes.flatMap((p) => p.effects).filter(
      Boolean,
    ) as Array<EffectPass>;
    for (const effect of effects) {
      const f = folder.addFolder({
        title: effect.name,
        expanded: false,
      });

      if (effect.name === "BloomEffect") {
        const e = effect as unknown as BloomEffect;
        f.addBinding(e, "intensity", {
          label: "Intensity",
          min: 0,
          max: 10,
        });
      }

      // if(effect.name === "ToneMappingEffect"){
      //     const e = effect as unknown as ToneMappingEffect
      //     f.addBinding(e, 'mode', {
      //         view: 'select',
      //         label: 'Mode',
      //         options: Object.values(ToneMappingMode),
      //     })
      // }
    }
  }
}

export class Editor {
  scene: three.Scene;
  renderer: three.WebGLRenderer;
  postprocessing?: EffectComposer;

  #camera: three.Camera;

  get camera(): three.Camera {
    return this.#camera;
  }

  set camera(value: three.Camera) {
    this.#camera = value;
    if (this.postprocessing) {
      this.postprocessing.setMainCamera(value);
    }
    if (value === this.editorCamera.camera) {
      this.editorCamera.controls.enabled = true;
    } else {
      this.editorCamera.controls.enabled = false;
    }
  }

  pane: Pane = new Pane({
    expanded: true,
    title: "Editor",
  });

  debugGrid: DebugGrid;
  debugAxis: DebugAxis;
  debugCamera: DebugCamera;
  debugLightHelpers: DebugLightHelpers;

  editorCamera: EditorCamera;
  postProcessingController?: PostProcessingUI;

  #onStartRender: () => void = () => {};
  #onEndRender: () => void = () => {};

  constructor(args: {
    renderer: three.WebGLRenderer;
    scene: three.Scene;
    camera: three.Camera;
    postprocessing?: EffectComposer;
  }) {
    this.scene = args.scene;
    this.#camera = args.camera;
    this.renderer = args.renderer;
    this.postprocessing = args.postprocessing;
    if (this.postprocessing) {
      this.postProcessingController = new PostProcessingUI(this.postprocessing);
    }

    this.debugGrid = new DebugGrid(this.scene);
    this.debugAxis = new DebugAxis(this.scene);
    this.debugLightHelpers = new DebugLightHelpers(this.scene);
    this.debugCamera = new DebugCamera(this.scene);

    this.editorCamera = new EditorCamera(this.renderer, this.scene);

    this.pane.registerPlugin(EssentialsPlugin);

    this.buildStats();
    this.buildLights();
    this.buildPostProcessing();
    this.buildCamera();
    this.buildDebug();
  }

  buildStats(): void {
    const fps = this.pane.addBlade({
      view: "fpsgraph",
      label: "FPS",
      rows: 2,
      min: 0,
      max: 200,
    }) as EssentialsPlugin.FpsGraphBladeApi;

    this.#onStartRender = fps.begin.bind(fps);
    this.#onEndRender = fps.end.bind(fps);

    const stats = this.pane.addFolder({
      title: "Stats",
      expanded: false,
    });

    stats.addBinding(this.renderer.info.render, "calls", {
      readonly: true,
      label: "Draw Calls",
    });

    stats.addBinding(this.renderer.info.render, "triangles", {
      readonly: true,
      label: "Triangles",
    });

    stats.addBinding(this.renderer.info.render, "points", {
      readonly: true,
      label: "Points",
    });

    stats.addBinding(this.renderer.info.render, "lines", {
      readonly: true,
      label: "Lines",
    });

    stats.addBinding(this.renderer.info.memory, "geometries", {
      label: "Geo",
      readonly: true,
    });
    stats.addBinding(this.renderer.info.memory, "textures", {
      readonly: true,
      label: "Textures",
    });
  }

  buildLights(): void {
    const lights = this.pane.addFolder({
      title: "Lighting",
      expanded: false,
    });

    const l: Array<three.Light> = [];

    this.scene.traverse((object) => {
      if (object instanceof three.Light) {
        l.push(object);
      }
    });

    for (const light of l) {
      const f = lights.addFolder({
        title: light.name || light.type,
        expanded: false,
      });

      f.addBinding(light, "intensity", {
        label: "Intensity",
        min: 0,
        max: 10,
      });

      f.addBinding(light, "color", {
        label: "Color",
      });

      f.addBinding(light, "visible", {
        label: "Visible",
      });
    }
  }

  buildPostProcessing(): void {
    if (!this.postProcessingController) return;
    const f = this.pane.addFolder({
      title: "Post Processing",
      expanded: false,
    });
    this.postProcessingController.buildUI(f);
  }

  buildCamera(): void {
    const camera = this.pane.addFolder({
      title: "Camera",
      expanded: false,
    });

    const cameras: Array<{ text: string; value: three.Camera; fov?: number }> =
      [];

    this.scene.traverse((object) => {
      if (object instanceof three.Camera) {
        cameras.push({
          text: object.name || object.uuid,
          value: object,
          fov: object instanceof three.PerspectiveCamera
            ? object.fov
            : undefined,
        });
      }
    });

    const list = camera.addBlade({
      view: "list",
      label: "Active Camera",
      options: cameras,
      value: this.camera,
    }) as ListBladeApi<three.Camera>;

    list.on("change", (v) => {
      this.camera = v.value;
    });
  }

  buildDebug(): void {
    const debug = this.pane.addFolder({
      title: "Debug",
      expanded: false,
    });

    debug.addBinding(this.debugGrid, "enabled", {
      label: "Show Grid",
    });

    debug.addBinding(this.debugLightHelpers, "enabled", {
      label: "Show Light Helpers",
    });

    debug.addBinding(this.debugCamera, "enabled", {
      label: "Show Camera Helpers",
    });
  }

  render(delta: number): void {
    this.#onStartRender();
    this.pane.refresh();

    this.editorCamera.update(delta);
    this.debugAxis.onUpdate(this.camera);

    if (this.postprocessing) {
      this.postprocessing.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    this.#onEndRender();
  }

  destroy(): void {
    this.pane.dispose();
  }
}
