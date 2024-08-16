import { GameObject } from "./game_object";
import { Scene } from "./scene";
export declare class Behavior {
    get isBehavior(): boolean;
    id?: string | symbol;
    tags: Set<string | symbol>;
    parent: GameObject | null;
    scene: Scene | null;
    initialized: boolean;
    spawned: boolean;
    destroyed: boolean;
    create(): void;
    spawn(): void;
    update(frametime: number, elapsed: number): void;
    despawn(): void;
    destroy(): void;
    resize(bounds: DOMRect): void;
    onCreate(): void;
    onSpawn(): void;
    onUpdate(frametime: number, elapsedtime: number): void;
    onDespawn(): void;
    onResize(bounds: DOMRect): void;
    destructor(): void;
}
