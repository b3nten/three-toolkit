import * as three from "three";
import { Scene } from "../../.build/scene";
import "./styles.css";
import {
  BloomEffect,
  EdgeDetectionMode,
  EffectComposer,
  EffectPass,
  PredicationMode,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
  ToneMappingEffect,
  ToneMappingMode,
} from "postprocessing";
import { DRACOLoader, GLTFLoader, RGBELoader } from "three-stdlib";

const target = document.body.getElementsByTagName(
  "video-game",
)[0];

if (!(target instanceof HTMLElement)) {
  throw new Error("No target element found");
}

const renderer = new three.WebGLRenderer({
  powerPreference: "high-performance",
  antialias: false,
  stencil: false,
  depth: false,
});

const postprocessing = new EffectComposer(renderer, {
  frameBufferType: three.HalfFloatType,
});

const scene = new Scene({ postprocessing, renderer, target });

new RGBELoader().loadAsync("/old_depot_2k.hdr").then((texture) => {
  texture.mapping = three.EquirectangularReflectionMapping;
  scene.root.environment = texture;
});

scene.camera.position.z = 5;

scene.root.add(new three.DirectionalLight(0xFFFFFF, 1));

scene.root.add(new three.AmbientLight(0xFFFFFF, 0.5));

const gltfLoader = new GLTFLoader();
const draco = new DRACOLoader().setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(draco);

gltfLoader.load(
  "/datsun-transformed.glb",
  (gltf) => {
    scene.root.add(gltf.scene);
  },
);

postprocessing.addPass(new RenderPass(scene.root, scene.camera));

postprocessing.addPass(
  new EffectPass(
    scene.camera,
    new BloomEffect({
      intensity: 1,
      luminanceThreshold: 1.2,
    }),
  ),
);

postprocessing.addPass(
  new EffectPass(
    scene.camera,
    new SMAAEffect({
      preset: SMAAPreset.ULTRA,
      edgeDetectionMode: EdgeDetectionMode.COLOR,
      predicationMode: PredicationMode.DEPTH,
    }),
  ),
);

postprocessing.addPass(
  new EffectPass(
    scene.camera,
    new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC }),
  ),
);

scene.attachInspector();

scene.play();
