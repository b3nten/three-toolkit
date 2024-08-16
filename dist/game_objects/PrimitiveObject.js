import * as Three from "three";
import { GameObject } from "../game_object.js";
const PRIMITIVE_COLOR = "#c4c4c4";
export class PrimitiveCubeObject extends GameObject {
  #material;
  get material() {
    return this.#material;
  }
  set material(value) {
    this.#material = value;
    this.object3d.material = value;
  }
  #color = PRIMITIVE_COLOR;
  get color() {
    return this.#color;
  }
  set color(value) {
    this.#color = value;
    this.#material.color = new Three.Color(value);
  }
  constructor(args = {}) {
    super();
    if (args.color) {
      this.#color = args.color;
    }
    if (args.material) {
      this.#material = args.material;
    } else {
      this.#material = new Three.MeshStandardMaterial({ color: this.#color });
    }
    this.object3d = new Three.Mesh(
      new Three.BoxGeometry(1, 1, 1),
      this.#material
    );
    if (args.position) {
      this.position.copy(args.position);
    }
    if (args.rotation) {
      this.rotation.copy(args.rotation);
    }
    if (args.scale) {
      this.scale.copy(args.scale);
    }
    this.object3d.userData.owner = this;
  }
}
