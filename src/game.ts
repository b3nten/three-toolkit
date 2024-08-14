import { Scene } from "./scene";
import { ASSERT, Asserts } from "./asserts";
import * as Three from "three";

export class Game {
	currentScene?: Scene;
	currentSceneLoaded: boolean = false;

	renderer: Three.WebGLRenderer;
	renderTarget: HTMLCanvasElement;

	constructor(args: { target?: HTMLCanvasElement } = {}){
		this.renderer = new Three.WebGLRenderer({
			canvas: args.target,
		});
		this.renderTarget = this.renderer.domElement;
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.#resize();
		window.addEventListener("resize", this.#resize.bind(this))
	}

	#resize(){
		const bounds = this.renderTarget.getBoundingClientRect();
		this.renderer.setSize(bounds.width, bounds.height, false)
		this.currentScene?.root.resize(bounds)
	}

	async loadScene(scene: Scene){
		ASSERT(scene, "Scene must be defined");
		ASSERT(Asserts.IsScene(scene), "Scene must be a Scene");
		if(this.currentScene){
			this.currentScene.destructor?.();
		}
		scene.game = this;
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

	clock = new Three.Clock()

	#gameloop(){
		requestAnimationFrame(this.#gameloop.bind(this))
		this.currentScene?.update(this.clock.getDelta(), this.clock.getElapsedTime())
	}
}