import * as Three from "three";
import { Scene } from "../scene";
import { Game } from "../game";
import { RenderPipeline } from "../render_pipeline";
type BasicRenderPipelineArgs = Three.WebGLRendererParameters & {
    toneMapping?: Three.ToneMapping;
    toneMappingExposure?: number;
    devicePixelRatio?: number;
};
export declare class BasicRenderPipeline extends RenderPipeline {
    constructor(args: BasicRenderPipelineArgs);
    getRenderer(): Three.WebGLRenderer;
    onLoadScene(game: Game, scene: Scene): void;
    onResize(bounds: DOMRect): void;
    render(): void;
    private renderer;
    private scene;
}
export {};
