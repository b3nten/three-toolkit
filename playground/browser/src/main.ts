import "./styles.css";
import * as Effects from "postprocessing";
import * as Three from "three";
import * as Engine from "../../src/mod.ts";

const basicRP = new Engine.BasicRenderPipeline({
	canvas: document.getElementById("game") as HTMLCanvasElement,
	toneMapping: Three.ACESFilmicToneMapping,
	toneMappingExposure: 1,
	devicePixelRatio: window.devicePixelRatio,
});

const hdRP = new Engine.HighDefinitionRenderPipeline({
	canvas: document.getElementById("game") as HTMLCanvasElement,
	effects: () => [
		new Effects.RenderPass(),
		new Effects.EffectPass(undefined, new Effects.ChromaticAberrationEffect()),
		new Effects.EffectPass(
			undefined,
			new Effects.ToneMappingEffect({
				mode: Effects.ToneMappingMode.ACES_FILMIC,
			}),
		),
		new Effects.EffectPass(
			undefined,
			new Effects.SMAAEffect({
				preset: Effects.SMAAPreset.ULTRA,
			}),
		),
	],
	devicePixelRatio: window.devicePixelRatio,
});

const game = new Engine.Game({ renderPipeline: hdRP });

class TestScene extends Engine.Scene {
	environment = new Engine.EnvironmentObject({
		background: true,
		backgroundBlur: 2,
	});

	camera = new Engine.PerspectiveCameraObject();

	override async setup() {
		await super.setup();

		this.camera
			.addChild(new Engine.CameraOrbitBehavior())
			.addTag(Engine.ActiveCamera).position.z = 5;

		this.root.addChild(this.camera);

		this.root.addChild(this.environment);

		this.root.addChild(
			new Engine.PrimitiveCubeObject().addChild(new Engine.FloatBehavior()),
		);
	}
}

async function main() {
	console.log("Loading scene");
	await game.loadScene(new TestScene());
	console.log("Playing scene");
	game.play();
}

main();
