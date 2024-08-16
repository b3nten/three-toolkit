import * as Three from "three";
import { Scene } from "../scene";
import { Game } from "../game";
import { EffectComposer, EffectPass, RenderPass } from "postprocessing";
import { RenderPipeline } from "../render_pipeline";
type HighDefinitionRenderPipelineArgs = {
    canvas?: HTMLCanvasElement;
    effects(scene: Scene, composer: EffectComposer): Array<RenderPass | EffectPass>;
    devicePixelRatio?: number;
    multisampling?: number;
};
export declare class HighDefinitionRenderPipeline extends RenderPipeline {
    constructor(args: HighDefinitionRenderPipelineArgs);
    getRenderer(): Three.WebGLRenderer;
    onLoadScene(game: Game, scene: Scene): void;
    onResize(bounds: DOMRect): void;
    render(): void;
    effectComposer: EffectComposer;
    private renderer;
    private scene;
    private effects;
}
export {};
