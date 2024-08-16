import { Behavior } from "../behavior";
type FloatArgs = {
    offset?: number;
    enabled?: boolean;
    speed?: number;
    rotationIntensity?: number;
    floatIntensity?: number;
    floatingRange?: [number, number];
};
export declare class FloatBehavior extends Behavior {
    #private;
    enabled: boolean;
    speed: number;
    rotationIntensity: number;
    floatIntensity: number;
    floatingRange: [number, number];
    constructor(args?: FloatArgs);
    onUpdate(frametime: number, elapsedtime: number): void;
}
export {};
