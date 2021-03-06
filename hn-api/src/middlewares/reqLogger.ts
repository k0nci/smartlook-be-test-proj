import { RequestHandler } from 'express';
import log4js from 'log4js';
import { getLogger, LogLevels } from '../utils/logger';

export function middleware(): RequestHandler {
  return log4js.connectLogger(getLogger(), {
    level: LogLevels.INFO,
    statusRules: [
      { from: 500, to: 599, level: LogLevels.ERROR },
    ],
  });
}
