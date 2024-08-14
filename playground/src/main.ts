import * as three from "three";
import { Game } from "../../src/game.ts";
import { Scene } from "../../src/scene.ts";
import { MeshObject } from "../../src/actors/MeshObject.ts";
import { PerspectiveCameraObject } from "../../src/actors/CameraActor.ts";
import { Behavior } from "../../src/behavior.ts";

import "./styles.css";

const game = new Game()

class Spin extends Behavior {
    onUpdate() {
        this.parent!.rotation.y += 0.01
        this.parent!.rotation.x += 0.01
    }
}

class TestCube extends MeshObject {
    constructor(){
        super(
            new three.BoxGeometry(1, 1, 1),
            new three.MeshBasicMaterial({ color: "pink" })
        )
        this.addChild(new Spin)
    }
}

class MainScene extends Scene {

    renderer = new three.WebGLRenderer({
        canvas: document.getElementById("game")!,
        alpha: true,
        antialias: true,
        precision: "highp"
    })

    camera = new PerspectiveCameraObject;

    override async setup(): Promise<void> {
        await super.setup();

        this.canvas = document.getElementById("game") as HTMLCanvasElement

        this.camera.position.z = 5

        this.renderer.setPixelRatio(2)
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)

        this.root.addChild(new TestCube)
        this.root.addChild(this.camera)
    }

    render(){
        this.renderer.render(this.root.object3d, this.camera.object3d)
    }
}

await game.loadScene(new MainScene)
game.play()
