import * as Three from "three";
import { GameObject } from "../game_object";

export class SceneObject extends GameObject<Three.Scene> {
	constructor() {
		super();
		this.object3d = new Three.Scene();
		this.object3d.userData.owner = this;
	}
}
