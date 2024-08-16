function assert(value, message) {
  if (!value) {
    throw new Error(message);
  }
}
const isBrowser = ![typeof window, typeof document].includes("undefined");
const isServer = !isBrowser;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const ctx = isBrowser ? new AudioContext() : void 0;
export class SoundManager {
  context = ctx;
  instances = /* @__PURE__ */ new Set();
  cache = /* @__PURE__ */ new Map();
  debug = false;
  #gc;
  #muteOnBlur = false;
  get muteOnBlur() {
    return this.#muteOnBlur;
  }
  set muteOnBlur(value) {
    this.#muteOnBlur = value;
    if (isServer) return;
    if (value) {
      window.addEventListener("blur", this.MuteAll);
      window.addEventListener("focus", this.UnmuteAll);
    } else {
      window.removeEventListener("blur", this.MuteAll);
      window.removeEventListener("focus", this.UnmuteAll);
    }
  }
  Create(input, args) {
    const sound = new Sound({ manager: this, input, args });
    this.instances.add(new WeakRef(sound));
    return sound;
  }
  MuteAll() {
    if (isServer) return;
    this.instances.forEach((ref) => {
      const player = ref.deref();
      if (player) {
        player.mute();
      }
    });
  }
  UnmuteAll() {
    if (isServer) return;
    this.instances.forEach((ref) => {
      const player = ref.deref();
      if (player) {
        player.unmute();
      }
    });
  }
  PauseAll() {
    if (isServer) return;
    this.instances.forEach((ref) => {
      const player = ref.deref();
      if (player) {
        player.pause();
      }
    });
  }
  StopAll() {
    if (isServer) return;
    this.instances.forEach((ref) => {
      const player = ref.deref();
      if (player) {
        player.stop();
      }
    });
  }
  CreateAudioBuffer(input) {
    if (isServer) {
      return Promise.resolve(void 0);
    }
    assert(this.context, "AudioContext is not initialized");
    if (this.cache.has(input)) {
      return this.cache.get(input);
    }
    if (typeof input === "string") {
      const arrayBuffer = fetch(input).then((res) => res.arrayBuffer());
      const audioBuffer = arrayBuffer.then(
        (ab) => this.context.decodeAudioData(ab)
      );
      this.cache.set(input, audioBuffer);
    } else if (input instanceof ArrayBuffer) {
      this.cache.set(input, this.context.decodeAudioData(input));
    } else {
      throw new Error("Invalid input for AudioPlayer.CreateAudioBuffer");
    }
    return this.cache.get(input);
  }
  constructor() {
    if (isBrowser) {
      const unlock = () => {
        document.removeEventListener("click", unlock);
        const source = this.context.createBufferSource();
        source.buffer = this.context.createBuffer(1, 1, 22050);
        source.connect(this.context.destination);
        source.start();
        source.stop();
        source.disconnect();
      };
      document.addEventListener("click", unlock);
      this.#gc = setInterval(() => {
        requestIdleCallback(() => {
          for (const ref of this.instances) {
            if (!ref.deref()) {
              this.instances.delete(ref);
            }
          }
        });
      }, 1e4);
    }
  }
  destructor() {
    if (isServer) return;
    this.instances.forEach((ref) => {
      const player = ref.deref();
      if (player) {
        player.stop();
      }
    });
    clearInterval(this.#gc);
  }
}
export var SoundEvent = /* @__PURE__ */ ((SoundEvent2) => {
  SoundEvent2[SoundEvent2["Load"] = 0] = "Load";
  SoundEvent2[SoundEvent2["Error"] = 1] = "Error";
  SoundEvent2[SoundEvent2["Play"] = 2] = "Play";
  SoundEvent2[SoundEvent2["Pause"] = 3] = "Pause";
  SoundEvent2[SoundEvent2["Stop"] = 4] = "Stop";
  SoundEvent2[SoundEvent2["Mute"] = 5] = "Mute";
  SoundEvent2[SoundEvent2["Unmute"] = 6] = "Unmute";
  SoundEvent2[SoundEvent2["Seek"] = 7] = "Seek";
  return SoundEvent2;
})(SoundEvent || {});
;
export class Sound {
  src;
  buffer;
  audioBuffer;
  userNodes = [];
  #loop = false;
  get loop() {
    return this.#loop;
  }
  set loop(value) {
    if (isServer) return;
    assert(!!this.#source, "Cannot set loop before audio is loaded");
    this.#loop = value;
    this.#source.loop = value;
  }
  #volume = 1;
  get volume() {
    return this.#volume;
  }
  set volume(value) {
    if (isServer) return;
    assert(!!this.#gainNode, "Cannot set volume before audio is loaded");
    this.#volume = clamp(value, 0, 1);
    this.#gainNode.gain.value = this.#volume;
  }
  #position = 0;
  get position() {
    return this.#position;
  }
  set position(value) {
    this.seek(value);
  }
  get duration() {
    return this.#duration;
  }
  #duration = 0;
  #loading = true;
  get loading() {
    return this.#loading;
  }
  #error;
  get error() {
    return this.#error;
  }
  #ready = false;
  get ready() {
    return this.#ready;
  }
  #playing = false;
  get playing() {
    return this.#playing;
  }
  #paused = false;
  get paused() {
    return this.#paused;
  }
  #stopped = true;
  get stopped() {
    return this.#stopped;
  }
  #muted = false;
  get muted() {
    return this.#muted;
  }
  #source;
  #gainNode;
  #startedAt;
  #subscribers = /* @__PURE__ */ new Set();
  #manager;
  constructor(args) {
    this.#manager = args.manager;
    this.src = typeof args.input === "string" ? args.input : void 0;
    this.buffer = typeof args.input === "string" ? void 0 : args.input;
    this.loop = args.args.loop || false;
    this.userNodes = args.args.nodes || [];
    if (isBrowser) {
      args.manager.CreateAudioBuffer(args.input).then((audioBuffer) => {
        if (!audioBuffer) {
          throw new Error("Failed to create audio buffer");
        }
        this.audioBuffer = audioBuffer;
        this.#duration = audioBuffer.duration;
        this.#ready = true;
        this.#loading = false;
        this.#debug("Audio loaded", this.src || this.buffer);
        this.#emit(0 /* Load */);
      }).catch((error) => {
        this.#error = error;
        this.#ready = false;
        this.#loading = false;
        this.#debug("Audio error", this.src || this.buffer, error);
        this.#emit(1 /* Error */);
      });
    }
  }
  #debug(...args) {
    if (this.#manager.debug) {
      console.log(`[AudioPlayer]`, ...args);
    }
  }
  #onAudioEnd = () => {
    this.#debug("Audio ended", this.src || this.buffer);
    this.#paused = false;
    this.#stopped = true;
    this.#playing = false;
    this.position = 0;
    this.#emit(4 /* Stop */);
  };
  #destroySource(source) {
    this.#debug("Destroying source", source);
    source.disconnect();
    source.stop();
    source.removeEventListener("ended", this.#onAudioEnd);
  }
  #emit(event) {
    this.#debug("Emitting event", event);
    this.#subscribers.forEach((callback) => callback(event));
  }
  fire() {
    if (isServer) return;
    if (!this.ready || !this.audioBuffer) {
      return;
    }
    assert(!!this.#manager.context, "AudioContext is not initialized");
    assert(!!this.#gainNode, "Audio buffer is not initialized");
    const src = this.#manager.context.createBufferSource();
    src.buffer = this.audioBuffer;
    src.connect(this.#gainNode).connect(this.#manager.context.destination);
    src.start(0);
  }
  play() {
    if (isServer) return;
    if (this.loading || !this.audioBuffer || this.playing) {
      return;
    }
    assert(!!this.#manager.context, "AudioContext is not initialized");
    assert(!!this.#gainNode, "Audio buffer is not initialized");
    this.#debug("Playing audio", this.src || this.buffer);
    this.#source = this.#manager.context.createBufferSource();
    this.#source.buffer = this.audioBuffer;
    this.#source.loop = this.loop;
    this.#source.connect(this.#gainNode);
    this.#debug("User nodes", this.userNodes);
    let nextNode = this.#gainNode;
    for (const node of this.userNodes) {
      nextNode.connect(node);
      nextNode = node;
    }
    nextNode.connect(this.#manager.context.destination);
    this.#debug("Connected to destination");
    this.#source.start(0, this.position);
    this.#startedAt = this.#manager.context.currentTime;
    this.#playing = true;
    this.#paused = false;
    this.#stopped = false;
    this.#source.addEventListener("ended", this.#onAudioEnd);
    this.#emit(2 /* Play */);
  }
  pause() {
    if (isServer) return;
    assert(this.#manager.context, "AudioContext is not initialized");
    assert(this.#source, "No source to pause");
    this.#debug("Pausing audio", this.src || this.buffer);
    this.#destroySource(this.#source);
    this.#playing = false;
    this.position += this.#manager.context.currentTime - (this.#startedAt ?? 0);
    this.#paused = true;
    this.#stopped = false;
    this.#emit(3 /* Pause */);
  }
  togglePlay() {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }
  stop() {
    if (isServer) return;
    assert(this.#source, "No source to stop");
    this.#debug("Stopping audio", this.src || this.buffer);
    this.#destroySource(this.#source);
    this.#playing = false;
    this.#paused = false;
    this.#stopped = true;
    this.position = 0;
    this.#emit(4 /* Stop */);
  }
  mute() {
    if (isServer) return;
    assert(!!this.#gainNode, "Cannot mute before audio is loaded");
    this.#debug("Muting audio", this.src || this.buffer);
    this.#gainNode.gain.value = 0;
    this.#muted = true;
    this.#emit(5 /* Mute */);
  }
  unmute() {
    if (isServer) return;
    assert(!!this.#gainNode, "Cannot unmute before audio is loaded");
    this.#debug("Unmuting audio", this.src || this.buffer);
    this.#gainNode.gain.value = this.volume;
    this.#muted = false;
    this.#emit(6 /* Unmute */);
  }
  toggleMute() {
    if (isServer) return;
    this.muted ? this.unmute() : this.mute();
  }
  seek(position) {
    if (isServer) return;
    this.#debug("Seeking audio", this.src || this.buffer, position);
    this.#position = clamp(position, 0, this.#duration);
    this.#emit(7 /* Seek */);
    if (this.playing) {
      assert(!!this.#source, "No source to seek");
      this.#destroySource(this.#source);
      this.#playing = false;
      this.play();
    }
  }
  clone() {
    if (!this.src && !this.buffer)
      throw new Error(
        "Cannot clone an audio instance without a source or buffer"
      );
    this.#debug("Cloning audio", this.src || this.buffer);
    return new Sound({
      manager: this.#manager,
      input: this.src || this.buffer,
      args: {
        loop: this.loop,
        nodes: this.userNodes
      }
    });
  }
  subscribe(callback) {
    this.#debug("Subscribing to audio", this.src || this.buffer);
    this.#subscribers.add(callback);
    return () => {
      this.#subscribers.delete(callback);
    };
  }
}
