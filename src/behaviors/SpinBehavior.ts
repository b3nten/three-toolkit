import { Behavior } from "../behavior";

export class SpinBehavior extends Behavior {

	speed: number;

	constructor(speed: number = 1) {
		super();
		this.speed = speed;
	}

	onUpdate(frametime: number, elapsedtime: number) {
		super.onUpdate(frametime, elapsedtime);
		if(!this.parent) return;
		this.parent.rotation.x += 0.5 * this.speed * frametime;
		this.parent.rotation.y += 0.5 * this.speed * frametime;
		this.parent.rotation.z += 0.5 * this.speed * frametime;
	}
}