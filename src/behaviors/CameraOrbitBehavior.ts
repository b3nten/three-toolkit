import { Behavior } from "../behavior";
import { PerspectiveCameraObject } from "../gameobjects/PerspectiveCamera";
import { OrbitControls } from "three-stdlib";
import { ASSERT } from "../asserts";

export class CameraOrbitBehavior extends Behavior {

	controls: OrbitControls | null = null;

	onCreate() {
		super.onCreate();

		if(!(this.parent instanceof PerspectiveCameraObject)) return;

		const renderer = this.scene!.game!.renderPipeline.getRenderer()

		ASSERT(renderer, "Renderer must be defined");

		this.controls = new OrbitControls(this.parent.object3d, renderer.domElement);
	}

	onUpdate(frametime: number, elapsedtime: number) {
		super.onUpdate(frametime, elapsedtime);

		this.controls!.update();
	}
}