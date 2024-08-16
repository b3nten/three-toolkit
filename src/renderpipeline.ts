import * as Three from "three"
import { Scene } from "./scene";
import { Game } from "./game";
import { ActiveCamera } from "./mod";
import { EffectComposer, EffectPass, RenderPass } from "postprocessing";


export abstract class RenderPipeline {

	abstract getRenderer(): Three.WebGLRenderer;

	abstract render(frametime: number, elapsed: number): void;	

	onLoadScene?(game: Game, scene: Scene): void;

	onUnloadScene?(game: Game, scene: Scene): void;

	onResize?(bounds: DOMRect): void;

}

type BasicRenderPipelineArgs = Three.WebGLRendererParameters & { 
	toneMapping?: Three.ToneMapping
	toneMappingExposure?: number
	devicePixelRatio?: number
}

export class BasicRenderPipeline extends RenderPipeline {

	constructor(args: BasicRenderPipelineArgs){ 
		super(); 

		this.renderer = new Three.WebGLRenderer(args)

		args.devicePixelRatio && this.renderer.setPixelRatio(args.devicePixelRatio);

		if(args.toneMapping){
			this.renderer.toneMapping = args.toneMapping;
		}
		
		if(args.toneMappingExposure){
			this.renderer.toneMappingExposure = args.toneMappingExposure;
		}
	}

	getRenderer(): Three.WebGLRenderer {
	    return this.renderer;
	}

	onLoadScene(game: Game, scene: Scene): void {
	    this.scene = scene;
	}

	onResize(bounds: DOMRect): void {
	    this.renderer.setSize(bounds.width, bounds.height, false)
	}

	render(){
		const camera = this.scene!.getActiveCamera()!;
		this.renderer.render(this.scene!.root.object3d, camera.object3d)
	}

	private renderer: Three.WebGLRenderer;

	private scene: Scene | null = null;
}

type HighDefinitionRenderPipelineArgs = {
	canvas?: HTMLCanvasElement
	effects(scene: Scene, composer: EffectComposer): Array<RenderPass | EffectPass>
	devicePixelRatio?: number,
	multisampling?: number,
}

export class HighDefinitionRenderPipeline extends RenderPipeline {

	constructor(args: HighDefinitionRenderPipelineArgs){ 
		super(); 

		this.renderer = new Three.WebGLRenderer({
			canvas: args.canvas,
			powerPreference: "high-performance",
			antialias: false,
			stencil: false,
			depth: false,
		})

		this.effectComposer = new EffectComposer(this.renderer, {
			frameBufferType: Three.HalfFloatType,
			multisampling: args.multisampling ?? 4,
		})

		this.effects = args.effects;

		args.devicePixelRatio && this.renderer.setPixelRatio(args.devicePixelRatio);
	}

	getRenderer(): Three.WebGLRenderer {
	    return this.renderer;
	}

	onLoadScene(game: Game, scene: Scene): void {
	    this.scene = scene;

	    for(const p of this.effects(scene, this.effectComposer)){
	    	this.effectComposer.addPass(p)
	    }
	}

	onResize(bounds: DOMRect): void {
	    this.renderer.setSize(bounds.width, bounds.height, false)
	}

	render(){
		const camera = this.scene!.getActiveCamera()!;
		const scene = this.scene!.root.object3d;

		this.effectComposer.setMainCamera(camera.object3d)
		this.effectComposer.setMainScene(scene)

		this.effectComposer.render()
	}

	public effectComposer: EffectComposer

	private renderer: Three.WebGLRenderer;

	private scene: Scene | null = null;

	private effects: HighDefinitionRenderPipelineArgs["effects"]

}