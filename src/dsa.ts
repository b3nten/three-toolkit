/****************************************************************************************
 * SparseSet
 *****************************************************************************************/

export class SparseSet<T> {
  sparseArray = new Map<number, number>();
  packedArray: Array<number> = [];
  components: Array<T> = [];

  add(entity: number, component: T) {
    const packedIndex = this.components.length;
    this.sparseArray.set(entity, packedIndex);
    this.packedArray.push(entity);
    this.components.push(component);
  }

  delete(entity: number) {
    const packedIndex = this.sparseArray.get(entity);
    if (packedIndex === undefined || !this.sparseArray.has(entity)) {
      return;
    }
    const lastEntity = this.packedArray.pop();
    const lastComponent = this.components.pop();
    if (lastEntity !== undefined) {
      this.packedArray[packedIndex] = lastEntity;
      this.sparseArray.set(lastEntity, packedIndex);
      this.components[packedIndex] = lastComponent as T;
    }
    this.sparseArray.delete(entity);
  }

  get(entity: number): T | undefined {
    const packedIndex = this.sparseArray.get(entity);
    return packedIndex !== undefined ? this.components[packedIndex] : undefined;
  }

  has(entity: number): boolean {
    return this.sparseArray.has(entity);
  }

  *[Symbol.iterator](): IterableIterator<[number, T]> {
    for (let i = 0; i < this.packedArray.length; i++) {
      yield [this.packedArray[i], this.components[i]];
    }
  }

  clear() {
    this.sparseArray.clear();
    this.packedArray = [];
    this.components = [];
  }

  size() {
    return this.packedArray.length;
  }
}
