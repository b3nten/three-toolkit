import * as three from "three";
import { Scene } from "./scene";
import { GameObject } from "./gameobject";
import { Behavior } from "./behavior";

export { ASSERT } from "@benstack/toolkit/asserts"

/**
 * Assertions
 * @class
 * @classdesc Assertion methods for checking object types
 * @exports Assert
 * @category Core
 * @hideconstructor
 */
export class Asserts {
	/**
	 * Check if an object is an Actor
	 * @param object
	 * @constructor
	 * @returns {boolean}
	 */
	static IsGameObject(object: any): object is GameObject {
		return object instanceof GameObject;
	}

	/**
	 * Check if an object is a Component
	 * @param object
	 * @constructor
	 * @returns {boolean}
	 */
	static IsBehavior(object: any): object is Behavior {
		return object instanceof Behavior;
	}

	/**
	 * Check if an object is a Scene
	 * @param object
	 * @constructor
	 * @returns {boolean}
	 */
	static IsScene(object: any): object is Scene {
		return object instanceof Scene;
	}

	/**
	 * Check if an object is a PerspectiveCamera
	 * @param camera
	 * @constructor
	 * @returns {boolean}
	 */
	static IsPerspectiveCamera(camera: three.Camera): camera is three.PerspectiveCamera {
		return "isPerspectiveCamera" in camera;
	}

	/**
	 * Check if an object is an OrthographicCamera
	 * @param camera
	 * @constructor
	 * @returns {boolean}
	 */
	static IsOrthographicCamera(camera: any): camera is three.OrthographicCamera {
		return "isOrthographicCamera" in camera;
	}

	/**
	 * Check if an object is a RenderItem
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsRenderItem(obj: any): obj is three.RenderItem {
		return "geometry" in obj && "material" in obj;
	}

	/**
	 * Check if an object is a Mesh
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsMesh(obj: any): obj is three.Mesh {
		return "isMesh" in obj;
	}

	/**
	 * Check if an object is a Light
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsLight(obj: any): obj is three.Light {
		return "isLight" in obj;
	}

	/**
	 * Check if an object is a Material
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsMaterial(obj: any): obj is three.Material {
		return "isMaterial" in obj;
	}

	/**
	 * Check if an object is a Geometry
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsGeometry(obj: any): obj is three.BufferGeometry {
		return "isBufferGeometry" in obj;
	}

	/**
	 * Check if an object is a Scene
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsThreeScene(obj: any): obj is three.Scene {
		return "isScene" in obj;
	}

	/**
	 * Check if an object is a Camera
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsCamera(obj: any): obj is three.Camera {
		return "isCamera" in obj;
	}

	/**
	 * Check if an object is an Object3D
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsObject3D(obj: any): obj is three.Object3D {
		return "isObject3D" in obj;
	}

	/**
	 * Check if an object is a Texture
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsTexture(obj: any): obj is three.Texture {
		return "isTexture" in obj;
	}

	/**
	 * Check if an object is a WebGLRenderer
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsWebGLRenderer(obj: any): obj is three.WebGLRenderer {
		return "isWebGLRenderer" in obj;
	}

	/**
	 * Check if an object is a Clock
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsClock(obj: any): obj is three.Clock {
		return "isClock" in obj;
	}

	/**
	 * Check if an object is a Vector3
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsVector3(obj: any): obj is three.Vector3 {
		return "isVector3" in obj;
	}

	/**
	 * Check if an object is a Vector2
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsVector2(obj: any): obj is three.Vector2 {
		return "isVector2" in obj;
	}

	/**
	 * Check if an object is a Color
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsColor(obj: any): obj is three.Color {
		return "isColor" in obj;
	}

	/**
	 * Check if an object is a Quaternion
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsQuaternion(obj: any): obj is three.Quaternion {
		return "isQuaternion" in obj;
	}

	/**
	 * Check if an object is an Euler
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsEuler(obj: any): obj is three.Euler {
		return "isEuler" in obj;
	}

	/**
	 * Check if an object is a Matrix4
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsMatrix4(obj: any): obj is three.Matrix4 {
		return "isMatrix4" in obj;
	}

	/**
	 * Check if an object is a Raycaster
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsRaycaster(obj: any): obj is three.Raycaster {
		return "isRaycaster" in obj;
	}

	/**
	 * Check if an object is a Box3
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsBox3(obj: any): obj is three.Box3 {
		return "isBox3" in obj;
	}

	/**
	 * Check if an object is a Sphere
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsSphere(obj: any): obj is three.Sphere {
		return "isSphere" in obj;
	}

	/**
	 * Check if an object is a Plane
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsPlane(obj: any): obj is three.Plane {
		return "isPlane" in obj;
	}

	/**
	 * Check if an object is a Frustum
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsFrustum(obj: any): obj is three.Frustum {
		return "isFrustum" in obj;
	}

	/**
	 * Check if an object is a Line
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */

	static IsLine(obj: any): obj is three.Line {
		return "isLine" in obj;
	}

	/**
	 * Check if an object is a Points
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsPoints(obj: any): obj is three.Points {
		return "isPoints" in obj;
	}

	/**
	 * Check if an object is a Group
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsGroup(obj: any): obj is three.Group {
		return "isGroup" in obj;
	}

	/**
	 * Check if an object is an InstancedMesh
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsInstancedMesh(obj: any): obj is three.InstancedMesh {
		return "isInstancedMesh" in obj;
	}

	/**
	 * Check if an object is a SkinnedMesh
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsSkinnedMesh(obj: any): obj is three.SkinnedMesh {
		return "isSkinnedMesh" in obj;
	}

	/**
	 * Check if an object is a Sprite
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsSprite(obj: any): obj is three.Sprite {
		return "isSprite" in obj;
	}

	/**
	 * Check if an object is a LineSegments
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsLineSegments(obj: any): obj is three.LineSegments {
		return "isLineSegments" in obj;
	}

	/**
	 * Check if an object is a LineLoop
	 * @param obj
	 * @constructor
	 * @returns {boolean}
	 */
	static IsLineLoop(obj: any): obj is three.LineLoop {
		return "isLineLoop" in obj;
	}
}
