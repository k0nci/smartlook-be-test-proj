// import 'source-map-support/register';
import 'dotenv/config';
import http from 'http';
import { app } from '../app';
import { getLogger } from '../utils';

// if (!process.env['NODE_CONFIG_DIR']) {
//   process.env['NODE_CONFIG_DIR'] = `${process.cwd()}/config`;
// }
// import config from 'config';

const LOGGER = getLogger();

function normalizePort(val: string = '8000'): number {
  const port = parseInt(val, 10);

  if (isNaN(port) || port <= 0) {
    LOGGER.warn('SERVER_PORT must be number greater then zero. WARNING: Replaced with 8000');
    return 8000;
  }
  return port;
}

// Get port from environment and store it in Express
const SERVER_PORT = normalizePort(process.env.SERVICE_PORT);
app.set('port', SERVER_PORT);

// Create HTTP server.
const server = http.createServer(app);

// TODO: Add on error action

server.listen(SERVER_PORT, () => {
  LOGGER.info(`Listening on port ${SERVER_PORT}`);
});
