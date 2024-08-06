/**
 * Logger class
 * @class Logger
 * @static
 * @example
 * Logger.LogLevel = LogLevels.Debug;
 * Logger.Debug("Debug message");
 * Logger.Info("Info message");
 */
export class Logger {

	static Levels = {
		Debug: 0,
		Info: 1,
		Warning: 2,
		Error: 3,
		Fatal: 4,
		Silent: 5
	}

	static LogLevel = this.Levels.Info;

	static Log(level: number, message: string) {
		if(level < this.LogLevel) return;
		console.log(message);
	}

	static Debug(message: string) {
		this.Log(this.Levels.Debug, message);
	}

	static Info(message: string) {
		this.Log(this.Levels.Info, message);
	}

	static Warning(message: string) {
		this.Log(this.Levels.Warning, message);
	}

	static Error(message: string) {
		this.Log(this.Levels.Error, message);
	}

	static Fatal(message: string) {
		this.Log(this.Levels.Fatal, message);
	}
}