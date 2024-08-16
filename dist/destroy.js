import { isObject3D, isRenderItem } from "./assert.js";
function disposeObject(obj) {
  if (!obj) return;
  if (isRenderItem(obj)) {
    if (obj.geometry) obj.geometry.dispose();
    const materials = [].concat(
      obj.material
    );
    for (const material of materials) {
      material.dispose();
    }
  }
  Promise.resolve().then(() => {
    obj.parent && obj.parent.remove(obj);
  });
}
export function destroy(obj) {
  if (!isObject3D(obj)) return;
  obj.traverse(disposeObject);
}
