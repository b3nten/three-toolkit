﻿import * as Three from "three"
import { EXRLoader, RGBELoader, GLTFLoader } from "three-stdlib";

export enum State {
	Idle,
	Loading,
	Complete,
	Errored,
}

export enum StatusUpdateEvent {
	Loading,
	Loaded,
	Error,
	Progress,
}

class ResolvablePromise<T> implements Promise<T> {

	#resolve!: (value: T) => void
	#reject!: (error: Error) => void
	#promise = new Promise<T>((resolve, reject) => {
		this.#resolve = resolve; this.#reject = reject
	})

	resolve(value: T) {
		this.#resolve(value)
	}

	reject(error: Error) {
		this.#reject(error)
	}

	then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => (PromiseLike<TResult1> | TResult1)) | undefined | null, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): Promise<TResult1 | TResult2> {
		return this.#promise.then(onfulfilled, onrejected)
	}

	catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | undefined | null): Promise<T | TResult> {
		return this.#promise.catch(onrejected)
	}

	finally(onfinally?: (() => void) | undefined | null): Promise<T> {
		return this.#promise.finally(onfinally)
	}

	[Symbol.toStringTag]: string = 'ResolvablePromise'
}

type UnwrapAsset<T extends Asset<any>> = T extends Asset<infer U> ? U : never

type UnwrapAssetMap<T extends Record<string, Asset<any>>> = {
	[K in keyof T]: UnwrapAsset<T[K]>
}

export abstract class Asset<AssetData> implements PromiseLike<AssetData> {

	#data?: AssetData

	#progress = 0

	#error?: Error

	#loading = false

	#promise = new ResolvablePromise<AssetData>;

	#subscribers = new Set<(status: StatusUpdateEvent) => void>()

	get data(): AssetData | undefined {
		if(this.#data === undefined && !this.#loading) {
			this.load()
		}
		return this.#data
	}

	get state(): State {
		if(this.#loading) {
			return State.Loading
		}

		if(this.#error) {
			return State.Errored
		}

		if(this.#data) {
			return State.Complete
		}

		return State.Idle
	}

	get progress() {
		return this.#progress
	}

	get loading() {
		return this.#loading
	}

	get error() {
		return this.#error
	}

	get promise() {
		return this.#promise
	}

	protected abstract loader(): AssetData | Promise<AssetData>;

	protected updateProgress(progress: number) {
		this.#progress = progress
		this.#subscribers.forEach(callback => callback(StatusUpdateEvent.Progress))
	};

	protected async fetch(url: string, options?: RequestInit & { onProgress?: (progress: number) => void }) {

		const response = await fetch(url, options)
		const reader = response.body?.getReader()
		if(!reader) { return response }

		const contentLength = response.headers.get('Content-Length')
		const total = contentLength ? parseInt(contentLength, 10) : undefined
		let received = 0

		const updateProgress = options?.onProgress ?? this.updateProgress.bind(this)

		const stream = new ReadableStream({
			start(controller) {
				const pump = () => {
					reader.read().then(({ done, value }) => {
						if(done) {
							controller.close()
							updateProgress(1)
							return
						}
						received += value.byteLength
						typeof total === 'number' && updateProgress(received / total)
						controller.enqueue(value)
						pump()
					})
				}
				pump()
			},
		})

		return new Response(stream, {
			headers: response.headers,
			status: response.status,
		})

	}

	public async load(): Promise<AssetData> {
		if(this.#loading) {
			return this.#promise
		}

		this.#loading = true

		this.#subscribers.forEach(callback => callback(StatusUpdateEvent.Loading))

		try {
			const result = this.loader()
			if(result instanceof Promise) {
				this.#data = await result
				this.#promise.resolve(this.#data)
			} else {
				this.#data = result
				this.#promise.resolve(result)
			}
		}
		catch (e) {
			this.#error = e instanceof Error ? e : new Error('Unknown error loading asset')
			this.#promise.reject(this.#error)
			this.#subscribers.forEach(callback => callback(StatusUpdateEvent.Error))
		}

		this.#loading = false
		this.#progress = 1
		this.#subscribers.forEach(callback => callback(StatusUpdateEvent.Loaded))

		return this.#data!
	}

	public subscribe(callback: (status: StatusUpdateEvent) => void): () => void {
		this.#subscribers.add(callback)

		return () => void this.#subscribers.delete(callback)
	}

	public then<TResult1 = AssetData, TResult2 = never>(
		onfulfilled?: ((value: AssetData) => TResult1 | PromiseLike<TResult1>) | undefined | null,
		onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
	): Promise<TResult1 | TResult2> {
		return this.#promise.then(onfulfilled, onrejected)
	}
}

export class AssetLoader<Assets extends Record<string, Asset<any>>> {

	#state: State = State.Idle
	#progress = 0
	#loading = false

	#resolve!: (value: UnwrapAssetMap<Assets>) => void
	#reject!: (error: Error) => void
	#promise = new Promise<UnwrapAssetMap<Assets>>((resolve, reject) => {
		this.#resolve = resolve; this.#reject = reject
	})

	#subscribers = new Set<(status: StatusUpdateEvent) => void>()

	#result: UnwrapAssetMap<Assets> = {} as UnwrapAssetMap<Assets>

	subscribe(callback: (status: StatusUpdateEvent) => void): () => void {
		this.#subscribers.add(callback)
		return () => void this.#subscribers.delete(callback)
	}

	get progress() { return this.#progress }

	get state() { return this.#state }

	get loading() { return this.#loading }

	get data() {
		return this.#result
	}

	constructor(protected assets: Assets) {}

	async load(){
		if(this.#loading) {
			return this.#promise
		}

		this.#loading = true
		this.#subscribers.forEach(callback => callback(StatusUpdateEvent.Loading))

		const promises: Promise<any>[] = []

		for(const [name, asset] of Object.entries(this.assets)) {
			asset.subscribe((status) => {
				if(status === StatusUpdateEvent.Loaded) {
					this.#result[name as keyof typeof this.assets] = asset.data
				}

				if(status === StatusUpdateEvent.Error) {
					this.#reject(new Error(`Error loading asset ${name}`))
				}

				if(status === StatusUpdateEvent.Progress) {
					this.#progress = Object.values(this.assets).reduce((acc, a) => acc + a.progress, 0) / Object.keys(this.assets).length
					this.#subscribers.forEach(callback => callback(StatusUpdateEvent.Progress))
				}
			})
			promises.push(asset.load())
		}

		try {
			await Promise.all(promises)
			this.#state = State.Complete
			this.#loading = false
			this.#progress = 1
			this.#subscribers.forEach(callback => callback(StatusUpdateEvent.Progress))
			this.#subscribers.forEach(callback => callback(StatusUpdateEvent.Loaded))
			this.#resolve(this.#result)
		}
		catch(e) {
			this.#state = State.Errored
			this.#loading = false
			this.#reject(e instanceof Error ? e : new Error('Unknown error loading assets'))
			this.#subscribers.forEach(callback => callback(StatusUpdateEvent.Error))
		}

		return this.#result
	}
}

export class EnvironmentAsset extends Asset<Three.Texture | Three.CubeTexture> {
	constructor(public readonly path: string | string[]) { super(); }

	static EXRLoader = new EXRLoader;
	static RGBELoader = new RGBELoader;
	static CubeTextureLoader = new Three.CubeTextureLoader;

	async loader(): Promise<Three.Texture | Three.CubeTexture> {

		const firstEntry = Array.isArray(this.path) ? this.path[0] : this.path

		const extension: string | false | undefined = Array.isArray(this.path)
			? 'cube'
			: firstEntry.startsWith('data:application/exr')
				? 'exr'
				: firstEntry.startsWith('data:application/hdr')
					? 'hdr'
					: firstEntry.split('.').pop()?.split('?')?.shift()?.toLowerCase()

		switch(extension){
			case 'hdr':
			case 'exr':{
				const loader = extension === 'exr' ? EnvironmentAsset.EXRLoader : EnvironmentAsset.RGBELoader;
				const texture = await loader.loadAsync(firstEntry, (e) => this.updateProgress(e.loaded / e.total));
				texture.mapping = Three.EquirectangularReflectionMapping
				return texture
			}
			case 'cube': {
				const loaderCube = EnvironmentAsset.CubeTextureLoader;
				const texture = await loaderCube.loadAsync(this.path as string[], (e) => this.updateProgress(e.loaded / e.total));
				texture.mapping = Three.CubeReflectionMapping;
				return texture
			}
			default:
				throw new Error(`Unsupported environment file extension ${extension}`)
		}
	}
}

export class TextureAsset extends Asset<Three.Texture> {
	constructor(public readonly path: string) { super(); }

	async loader() {
		const loader = new Three.TextureLoader();
		const texture = await loader.loadAsync(this.path, (e) => this.updateProgress(e.loaded / e.total));
		return texture
	}
}

export class GltfAsset extends Asset<Three.Group> {
	constructor(public readonly path: string) { super(); }

	async loader() {
		const loader = new GLTFLoader();
		const gltf = await loader.loadAsync(this.path, (e) => this.updateProgress(e.loaded / e.total));
		return gltf.scene
	}
}

