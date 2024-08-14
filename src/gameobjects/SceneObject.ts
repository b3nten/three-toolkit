import { GameObject } from "../gameobject";
import * as three from 'three';

export class SceneObject extends GameObject {

	override object3d: three.Scene;

	constructor() {
		super();
		this.object3d = new three.Scene();
		this.object3d.userData.owner = this;
	}
}