﻿export { Game } from "./game";
export { Scene } from "./scene";
export { GameObject } from "./game_object";
export { Behavior } from "./behavior";
export { ASSERT } from "./assert";
export { destroy } from "./destroy";

export { CameraOrbitBehavior } from "./behaviors/CameraOrbitBehavior";
export { SpinBehavior } from "./behaviors/SpinBehavior";
export { FloatBehavior } from "./behaviors/FloatBehavior";

export { PrimitiveCubeObject } from "./game_objects/PrimitiveObject";
export { EnvironmentObject } from "./game_objects/EnvironmentObject";
export { MeshObject } from "./game_objects/MeshObject";
export { SkeletalMeshObject } from "./game_objects/SkeletalMeshObject";
export { PerspectiveCameraObject } from "./game_objects/PerspectiveCamera";
export { OrthographicCameraObject } from "./game_objects/OrthographicCamera";

export { AssetLoader, EnvironmentAsset, GltfAsset, TextureAsset, Asset } from "./assets";

export const ActiveCamera = Symbol.for("ETag:ActiveCamera")

export { RenderPipeline } from "./render_pipeline"
export { BasicRenderPipeline } from "./render_pipelines/BasicRenderPipeline"
export { HighDefinitionRenderPipeline } from "./render_pipelines/HighDefinitionRenderPipeline"