import { RequestHandler } from 'express';
import log4js from 'log4js';
import { getLogger, LogLevels } from '../utils/logger';

export function middleware(): RequestHandler {
  const logger = getLogger();

  return (req, res, next) => {
    req.on('close', () => {
      if (!res.writableEnded) {
        const userAgent = req.headers['user-agent'];
        const protocol = `HTTP/${req.httpVersion}`;
        logger.log(
          LogLevels.WARN,
          `${req.ip} - - "${req.method.toUpperCase()} ${req.originalUrl} ${protocol}" Interrupted "" "${userAgent}"`,
        );
      }
    });

    return log4js.connectLogger(logger, {
      level: LogLevels.INFO,
      statusRules: [{ from: 500, to: 599, level: LogLevels.ERROR }],
    })(req, res, next);
  };
}
