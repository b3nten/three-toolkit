import { GameObject } from "../game_object.js";
import * as Three from "three";
export class MeshObject extends GameObject {
  object3d = new Three.Mesh();
  #geometry;
  get geometry() {
    return this.#geometry;
  }
  set geometry(value) {
    this.#geometry = value;
    this.#geometry.userData.owner = this;
    this.object3d.geometry = value;
  }
  #material;
  get material() {
    return this.#material;
  }
  set material(value) {
    this.#material = value;
    this.object3d.material = value;
  }
  constructor(geometry, material) {
    super();
    this.#geometry = geometry;
    this.#geometry.userData.owner = this;
    this.#material = material;
    this.object3d.geometry = geometry;
    this.object3d.material = material;
  }
}
