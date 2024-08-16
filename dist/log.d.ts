type RGB = [r: number, g: number, b: number];
type Gradient = [start: RGB, end: RGB];
declare const gradients: {
    readonly purple: Gradient;
    readonly sunset: Gradient;
    readonly gray: Gradient;
    readonly orange: Gradient;
    readonly lime: Gradient;
    readonly blue: Gradient;
    readonly red: Gradient;
};
export declare function interpolateRGB(startColor: RGB, endColor: RGB, t: number): RGB;
export declare function formatAnsi(string: string, styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    foreground?: RGB;
    background?: RGB;
}): {
    content: string;
    styles: never[];
};
export declare function format(string: string, options?: {}): {
    content: string;
    styles: string[];
};
export declare function stringGradient(str: string, gradient: Gradient, options?: {}): {
    content: string;
    styles: string[];
};
declare const isCI: boolean;
declare const isColorSupported: boolean;
declare const enum LogLevel {
    Debug = 100,
    Success = 200,
    Info = 250,
    Warn = 300,
    Error = 400,
    Critical = 500,
    Production = 999,
    Silent = 9999
}
interface ConsoleWriter {
    write(level: LogLevel, message: any[]): void;
}
declare class FancyConsoleWriter implements ConsoleWriter {
    name: string;
    formattedName: {
        content: string;
        styles: string[];
    };
    levels: Record<string, {
        content: string;
        styles: string[];
    }>;
    constructor(name: string, color: [RGB, RGB]);
    write(level: LogLevel, message: any[]): void;
    writeDebug(message: any[]): void;
    writeInfo(message: any[]): void;
    writeSuccess(message: any[]): void;
    writeWarn(message: any[]): void;
    writeError(message: any[]): void;
    writeCritical(message: any[]): void;
}
declare class SimpleConsoleWriter implements ConsoleWriter {
    private name;
    constructor(name: string);
    write(level: LogLevel, message: any[]): void;
    writeDebug(message: any[]): void;
    writeInfo(message: any[]): void;
    writeSuccess(message: any[]): void;
    writeWarn(message: any[]): void;
    writeError(message: any[]): void;
    writeCritical(message: any[]): void;
}
declare class Logger {
    level: LogLevel;
    writer: ConsoleWriter;
    constructor(level: LogLevel, writer: ConsoleWriter);
    logImpl(level: LogLevel, input: any[]): void;
    /**
     * Log a message for debugging purposes.
     * @param  {...any} msg
     * @returns void
     */
    debug: (...msg: any[]) => void;
    /**
     * Log a message that provides non critical information for the user.
     * @param  {...any} msg
     * @returns void
     */
    info: (...msg: any[]) => void;
    /**
     * Log a message that indicates a successful operation to the user.
     * @param  {...any} msg
     * @returns void
     */
    success: (...msg: any[]) => void;
    /**
     * Log a message that indicates a warning to the user.
     * @param  {...any} msg
     * @returns void
     */
    warn: (...msg: any[]) => void;
    /**
     * Log a message that indicates an error to the user.
     * @param  {...any} msg
     * @returns void
     */
    error: (...msg: any[]) => void;
    /**
     * Log a message that indicates a critical error to the user.
     * @param  {...any} msg
     * @returns void
     */
    critical: (...msg: any[]) => void;
    log: (...msg: any[]) => void;
}
type LogConfig = {
    level?: Logger["level"];
    color?: [RGB, RGB];
    writer?: Logger["writer"];
};
declare function createLogger(name: string, config?: LogConfig): Logger;
export { isColorSupported, isCI, gradients, FancyConsoleWriter, SimpleConsoleWriter, Logger, createLogger, };
