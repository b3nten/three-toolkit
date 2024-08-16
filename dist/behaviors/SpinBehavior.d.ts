import { Behavior } from "../behavior";
export declare class SpinBehavior extends Behavior {
    x: number;
    y: number;
    z: number;
    constructor(args?: {
        x?: number;
        y?: number;
        z?: number;
    });
    onUpdate(frametime: number, elapsedtime: number): void;
}
