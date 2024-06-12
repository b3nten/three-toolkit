import * as three from "three";
import { Scene } from "@build/three-toolkit/scene";
import "./styles.css";
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  ToneMappingEffect,
  ToneMappingMode,
} from "postprocessing";

const target = document.body.getElementsByTagName(
  "video-game",
)[0]! as HTMLElement;

const renderer = new three.WebGLRenderer({
  antialias: false,
  alpha: true,
  powerPreference: "high-performance",
});

const composer = new EffectComposer(renderer, {
  frameBufferType: three.HalfFloatType,
});

const scene = new Scene({ postprocessing: composer, renderer, target });

scene.camera.position.z = 5;

const cube = new three.Mesh(
  new three.BoxGeometry(),
  new three.MeshStandardMaterial({ color: 0xFFFFFF }),
);

scene.root.add(cube);

scene.root.add(new three.DirectionalLight(0xFFFFFF, 1));

composer.addPass(new RenderPass(scene.root, scene.camera));
composer.addPass(new EffectPass(scene.camera, new BloomEffect()));
composer.addPass(new EffectPass(scene.camera, new SMAAEffect()));
composer.addPass(
  new EffectPass(
    scene.camera,
    new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC }),
  ),
);

scene.enableEditor();

scene.play();
