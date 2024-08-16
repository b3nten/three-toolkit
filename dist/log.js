const purpleGradient = [[247, 81, 172], [55, 0, 231]];
const sunsetGradient = [[231, 0, 187], [255, 244, 20]];
const grayGradient = [[235, 244, 245], [181, 198, 224]];
const orangeGradient = [[255, 147, 15], [255, 249, 91]];
const limeGradient = [[89, 209, 2], [243, 245, 32]];
const blueGradient = [[31, 126, 161], [111, 247, 232]];
const redGradient = [[244, 7, 82], [249, 171, 143]];
const gradients = {
  purple: purpleGradient,
  sunset: sunsetGradient,
  gray: grayGradient,
  orange: orangeGradient,
  lime: limeGradient,
  blue: blueGradient,
  red: redGradient
};
const lerp = (start, end, factor) => start + factor * (end - start);
export function interpolateRGB(startColor, endColor, t) {
  if (t < 0) {
    return startColor;
  }
  ;
  if (t > 1) {
    return endColor;
  }
  ;
  return [
    Math.round(lerp(startColor[0], endColor[0], t)),
    Math.round(lerp(startColor[1], endColor[1], t)),
    Math.round(lerp(startColor[2], endColor[2], t))
  ];
}
function isBrowser() {
  return (
    //@ts-ignore
    typeof window !== "undefined" && typeof globalThis.Deno === "undefined"
  );
}
export function formatAnsi(string, styles = {}) {
  let c = "";
  if (styles.bold) c += "1;";
  if (styles.italic) c += "3;";
  if (styles.underline) c += "4;";
  if (styles.foreground) c += `38;2;${styles.foreground.join(";")};`;
  if (styles.background) c += `48;2;${styles.background.join(";")};`;
  while (c.endsWith(";")) c = c.slice(0, -1);
  return {
    content: `\x1B[${c}m${string}\x1B[0m\x1B[0m`,
    styles: []
  };
}
function formatBrowser(string, options = {}) {
  const styles = [];
  if (options.bold) styles.push("font-weight: bold;");
  if (options.italic) styles.push("font-style: italic;");
  if (options.underline) styles.push("text-decoration: underline;");
  if (options.foreground)
    styles.push(`color: rgb(${options.foreground.join(", ")});`);
  if (options.background)
    styles.push(`background-color: rgb(${options.background.join(", ")});`);
  if (options.size) styles.push(`font-size: ${options.size}px;`);
  return {
    content: `%c${string}`,
    styles: [styles.join("")]
  };
}
export function format(string, options = {}) {
  if (isBrowser()) return formatBrowser(string, options);
  return formatAnsi(string, options);
}
export function stringGradient(str, gradient, options = {}) {
  const result = {
    content: "",
    styles: []
  };
  if (isBrowser()) {
    result.content = "%c" + str.split("").join("%c");
    for (let i = 0; i < str.length; i++) {
      const g = interpolateRGB(gradient[0], gradient[1], i / str.length);
      result.styles.push(formatBrowser(str[i], { ...options, foreground: g }).styles[0]);
    }
    return result;
  }
  for (let i = 0; i < str.length; i++) {
    result.content += formatAnsi(str[i], {
      ...options,
      foreground: interpolateRGB(
        gradient[0],
        gradient[1],
        i / str.length
      )
    }).content;
  }
  return result;
}
function toBoolean(val) {
  return val ? val !== "false" : false;
}
const env = globalThis.process?.env || import.meta.env || globalThis.Deno?.env.toObject() || globalThis.__env__ || globalThis;
const hasTTY = toBoolean(
  globalThis.process?.stdout && globalThis.process?.stdout.isTTY
);
const isWindows = /^win/i.test(globalThis.process?.platform || "");
const isCI = toBoolean(env.CI);
const isColorSupported = typeof document !== "undefined" || !toBoolean(env.NO_COLOR) && (toBoolean(env.FORCE_COLOR) || (hasTTY || isWindows) && env.TERM !== "dumb");
var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
  LogLevel2[LogLevel2["Debug"] = 100] = "Debug";
  LogLevel2[LogLevel2["Success"] = 200] = "Success";
  LogLevel2[LogLevel2["Info"] = 250] = "Info";
  LogLevel2[LogLevel2["Warn"] = 300] = "Warn";
  LogLevel2[LogLevel2["Error"] = 400] = "Error";
  LogLevel2[LogLevel2["Critical"] = 500] = "Critical";
  LogLevel2[LogLevel2["Production"] = 999] = "Production";
  LogLevel2[LogLevel2["Silent"] = 9999] = "Silent";
  return LogLevel2;
})(LogLevel || {});
class FancyConsoleWriter {
  name;
  formattedName;
  levels;
  constructor(name, color) {
    this.name = name;
    this.formattedName = stringGradient(`[ ${name} ]`, color);
    this.levels = {
      debug: stringGradient("DEBUG", gradients.gray, { size: 12 }),
      info: stringGradient("INFO", gradients.blue),
      success: stringGradient("SUCCESS", gradients.lime),
      warn: stringGradient("WARN", gradients.orange),
      error: stringGradient("ERROR", gradients.red, { bold: true }),
      critical: format("  CRITICAL  ", {
        background: [255, 0, 0],
        size: 20
      })
    };
  }
  write(level, message) {
    if (level === 100 /* Debug */) return this.writeDebug(message);
    if (level === 250 /* Info */) return this.writeInfo(message);
    if (level === 200 /* Success */) return this.writeSuccess(message);
    if (level === 300 /* Warn */) return this.writeWarn(message);
    if (level === 400 /* Error */) return this.writeError(message);
    if (level === 500 /* Critical */) return this.writeCritical(message);
    console.log(
      this.formattedName.content,
      ...this.formattedName.styles,
      ...message
    );
  }
  writeDebug(message) {
    console.log(
      `${this.formattedName.content} ${this.levels.debug.content}`,
      ...this.formattedName.styles,
      ...this.levels.debug.styles,
      ...message
    );
  }
  writeInfo(message) {
    console.log(
      `${this.formattedName.content} ${this.levels.info.content}`,
      ...this.formattedName.styles,
      ...this.levels.info.styles,
      ...message
    );
  }
  writeSuccess(message) {
    console.log(
      `${this.formattedName.content} ${this.levels.success.content}`,
      ...this.formattedName.styles,
      ...this.levels.success.styles,
      ...message
    );
  }
  writeWarn(message) {
    console.log(
      `${this.formattedName.content} ${this.levels.warn.content}`,
      ...this.formattedName.styles,
      ...this.levels.warn.styles,
      ...message
    );
  }
  writeError(message) {
    console.log(
      `${this.formattedName.content} ${this.levels.error.content}`,
      ...this.formattedName.styles,
      ...this.levels.error.styles,
      ...message
    );
  }
  writeCritical(message) {
    console.log(
      `${this.formattedName.content} ${this.levels.critical.content}`,
      ...this.formattedName.styles,
      ...this.levels.critical.styles,
      ...message
    );
  }
}
class SimpleConsoleWriter {
  constructor(name) {
    this.name = name;
  }
  write(level, message) {
    if (level === 100 /* Debug */) return this.writeDebug(message);
    if (level === 250 /* Info */) return this.writeInfo(message);
    if (level === 200 /* Success */) return this.writeSuccess(message);
    if (level === 300 /* Warn */) return this.writeWarn(message);
    if (level === 400 /* Error */) return this.writeError(message);
    if (level === 500 /* Critical */) return this.writeCritical(message);
    console.log(`[${this.name}]`, ...message);
  }
  writeDebug(message) {
    console.debug(`[${this.name}]`, ...message);
  }
  writeInfo(message) {
    console.info(`[${this.name}]`, ...message);
  }
  writeSuccess(message) {
    console.log(`[${this.name}] SUCCESS`, ...message);
  }
  writeWarn(message) {
    console.warn(`[${this.name}] WARN`, ...message);
  }
  writeError(message) {
    console.error(`[${this.name}] ERROR`, ...message);
  }
  writeCritical(message) {
    console.error(`[${this.name}] CRITICAL`, ...message);
  }
}
class Logger {
  constructor(level, writer) {
    this.level = level;
    this.writer = writer;
  }
  logImpl(level, input) {
    if (level > 999 /* Production */ || level < this.level) return;
    this.writer?.write(level, input);
  }
  /**
   * Log a message for debugging purposes.
   * @param  {...any} msg 
   * @returns void
   */
  debug = (...msg) => this.logImpl(100 /* Debug */, msg);
  /**
   * Log a message that provides non critical information for the user.
   * @param  {...any} msg 
   * @returns void
   */
  info = (...msg) => this.logImpl(250 /* Info */, msg);
  /**
   * Log a message that indicates a successful operation to the user.
   * @param  {...any} msg 
   * @returns void
   */
  success = (...msg) => this.logImpl(200 /* Success */, msg);
  /**
   * Log a message that indicates a warning to the user.
   * @param  {...any} msg 
   * @returns void
   */
  warn = (...msg) => this.logImpl(300 /* Warn */, msg);
  /**
   * Log a message that indicates an error to the user.
   * @param  {...any} msg 
   * @returns void
   */
  error = (...msg) => this.logImpl(400 /* Error */, msg);
  /**
   * Log a message that indicates a critical error to the user.
   * @param  {...any} msg 
   * @returns void
   */
  critical = (...msg) => this.logImpl(500 /* Critical */, msg);
  log = (...msg) => this.logImpl(999 /* Production */, msg);
}
function createLogger(name, config = {}) {
  if (!name) throw new Error("Logger must have a name");
  const level = config.level ?? Logger.LogLevels.INFO;
  const color = config.color ?? gradients.orange;
  const writer = config.writer ?? (isColorSupported ? new FancyConsoleWriter(name, color) : new SimpleConsoleWriter(name));
  return new Logger(level, writer);
}
export {
  isColorSupported,
  isCI,
  gradients,
  FancyConsoleWriter,
  SimpleConsoleWriter,
  Logger,
  createLogger
};
