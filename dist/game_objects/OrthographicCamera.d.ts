import { GameObject } from "../game_object";
import * as Three from "three";
export declare class OrthographicCameraObject extends GameObject<Three.OrthographicCamera> {
    #private;
    get left(): number;
    set left(value: number);
    get right(): number;
    set right(value: number);
    get top(): number;
    set top(value: number);
    get bottom(): number;
    set bottom(value: number);
    get near(): number;
    set near(value: number);
    get far(): number;
    set far(value: number);
    constructor(settings?: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
        near?: number;
        far?: number;
    });
    onCreate(): void;
    onResize(): void;
}
