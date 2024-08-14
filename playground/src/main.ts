import "./styles.css";
import * as Engine from "../../src/mod.ts"
import * as Three from "three";
import {
    BloomEffect,
    ChromaticAberrationEffect,
    EffectPass,
    LensDistortionEffect,
    RenderPass,
    ToneMappingEffect
} from "postprocessing";

const game = new Engine.Game({ target: document.getElementById("game") as HTMLCanvasElement })

const assets = new Engine.AssetLoader({
    env: new Engine.EnvironmentAsset(
        "https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/potsdamer_platz_1k.hdr")
})

class TestScene extends Engine.HighResScene {

    override createEffectPipeline(scene: Three.Scene, camera: Three.PerspectiveCamera) {
        return [
            new RenderPass(scene, camera),
            new EffectPass(camera, new BloomEffect),
            new EffectPass(camera, new ChromaticAberrationEffect),
            new EffectPass(camera, new LensDistortionEffect),
            new EffectPass(camera, new ToneMappingEffect({ mode: Three.ACESFilmicToneMapping }))
        ]
    }

    override async setup(){
        await super.setup()

        await assets.load()

        this.environment.texture = assets.data.env;
        this.environment.backgroundBlur = 1;

        this.root.addChild(
            new Engine.PrimitiveCubeObject().addChild(new Engine.FloatBehavior)
        )

        this.camera.addChild(new Engine.CameraOrbitBehavior)
    }
}

const target = document.getElementById("game") as HTMLCanvasElement;

if(!target) {
    throw new Error("No target element found")
}

console.log("Loading scene")

await game.loadScene(new TestScene)

console.log("Playing scene")

game.play()
