import { MeshObject } from "./MeshObject.js";
import * as Three from "three";
export class SkeletalMeshObject extends MeshObject {
  object3d = new Three.SkinnedMesh();
}
