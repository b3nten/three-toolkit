import * as three from "three";
import "./styles.css";
import { Game } from "../../src/game.ts";
import { Scene } from "../../src/scene.ts";
import { SceneComponent } from "../../src/component.ts";

const game = new Game()

class CameraActor extends SceneComponent {

}

class MainScene extends Scene {

    renderer = new three.WebGLRenderer;

    render(){

    }
}
