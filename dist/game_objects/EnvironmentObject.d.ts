import * as Three from "three";
import { Behavior } from "../mod";
type EnvironmentArgs = {
    texture?: Three.Texture | Three.CubeTexture;
    envScene?: Three.Scene;
    rotation?: Three.Euler;
    environmentIntensity?: number;
    background?: boolean;
    backgroundIntensity?: number;
    backgroundBlur?: number;
};
export declare class EnvironmentObject extends Behavior {
    #private;
    get texture(): Three.Texture | Three.CubeTexture | null;
    set texture(v: Three.Texture | Three.CubeTexture | null);
    get envScene(): Three.Scene | null;
    set envScene(v: Three.Scene | null);
    get rotation(): Three.Euler;
    set rotation(v: Three.Euler);
    get environmentIntensity(): number;
    set environmentIntensity(v: number);
    get background(): boolean;
    set background(v: boolean);
    get backgroundIntensity(): number;
    set backgroundIntensity(v: number);
    get backgroundBlur(): number;
    set backgroundBlur(v: number);
    constructor(args?: EnvironmentArgs);
    onCreate(): void;
}
export {};
