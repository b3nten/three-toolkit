declare enum EventQueueMode {
    Immediate = 0,
    Queued = 1
}
interface Event<T = unknown> {
    type: string | symbol;
    data: T;
}
interface QueuedEvent<T = unknown> extends Event<T> {
    timestamp: number;
}
type Callback<T = unknown> = (data: T, queue: EventQueue) => void;
type Unlisten = () => void;
export declare class EventQueue {
    mode: EventQueueMode;
    readonly queue: Array<QueuedEvent>;
    emit<T extends Event>(type: T["type"], data: T["data"]): void;
    emitSync<T extends Event>(type: T["type"], data: T["data"]): void;
    subscribe<T extends Event>(type: T["type"], handler: Callback<T["data"]>): Unlisten;
    once<T extends Event>(type: T["type"], handler: Callback<T["data"]>): Unlisten;
    flush(): void;
    [Symbol.iterator](): Generator<Event>;
    private subscribers;
}
export {};
