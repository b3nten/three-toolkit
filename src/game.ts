import { Scene } from "./scene";
import { ASSERT, Asserts } from "./asserts";
import { Clock } from "three";

export class Game {
	currentScene?: Scene;
	currentSceneLoaded: boolean = false;

	async loadScene(scene: Scene){
		ASSERT(scene, "Scene must be defined");
		ASSERT(Asserts.IsScene(scene), "Scene must be a Scene");
		if(this.currentScene){
			this.currentScene.destructor?.();
		}
		this.currentScene = scene;
		await scene.setup?.();
		this.currentSceneLoaded = true;
	}

	play(){
		ASSERT(this.currentSceneLoaded, "Scene must be loaded before playing");
		ASSERT(this.currentScene)
		this.currentScene.play();
		requestAnimationFrame(this.#gameloop.bind(this))
	}

	clock = new Clock()

	#gameloop(){
		requestAnimationFrame(this.#gameloop.bind(this))
		this.currentScene?.update(this.clock.getDelta(), this.clock.getElapsedTime())
	}
}