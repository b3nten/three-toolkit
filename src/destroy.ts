import * as three from "three";
import { Asserts } from "./asserts";

/****************************************************************************************
 * Adopted from Lume, thank you <3
 * https://github.com/lume/lume/blob/a16fc59473e11ac53e7fa67e1d3cb7e060fe1d72/src/utils/three.ts
 *****************************************************************************************/

function disposeObject(obj: three.Object3D) {
  if (!obj) return;

  if (Asserts.IsRenderItem(obj)) {
    if (obj.geometry) obj.geometry.dispose();
    const materials: three.Material[] = ([] as three.Material[]).concat(
      obj.material,
    );
    for (const material of materials) {
      material.dispose();
    }
  }

  Promise.resolve().then(() => {
    obj.parent && obj.parent.remove(obj);
  });
}

export function destroy(obj: three.Object3D) {
  if(!Asserts.IsObject3D(obj)) return;
  obj.traverse(disposeObject);
}
