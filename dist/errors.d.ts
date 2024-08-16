export declare function toError(err: unknown): Error;
/**
 * Immediately runs the provided function, catching and returning all uncaught exceptions.
 */
export declare function run<T>(fn: () => T): T extends Promise<any> ? (Promise<Error | Awaited<T>>) : (Error | T);
export type Result<T> = {
    success: false;
    error: Error;
    value: undefined;
} | {
    success: true;
    error: undefined;
    value: T;
};
/**
 * Immediately runs the provided function,
 * returning a result object that includes the success status,
 * the value returned by the function, and any error that was thrown.
 */
export declare function result<T>(fn: () => T): T extends Promise<any> ? (Promise<Result<Awaited<T>>>) : Result<T>;
export declare function isResult<T>(input: unknown): input is Result<T>;
