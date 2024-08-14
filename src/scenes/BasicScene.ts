import * as three from "three"
import { Scene } from "../scene";
import { PerspectiveCameraObject } from "../gameobjects/PerspectiveCamera";
import { EnvironmentObject } from "../gameobjects/EnvironmentObject";

export class BasicScene extends Scene {

	camera = new PerspectiveCameraObject;
	environment = new EnvironmentObject({ background: true, backgroundBlur: 2 })

	declare renderer: three.WebGLRenderer;
	declare canvas: HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement){
		super();

		this.canvas = canvas;

		this.renderer = new three.WebGLRenderer({
			canvas: this.canvas,
			alpha: true,
			antialias: true,
			powerPreference: "high-performance",
		})

		this.camera.position.z = 5
	}

	override async setup(){
		await super.setup();

		this.renderer.setPixelRatio(2)
		this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)

		this.renderer.toneMapping = three.ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 1;

		this.root.addChild(this.camera)
		this.root.addChild(this.environment)
	}

	override render(){
		this.renderer.render(this.root.object3d, this.camera.object3d)
	}

}