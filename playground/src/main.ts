import "./styles.css";
import { Game } from "../../src/mod.ts"
import { CameraOrbitBehavior } from "../../src/behaviors/CameraOrbitBehavior.ts";
import { AssetLoader, EnvironmentAsset } from "../../src/assets.ts";
import { BasicScene } from "../../src/scenes/BasicScene.ts";
import { PrimitiveCubeObject } from "../../src/gameobjects/PrimitiveObject.ts";
import { SpinBehavior } from "../../src/behaviors/SpinBehavior.ts";

const game = new Game()

const assets = new AssetLoader({
    env: new EnvironmentAsset(
        "https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/potsdamer_platz_1k.hdr")
})

class TestScene extends BasicScene {
    override async setup(){
        await super.setup()

        await assets.load()

        this.environment.texture = assets.data.env;
        this.environment.backgroundBlur = 1;

        const cube = new PrimitiveCubeObject;
        cube.addChild(new SpinBehavior);

        this.root.addChild(cube)

        this.camera.addChild(new CameraOrbitBehavior)
    }
}

const target = document.getElementById("game") as HTMLCanvasElement;

if(!target) {
    throw new Error("No target element found")
}

console.log("Loading scene")

await game.loadScene(new TestScene(target))

console.log("Playing scene")

game.play()
