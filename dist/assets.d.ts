import * as Three from "three";
import { EXRLoader, RGBELoader } from "three-stdlib";
export declare enum State {
    Idle = 0,
    Loading = 1,
    Complete = 2,
    Errored = 3
}
export declare enum StatusUpdateEvent {
    Loading = 0,
    Loaded = 1,
    Error = 2,
    Progress = 3
}
declare class ResolvablePromise<T> implements Promise<T> {
    #private;
    resolve(value: T): void;
    reject(error: Error): void;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => (PromiseLike<TResult1> | TResult1)) | undefined | null, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): Promise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | undefined | null): Promise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
    [Symbol.toStringTag]: string;
}
type UnwrapAsset<T extends Asset<any>> = T extends Asset<infer U> ? U : never;
type UnwrapAssetMap<T extends Record<string, Asset<any>>> = {
    [K in keyof T]: UnwrapAsset<T[K]>;
};
export declare abstract class Asset<AssetData> implements PromiseLike<AssetData> {
    #private;
    get data(): AssetData | undefined;
    get state(): State;
    get progress(): number;
    get loading(): boolean;
    get error(): Error | undefined;
    get promise(): ResolvablePromise<AssetData>;
    protected abstract loader(): AssetData | Promise<AssetData>;
    protected updateProgress(progress: number): void;
    protected fetch(url: string, options?: RequestInit & {
        onProgress?: (progress: number) => void;
    }): Promise<Response>;
    load(): Promise<AssetData>;
    subscribe(callback: (status: StatusUpdateEvent) => void): () => void;
    then<TResult1 = AssetData, TResult2 = never>(onfulfilled?: ((value: AssetData) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
}
export declare class AssetLoader<Assets extends Record<string, Asset<any>>> {
    #private;
    protected assets: Assets;
    subscribe(callback: (status: StatusUpdateEvent) => void): () => void;
    get progress(): number;
    get state(): State;
    get loading(): boolean;
    get data(): UnwrapAssetMap<Assets>;
    constructor(assets: Assets);
    load(): Promise<UnwrapAssetMap<Assets>>;
}
export declare class EnvironmentAsset extends Asset<Three.Texture | Three.CubeTexture> {
    readonly path: string | string[];
    constructor(path: string | string[]);
    static EXRLoader: EXRLoader;
    static RGBELoader: RGBELoader;
    static CubeTextureLoader: Three.CubeTextureLoader;
    loader(): Promise<Three.Texture | Three.CubeTexture>;
}
export declare class TextureAsset extends Asset<Three.Texture> {
    readonly path: string;
    constructor(path: string);
    loader(): Promise<Three.Texture>;
}
export declare class GltfAsset extends Asset<Three.Group> {
    readonly path: string;
    constructor(path: string);
    loader(): Promise<Three.Group<Three.Object3DEventMap>>;
}
export {};
