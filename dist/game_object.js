import * as Three from "three";
import { destroy } from "./destroy.js";
import { isBehavior, isGameObject } from "./assert.js";
export class GameObject {
  get isGameObject() {
    return true;
  }
  id;
  tags = /* @__PURE__ */ new Set();
  object3d = new Three.Object3D();
  scene = null;
  parent = null;
  get position() {
    return this.object3d.position;
  }
  get rotation() {
    return this.object3d.rotation;
  }
  get scale() {
    return this.object3d.scale;
  }
  get quaternion() {
    return this.object3d.quaternion;
  }
  get matrix() {
    return this.object3d.matrix;
  }
  get visible() {
    return this.object3d.visible;
  }
  set visible(value) {
    this.object3d.visible = value;
  }
  children = /* @__PURE__ */ new Set();
  initialized = false;
  spawned = false;
  destroyed = false;
  constructor() {
    this.object3d.userData.owner = this;
  }
  addChild(child) {
    if (this.destroyed) return this;
    if (isGameObject(child.parent)) {
      child.parent.removeChild(child);
    }
    this.children.add(child);
    child.parent = this;
    child.scene = this.scene;
    if (isGameObject(child)) {
      this.object3d.add(child.object3d);
      if (child.id) {
        this.scene?.gameObjectsById.set(child.id, child);
      }
      if (child.tags) {
        for (const tag of child.tags) {
          if (!this.scene?.gameObjectsByTag.has(tag)) {
            this.scene?.gameObjectsByTag.set(tag, /* @__PURE__ */ new Set());
          }
          this.scene?.gameObjectsByTag.get(tag)?.add(child);
        }
      }
    }
    if (isBehavior(child)) {
      if (child.id) {
        this.scene?.behaviorsById.set(child.id, child);
      }
      if (child.tags) {
        for (const tag of child.tags) {
          if (!this.scene?.behaviorsByTag.has(tag)) {
            this.scene?.behaviorsByTag.set(tag, /* @__PURE__ */ new Set());
          }
          this.scene?.behaviorsByTag.get(tag)?.add(child);
        }
      }
    }
    if (this.initialized) {
      child.create();
    }
    if (this.spawned) {
      child.spawn();
    }
    return this;
  }
  removeChild(child) {
    if (this.destroyed) return child;
    child.parent = null;
    this.children.delete(child);
    if (isGameObject(child)) {
      this.object3d.remove(child.object3d);
      if (child.id) {
        this.scene?.gameObjectsById.delete(child.id);
      }
      if (child.tags) {
        for (const tag of child.tags) {
          this.scene?.gameObjectsByTag.get(tag)?.delete(child);
        }
      }
    }
    return child;
  }
  addTag(tag) {
    this.tags.add(tag);
    if (!this.scene?.gameObjectsByTag.has(tag)) {
      this.scene?.gameObjectsByTag.set(tag, /* @__PURE__ */ new Set());
    }
    this.scene?.gameObjectsByTag.get(tag).add(this);
    return this;
  }
  removeTag(tag) {
    this.tags.delete(tag);
    this.scene?.gameObjectsByTag.get(tag)?.delete(this);
    return this;
  }
  create() {
    if (this.initialized || this.destroyed) return;
    this.object3d.userData.owner = this;
    this.onCreate();
    this.initialized = true;
    for (const child of this.children) {
      child.scene = this.scene;
      child.create();
    }
  }
  spawn() {
    if (this.spawned || this.destroyed) return;
    this.onSpawn();
    this.spawned = true;
    this.parent?.object3d.add(this.object3d);
    for (const child of this.children) {
      child.spawn();
    }
  }
  update(frametime, elapsedtime) {
    if (!this.spawned || this.destroyed) return;
    this.onUpdate(frametime, elapsedtime);
    for (const child of this.children) {
      child.update(frametime, elapsedtime);
    }
  }
  despawn() {
    if (!this.spawned || this.destroyed) return;
    this.onDespawn();
    this.parent?.object3d.remove(this.object3d);
    for (const child of this.children) {
      child.despawn();
    }
  }
  destroy() {
    if (this.destroyed) return;
    this.destructor();
    this.destroyed = true;
    destroy(this.object3d);
    for (const child of this.children) {
      child.despawn();
    }
  }
  resize(bounds) {
    if (!this.initialized || this.destroyed) return;
    this.onResize(bounds);
    for (const child of this.children) {
      child.resize(bounds);
    }
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
  getChildrenByTag(tag) {
    const children = [];
    for (const child of this.children) {
      if (child.tags.has(tag)) {
        children.push(child);
      }
    }
    return children;
  }
  getChildById(id) {
    for (const child of this.children) {
      if (child.id === id) {
        return child;
      }
    }
    return null;
  }
  getBehaviorsByType(type) {
    for (const child of this.children) {
      if (isBehavior(child) && child instanceof type) {
        return child;
      }
    }
    return null;
  }
  getBehaviorsByTag(tag) {
    const behaviors = [];
    for (const child of this.children) {
      if (isBehavior(child) && child.tags.has(tag)) {
        behaviors.push(child);
      }
    }
    return behaviors;
  }
  getBehaviorById(id) {
    for (const child of this.children) {
      if (isBehavior(child) && child.id === id) {
        return child;
      }
    }
    return null;
  }
  getGameObjectByType(type) {
    for (const child of this.children) {
      if (isGameObject(child) && child instanceof type) {
        return child;
      }
    }
    return null;
  }
  getGameObjectById(id) {
    for (const child of this.children) {
      if (isGameObject(child) && child.id === id) {
        return child;
      }
    }
    return null;
  }
  getGameObjectsByTag(tag) {
    const gameObjects = [];
    for (const child of this.children) {
      if (isGameObject(child) && child.tags.has(tag)) {
        gameObjects.push(child);
      }
    }
    return gameObjects;
  }
  *childs() {
    for (const child of this.children) {
      yield child;
    }
  }
}
