import { GameObject } from "../game_object";
import * as Three from "three";
export declare class PerspectiveCameraObject extends GameObject<Three.PerspectiveCamera> {
    #private;
    object3d: Three.PerspectiveCamera;
    get fov(): number;
    set fov(value: number);
    get near(): number;
    set near(value: number);
    get far(): number;
    set far(value: number);
    constructor(settings?: {
        fov?: number;
        near?: number;
        far?: number;
    });
    onCreate(): void;
    onResize(b: DOMRect): void;
}
