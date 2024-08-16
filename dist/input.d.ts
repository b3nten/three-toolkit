type KeyState = {
    pressed: boolean;
};
type InputCallback = (key: string, states: Record<string, KeyState>) => void;
export declare class InputQueue {
    queue: Array<{
        key: string;
        state: KeyState;
    }>;
    enabled: boolean;
    constructor();
    enable(): void;
    disable(): void;
    getCurrentState(): Record<string, KeyState>;
    getKey(key: string): KeyState;
    onInputDown(key: string | string[], callback: InputCallback): Function;
    onInputUp(key: string | string[], callback: InputCallback): Function;
    onInput(key: string | string[], callback: InputCallback): Function;
    replay(): void;
    private states;
    private inputDownCallbacks;
    private inputUpCallbacks;
    private keydown;
    private keyup;
}
export {};
