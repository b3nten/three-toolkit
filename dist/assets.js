import * as Three from "three";
import { EXRLoader, RGBELoader, GLTFLoader } from "three-stdlib";
export var State = /* @__PURE__ */ ((State2) => {
  State2[State2["Idle"] = 0] = "Idle";
  State2[State2["Loading"] = 1] = "Loading";
  State2[State2["Complete"] = 2] = "Complete";
  State2[State2["Errored"] = 3] = "Errored";
  return State2;
})(State || {});
export var StatusUpdateEvent = /* @__PURE__ */ ((StatusUpdateEvent2) => {
  StatusUpdateEvent2[StatusUpdateEvent2["Loading"] = 0] = "Loading";
  StatusUpdateEvent2[StatusUpdateEvent2["Loaded"] = 1] = "Loaded";
  StatusUpdateEvent2[StatusUpdateEvent2["Error"] = 2] = "Error";
  StatusUpdateEvent2[StatusUpdateEvent2["Progress"] = 3] = "Progress";
  return StatusUpdateEvent2;
})(StatusUpdateEvent || {});
class ResolvablePromise {
  #resolve;
  #reject;
  #promise = new Promise((resolve, reject) => {
    this.#resolve = resolve;
    this.#reject = reject;
  });
  resolve(value) {
    this.#resolve(value);
  }
  reject(error) {
    this.#reject(error);
  }
  then(onfulfilled, onrejected) {
    return this.#promise.then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.#promise.catch(onrejected);
  }
  finally(onfinally) {
    return this.#promise.finally(onfinally);
  }
  [Symbol.toStringTag] = "ResolvablePromise";
}
export class Asset {
  #data;
  #progress = 0;
  #error;
  #loading = false;
  #promise = new ResolvablePromise();
  #subscribers = /* @__PURE__ */ new Set();
  get data() {
    if (this.#data === void 0 && !this.#loading) {
      this.load();
    }
    return this.#data;
  }
  get state() {
    if (this.#loading) {
      return 1 /* Loading */;
    }
    if (this.#error) {
      return 3 /* Errored */;
    }
    if (this.#data) {
      return 2 /* Complete */;
    }
    return 0 /* Idle */;
  }
  get progress() {
    return this.#progress;
  }
  get loading() {
    return this.#loading;
  }
  get error() {
    return this.#error;
  }
  get promise() {
    return this.#promise;
  }
  updateProgress(progress) {
    this.#progress = progress;
    this.#subscribers.forEach((callback) => callback(3 /* Progress */));
  }
  async fetch(url, options) {
    const response = await fetch(url, options);
    const reader = response.body?.getReader();
    if (!reader) {
      return response;
    }
    const contentLength = response.headers.get("Content-Length");
    const total = contentLength ? parseInt(contentLength, 10) : void 0;
    let received = 0;
    const updateProgress = options?.onProgress ?? this.updateProgress.bind(this);
    const stream = new ReadableStream({
      start(controller) {
        const pump = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              updateProgress(1);
              return;
            }
            received += value.byteLength;
            typeof total === "number" && updateProgress(received / total);
            controller.enqueue(value);
            pump();
          });
        };
        pump();
      }
    });
    return new Response(stream, {
      headers: response.headers,
      status: response.status
    });
  }
  async load() {
    if (this.#loading) {
      return this.#promise;
    }
    this.#loading = true;
    this.#subscribers.forEach((callback) => callback(0 /* Loading */));
    try {
      const result = this.loader();
      if (result instanceof Promise) {
        this.#data = await result;
        this.#promise.resolve(this.#data);
      } else {
        this.#data = result;
        this.#promise.resolve(result);
      }
    } catch (e) {
      this.#error = e instanceof Error ? e : new Error("Unknown error loading asset");
      this.#promise.reject(this.#error);
      this.#subscribers.forEach((callback) => callback(2 /* Error */));
    }
    this.#loading = false;
    this.#progress = 1;
    this.#subscribers.forEach((callback) => callback(1 /* Loaded */));
    return this.#data;
  }
  subscribe(callback) {
    this.#subscribers.add(callback);
    return () => void this.#subscribers.delete(callback);
  }
  then(onfulfilled, onrejected) {
    return this.#promise.then(onfulfilled, onrejected);
  }
}
export class AssetLoader {
  constructor(assets) {
    this.assets = assets;
  }
  #state = 0 /* Idle */;
  #progress = 0;
  #loading = false;
  #resolve;
  #reject;
  #promise = new Promise((resolve, reject) => {
    this.#resolve = resolve;
    this.#reject = reject;
  });
  #subscribers = /* @__PURE__ */ new Set();
  #result = {};
  subscribe(callback) {
    this.#subscribers.add(callback);
    return () => void this.#subscribers.delete(callback);
  }
  get progress() {
    return this.#progress;
  }
  get state() {
    return this.#state;
  }
  get loading() {
    return this.#loading;
  }
  get data() {
    return this.#result;
  }
  async load() {
    if (this.#loading) {
      return this.#promise;
    }
    this.#loading = true;
    this.#subscribers.forEach((callback) => callback(0 /* Loading */));
    const promises = [];
    for (const [name, asset] of Object.entries(this.assets)) {
      asset.subscribe((status) => {
        if (status === 1 /* Loaded */) {
          this.#result[name] = asset.data;
        }
        if (status === 2 /* Error */) {
          this.#reject(new Error(`Error loading asset ${name}`));
        }
        if (status === 3 /* Progress */) {
          this.#progress = Object.values(this.assets).reduce((acc, a) => acc + a.progress, 0) / Object.keys(this.assets).length;
          this.#subscribers.forEach((callback) => callback(3 /* Progress */));
        }
      });
      promises.push(asset.load());
    }
    try {
      await Promise.all(promises);
      this.#state = 2 /* Complete */;
      this.#loading = false;
      this.#progress = 1;
      this.#subscribers.forEach((callback) => callback(3 /* Progress */));
      this.#subscribers.forEach((callback) => callback(1 /* Loaded */));
      this.#resolve(this.#result);
    } catch (e) {
      this.#state = 3 /* Errored */;
      this.#loading = false;
      this.#reject(e instanceof Error ? e : new Error("Unknown error loading assets"));
      this.#subscribers.forEach((callback) => callback(2 /* Error */));
    }
    return this.#result;
  }
}
export class EnvironmentAsset extends Asset {
  constructor(path) {
    super();
    this.path = path;
  }
  static EXRLoader = new EXRLoader();
  static RGBELoader = new RGBELoader();
  static CubeTextureLoader = new Three.CubeTextureLoader();
  async loader() {
    const firstEntry = Array.isArray(this.path) ? this.path[0] : this.path;
    const extension = Array.isArray(this.path) ? "cube" : firstEntry.startsWith("data:application/exr") ? "exr" : firstEntry.startsWith("data:application/hdr") ? "hdr" : firstEntry.split(".").pop()?.split("?")?.shift()?.toLowerCase();
    switch (extension) {
      case "hdr":
      case "exr": {
        const loader = extension === "exr" ? EnvironmentAsset.EXRLoader : EnvironmentAsset.RGBELoader;
        const texture = await loader.loadAsync(firstEntry, (e) => this.updateProgress(e.loaded / e.total));
        texture.mapping = Three.EquirectangularReflectionMapping;
        return texture;
      }
      case "cube": {
        const loaderCube = EnvironmentAsset.CubeTextureLoader;
        const texture = await loaderCube.loadAsync(this.path, (e) => this.updateProgress(e.loaded / e.total));
        texture.mapping = Three.CubeReflectionMapping;
        return texture;
      }
      default:
        throw new Error(`Unsupported environment file extension ${extension}`);
    }
  }
}
export class TextureAsset extends Asset {
  constructor(path) {
    super();
    this.path = path;
  }
  async loader() {
    const loader = new Three.TextureLoader();
    const texture = await loader.loadAsync(this.path, (e) => this.updateProgress(e.loaded / e.total));
    return texture;
  }
}
export class GltfAsset extends Asset {
  constructor(path) {
    super();
    this.path = path;
  }
  async loader() {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(this.path, (e) => this.updateProgress(e.loaded / e.total));
    return gltf.scene;
  }
}
