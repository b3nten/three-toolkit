import * as Three from "three"
import { Scene } from "../scene";
import { PerspectiveCameraObject } from "../gameobjects/PerspectiveCamera";
import { EnvironmentObject } from "../gameobjects/EnvironmentObject";
import { ASSERT } from "../asserts";
import { EffectComposer, EffectPass, RenderPass } from "postprocessing"

export abstract class HighResScene extends Scene {

	camera = new PerspectiveCameraObject;

	environment = new EnvironmentObject({ background: true, backgroundBlur: 2 })

	postprocessor: EffectComposer | null = null;

	constructor(){
		super();
		this.camera.position.z = 5
	}

	override async setup(){
		await super.setup();

		ASSERT(this.game, "Game is not defined")

		this.root.addChild(this.camera)
		this.root.addChild(this.environment)

		this.postprocessor = new EffectComposer(this.game.renderer, {
			frameBufferType: Three.HalfFloatType,
		})

		this.postprocessor.setRenderer(this.game.renderer)

		this.game.renderer = new Three.WebGLRenderer({
			canvas: this.game.renderTarget,
			stencil: false,
			depth: false,
			alpha: false,
			antialias: false,
		})

		const passes = this.createEffectPipeline(this.root.object3d, this.camera.object3d, this.postprocessor)
		for(const pass of passes){
			this.postprocessor.addPass(pass)
		}
	}

	override render(){
		this.postprocessor!.render()
	}

	abstract createEffectPipeline(scene: Three.Scene, camera: Three.PerspectiveCamera, composer: EffectComposer): Array<RenderPass | EffectPass>;
}