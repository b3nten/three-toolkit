import * as three from "three"
import { Scene } from "../scene";
import { PerspectiveCameraObject } from "../gameobjects/PerspectiveCamera";
import { EnvironmentObject } from "../gameobjects/EnvironmentObject";
import { ASSERT } from "../asserts";

export class BasicScene extends Scene {

	camera = new PerspectiveCameraObject;

	environment = new EnvironmentObject({ background: true, backgroundBlur: 2 })

	constructor(){
		super();
		this.camera.position.z = 5
	}

	override async setup(){
		await super.setup();

		ASSERT(this.game, "Game is not defined")

		this.game.renderer.toneMapping = three.ACESFilmicToneMapping;
		this.game.renderer.toneMappingExposure = 1;

		this.root.addChild(this.camera)
		this.root.addChild(this.environment)
	}

	override render(){
		this.game!.renderer.render(this.root.object3d, this.camera.object3d)
	}
}