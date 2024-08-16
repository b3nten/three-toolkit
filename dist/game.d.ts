import { Scene } from "./scene";
import * as Three from "three";
import { SoundManager } from "./audio";
import { InputQueue } from "./input";
import { RenderPipeline } from "./render_pipeline";
export declare class Game {
    currentScene: Scene | null;
    currentSceneLoaded: boolean;
    sound: SoundManager;
    input: InputQueue;
    clock: Three.Clock;
    pointer: Three.Vector2;
    renderPipeline: RenderPipeline;
    constructor(args: {
        renderPipeline: RenderPipeline;
    });
    loadScene(scene: Scene): Promise<void>;
    play(): void;
    private gameloop;
    private resize;
    private onPointerMove;
}
