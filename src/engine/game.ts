import { Scene } from "./scene";
import { ASSERT, Asserts } from "../asserts";

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
		await scene.load?.();
		this.currentSceneLoaded = true;
	}

	play(){
		ASSERT(this.currentSceneLoaded, "Scene must be loaded before playing");
		this.currentScene?.play();
	}
}