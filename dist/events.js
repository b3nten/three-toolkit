var EventQueueMode = /* @__PURE__ */ ((EventQueueMode2) => {
  EventQueueMode2[EventQueueMode2["Immediate"] = 0] = "Immediate";
  EventQueueMode2[EventQueueMode2["Queued"] = 1] = "Queued";
  return EventQueueMode2;
})(EventQueueMode || {});
export class EventQueue {
  mode = 0 /* Immediate */;
  queue = [];
  emit(type, data) {
    if (this.mode === 1 /* Queued */) {
      this.queue.push({ type, data, timestamp: Date.now() });
    } else {
      this.emitSync(type, data);
    }
  }
  emitSync(type, data) {
    this.subscribers.get(type)?.forEach((handler) => handler(data, this));
  }
  subscribe(type, handler) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, /* @__PURE__ */ new Set());
    }
    this.subscribers.get(type).add(handler);
    return () => void this.subscribers.get(type)?.delete(handler);
  }
  once(type, handler) {
    const unlisten = this.subscribe(type, (data, queue) => {
      unlisten();
      handler(data, queue);
    });
    return unlisten;
  }
  flush() {
    for (const event of this) {
      for (const sub of this.subscribers.get(event.type) ?? []) {
        sub(event.data, this);
      }
    }
  }
  *[Symbol.iterator]() {
    while (this.queue.length) {
      yield this.queue.shift();
    }
  }
  subscribers = /* @__PURE__ */ new Map();
}
