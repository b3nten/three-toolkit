/***********************************************************
    Utilities
************************************************************/
export declare class SoundManager {
    #private;
    context?: AudioContext;
    instances: Set<WeakRef<Sound>>;
    cache: Map<string | ArrayBuffer, Promise<AudioBuffer>>;
    debug: boolean;
    get muteOnBlur(): boolean;
    set muteOnBlur(value: boolean);
    Create(input: string | ArrayBuffer, args: {
        loop?: boolean;
        nodes?: any[];
    }): Sound;
    MuteAll(): void;
    UnmuteAll(): void;
    PauseAll(): void;
    StopAll(): void;
    CreateAudioBuffer(input: string | ArrayBuffer): Promise<AudioBuffer | undefined>;
    constructor();
    destructor(): void;
}
export declare enum SoundEvent {
    Load = 0,
    Error = 1,
    Play = 2,
    Pause = 3,
    Stop = 4,
    Mute = 5,
    Unmute = 6,
    Seek = 7
}
export declare class Sound {
    #private;
    src?: string;
    buffer?: ArrayBuffer;
    audioBuffer?: AudioBuffer;
    userNodes: AudioNode[];
    get loop(): boolean;
    set loop(value: boolean);
    get volume(): number;
    set volume(value: number);
    get position(): number;
    set position(value: number);
    get duration(): number;
    get loading(): boolean | undefined;
    get error(): Error | undefined;
    get ready(): boolean;
    get playing(): boolean;
    get paused(): boolean;
    get stopped(): boolean;
    get muted(): boolean;
    constructor(args: {
        manager: SoundManager;
        input: string | ArrayBuffer;
        args: {
            loop?: boolean;
            nodes?: any[];
            sprite?: [number, number];
        };
    });
    fire(): void;
    play(): void;
    pause(): void;
    togglePlay(): void;
    stop(): void;
    mute(): void;
    unmute(): void;
    toggleMute(): void;
    seek(position: number): void;
    clone(): Sound;
    subscribe(callback: (event: SoundEvent) => void): () => void;
}
