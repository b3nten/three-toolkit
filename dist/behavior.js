export class Behavior {
  get isBehavior() {
    return true;
  }
  id;
  tags = /* @__PURE__ */ new Set();
  parent = null;
  scene = null;
  initialized = false;
  spawned = false;
  destroyed = false;
  create() {
    if (this.initialized) return;
    this.onCreate();
    this.initialized = true;
  }
  spawn() {
    if (!this.initialized || this.spawned || this.destroyed) return;
    this.onSpawn();
    this.spawned = true;
  }
  update(frametime, elapsed) {
    if (!this.initialized || !this.spawned || this.destroyed) return;
    this.onUpdate(frametime, elapsed);
  }
  despawn() {
    if (!this.spawned || this.destroyed) return;
    this.onDespawn();
  }
  destroy() {
    if (this.destroyed) return;
    this.destructor();
  }
  resize(bounds) {
    if (!this.initialized || this.destroyed) return;
    this.onResize(bounds);
  }
  onCreate() {
  }
  onSpawn() {
  }
  onUpdate(frametime, elapsedtime) {
  }
  onDespawn() {
  }
  onResize(bounds) {
  }
  destructor() {
  }
}
