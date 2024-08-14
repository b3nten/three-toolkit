import { Behavior } from "../behavior";
import * as three from "three";
import { PerspectiveCameraObject } from "../gameobjects/PerspectiveCamera";
import { OrbitControls } from "three-stdlib";

export class CameraOrbitBehavior extends Behavior {

	controls: OrbitControls | null = null;

	onCreate() {
		super.onCreate();
		if(!(this.parent instanceof PerspectiveCameraObject)) return;
		this.controls = new OrbitControls(this.parent.object3d, this.scene?.canvas!);
	}

	onUpdate(frametime: number, elapsedtime: number) {
		super.onUpdate(frametime, elapsedtime);
		this.controls!.update();
	}
}