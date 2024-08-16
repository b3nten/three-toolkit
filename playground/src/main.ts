import "./styles.css";
import * as Engine from "../../src/mod.ts"
import * as Three from "three";
import { ChromaticAberrationEffect, EffectPass, RenderPass, ToneMappingEffect, ToneMappingMode, FXAAEffect } from "postprocessing";

const basicRP = new Engine.BasicRenderPipeline({ 
    canvas: document.getElementById("game") as HTMLCanvasElement,
    toneMapping: Three.ACESFilmicToneMapping,   
    toneMappingExposure: 1,
    devicePixelRatio: window.devicePixelRatio,
})

const hdRP = new Engine.HighDefinitionRenderPipeline({
    canvas: document.getElementById("game") as HTMLCanvasElement,
    effects: () => [
        new RenderPass(),
        new EffectPass(undefined, new FXAAEffect),
        new EffectPass(undefined, new ChromaticAberrationEffect),
        new EffectPass(undefined, new ToneMappingEffect({mode: ToneMappingMode.ACES_FILMIC})),
    ],
    devicePixelRatio: window.devicePixelRatio
})

const game = new Engine.Game({ renderPipeline: hdRP })

class TestScene extends Engine.Scene {
    environment = new Engine.EnvironmentObject({ background: true, backgroundBlur: 2 })

    camera = new Engine.PerspectiveCameraObject;

    override async setup(){
        await super.setup();

        this.camera
            .addChild(new Engine.CameraOrbitBehavior)
            .addTag(Engine.ActiveCamera)
            .position.z = 5;

        this.root.addChild(this.camera)

        this.root.addChild(this.environment)

        this.root.addChild(
            new Engine.PrimitiveCubeObject()
                .addChild(new Engine.FloatBehavior)
        )
    }
}

async function main(){
    console.log("Loading scene")
    await game.loadScene(new TestScene)
    console.log("Playing scene")
    game.play()
}

main()
