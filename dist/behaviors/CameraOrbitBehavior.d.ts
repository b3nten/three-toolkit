import { Behavior } from "../behavior";
import { OrbitControls } from "three-stdlib";
export declare class CameraOrbitBehavior extends Behavior {
    controls: OrbitControls | null;
    onCreate(): void;
    onUpdate(frametime: number, elapsedtime: number): void;
}
