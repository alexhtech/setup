import { isObservable, toJS } from 'mobx';

/* eslint-disable no-console */

enum LoggerLevel {
  Info,
  Warn,
  Error,
  Debug,
}

export class Logger {
  constructor(
    private readonly tag: string,
    private readonly disabled?: boolean,
  ) {}

  warn = (...message: any[]) => {
    this.print(LoggerLevel.Warn, message);
  };

  error = (...message: any[]) => {
    this.print(LoggerLevel.Error, message);
  };

  debug = (...message: any[]) => {
    this.print(LoggerLevel.Debug, message);
  };

  info = (...message: any[]) => {
    this.print(LoggerLevel.Info, message);
  };

  private print = (level: LoggerLevel, messages: any[]) => {
    if (this.disabled) return;

    const typedMessages = messages.map((m) => {
      try {
        if (m instanceof Error) {
          return m;
        }

        if (isObservable(m)) {
          return toJS(m);
        }

        return m;
      } catch {
        return m;
      }
    });

    const stringifiedMessages = typedMessages.filter((m): m is string => typeof m === 'string').join(' ');

    const others = typedMessages.filter((m): m is unknown => typeof m !== 'string');

    const formattedMessage = [`[${Date.now()}][${this.tag}] ${stringifiedMessages}`, ...others];

    this.printMessage(level, formattedMessage);
  };

  private printMessage = (level: LoggerLevel, formattedMessage: any[]) => {
    switch (level) {
      case LoggerLevel.Info:
        console.info(...formattedMessage);
        break;
      case LoggerLevel.Warn:
        console.warn(...formattedMessage);
        break;
      case LoggerLevel.Error:
        console.error(...formattedMessage);
        break;
      case LoggerLevel.Debug:
        console.debug(...formattedMessage);
        break;
      default:
        console.log(...formattedMessage);
    }
  };
}
