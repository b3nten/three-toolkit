import { GameObject } from "../game_object.js";
import * as Three from "three";
export class SceneObject extends GameObject {
  constructor() {
    super();
    this.object3d = new Three.Scene();
    this.object3d.userData.owner = this;
  }
}
