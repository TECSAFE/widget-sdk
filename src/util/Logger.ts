/**
 * The log level for the TECSAFE Widget SDK.
 */
export type LogLevel = 'mute' | 'error' | 'warn' | 'info' | 'debug'

/**
 * Internal Logger utility for the TECSAFE Widget SDK.
 * Uses a singleton pattern to manage log levels globally.
 */
export class Logger {
  private static instance: Logger
  readonly prefix = '[TECSAFE]'
  private logLevel: LogLevel = 'error'
  private constructor() {}

  /**
   * Retrieves the singleton instance of the Logger.
   * Creates the instance if it does not already exist.
   *
   * @returns The Logger instance.
   */
  public static getInstance(): Logger {
    if (!Logger.instance) Logger.instance = new Logger()
    return Logger.instance
  }

  /**
   * Sets the current log level. Only messages with a priority equal to or higher
   * than this level will be output to the console.
   *
   * @param logLevel - The desired logging severity level.
   */
  setLogLevel(logLevel: LogLevel): void {
    this.logLevel = logLevel
  }

  /**
   * Logs an error message to the console.
   *
   * @param message - One or more string arguments to log.
   */
  error(...message: string[]): void {
    if (this.logLevel === 'mute') return
    console.error(this.prefix, ...message)
  }

  /**
   * Logs a warning message to the console.
   *
   * @param message - One or more string arguments to log.
   */
  warn(...message: string[]): void {
    if (this.logLevel === 'mute' || this.logLevel === 'error') return
    console.warn(this.prefix, ...message)
  }

  /**
   * Logs an informational message to the console.
   *
   * @param message - One or more string arguments to log.
   */
  info(...message: string[]): void {
    if (
      this.logLevel === 'mute' ||
      this.logLevel === 'error' ||
      this.logLevel === 'warn'
    )
      return
    console.info(this.prefix, ...message)
  }

  /**
   * Logs a debug message to the console.
   *
   * @param message - One or more string arguments to log.
   */
  debug(...message: string[]): void {
    if (this.logLevel !== 'debug') return
    console.debug(this.prefix, ...message)
  }
}

/**
 * Sets the log level for the TECSAFE Widget SDK.
 *
 * @param logLevel The log level to set
 * @category SDK
 */
export const setTecsafeLogLevel = (logLevel: LogLevel): void => {
  Logger.getInstance().setLogLevel(logLevel)
}
