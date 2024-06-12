import * as three from "three";

export const isPerspectiveCamera = (
  camera: three.Camera,
): camera is three.PerspectiveCamera => "isPerspectiveCamera" in camera;

export const isOrthographicCamera = (
  camera: any,
): camera is three.OrthographicCamera => "isOrthographicCamera" in camera;

export const isRenderItem = (obj: any): obj is three.RenderItem =>
  "geometry" in obj && "material" in obj;

export const isMesh = (obj: any): obj is three.Mesh => "isMesh" in obj;

export const isLight = (obj: any): obj is three.Light => "isLight" in obj;

export const isMaterial = (obj: any): obj is three.Material =>
  "isMaterial" in obj;

export const isGeometry = (obj: any): obj is three.BufferGeometry =>
  "isBufferGeometry" in obj;

export const isScene = (obj: any): obj is three.Scene => "isScene" in obj;

export const isCamera = (obj: any): obj is three.Camera => "isCamera" in obj;

export const isObject3D = (obj: any): obj is three.Object3D =>
  "isObject3D" in obj;

export const isTexture = (obj: any): obj is three.Texture => "isTexture" in obj;

export const isWebGLRenderer = (obj: any): obj is three.WebGLRenderer =>
  "isWebGLRenderer" in obj;

export const isClock = (obj: any): obj is three.Clock => "isClock" in obj;

export const isVector3 = (obj: any): obj is three.Vector3 => "isVector3" in obj;

export const isVector2 = (obj: any): obj is three.Vector2 => "isVector2" in obj;

export const isColor = (obj: any): obj is three.Color => "isColor" in obj;

export const isQuaternion = (obj: any): obj is three.Quaternion =>
  "isQuaternion" in obj;

export const isEuler = (obj: any): obj is three.Euler => "isEuler" in obj;

export const isMatrix4 = (obj: any): obj is three.Matrix4 => "isMatrix4" in obj;

export const isRaycaster = (obj: any): obj is three.Raycaster =>
  "isRaycaster" in obj;

export const isBox3 = (obj: any): obj is three.Box3 => "isBox3" in obj;

export const isSphere = (obj: any): obj is three.Sphere => "isSphere" in obj;

export const isPlane = (obj: any): obj is three.Plane => "isPlane" in obj;

export const isFrustum = (obj: any): obj is three.Frustum => "isFrustum" in obj;

export const isLine = (obj: any): obj is three.Line => "isLine" in obj;

export const isPoints = (obj: any): obj is three.Points => "isPoints" in obj;

export const isGroup = (obj: any): obj is three.Group => "isGroup" in obj;

export const isInstancedMesh = (obj: any): obj is three.InstancedMesh =>
  "isInstancedMesh" in obj;

export const isSkinnedMesh = (obj: any): obj is three.SkinnedMesh =>
  "isSkinnedMesh" in obj;

export const isSprite = (obj: any): obj is three.Sprite => "isSprite" in obj;

export const isLineSegments = (obj: any): obj is three.LineSegments =>
  "isLineSegments" in obj;

export const isLineLoop = (obj: any): obj is three.LineLoop =>
  "isLineLoop" in obj;
