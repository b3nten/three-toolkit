import { Behavior } from "../behavior";
import { PerspectiveCameraObject } from "../gameobjects/PerspectiveCamera";
import { OrbitControls } from "three-stdlib";
import { ASSERT } from "../asserts";

export class CameraOrbitBehavior extends Behavior {

	controls: OrbitControls | null = null;

	onCreate() {
		super.onCreate();

		if(!(this.parent instanceof PerspectiveCameraObject)) return;

		ASSERT(this.scene?.game?.renderTarget, "Renderer must be defined");

		this.controls = new OrbitControls(this.parent.object3d, this.scene.game.renderTarget);
	}

	onUpdate(frametime: number, elapsedtime: number) {
		super.onUpdate(frametime, elapsedtime);

		this.controls!.update();
	}
}