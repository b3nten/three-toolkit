import * as Three from "three"
import { Scene } from "./scene";
import { Game } from "./game";
import { ActiveCamera } from "./mod";


export abstract class RenderPipeline {

	abstract getRenderer(): Three.WebGLRenderer;

	abstract render(frametime: number, elapsed: number): void;	

	onLoadScene?(game: Game, scene: Scene): void;

	onUnloadScene?(game: Game, scene: Scene): void;

	onResize?(bounds: DOMRect): void;

}

