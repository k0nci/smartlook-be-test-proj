import log4js from 'log4js';

export const enum LogLevels {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

const LOGGERS: {
  [key: string]: log4js.Logger;
} = {};

export function getLogger(name: string = 'APP', level: LogLevels = LogLevels.TRACE): log4js.Logger {
  if (!LOGGERS[name]) {
    LOGGERS[name] = log4js.getLogger(name);
    LOGGERS[name].level = level;
  }

  return LOGGERS[name];
}
