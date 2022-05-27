import 'reflect-metadata';
import config from './config';
import express from 'express';
import Logger from './src/loaders/logger';

import * as http from 'http';
export const app = express();
export let appServer: http.Server

async function startServer() {

  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   **/
  await require('./src/loaders').default({ expressApp: app });


  appServer = app.listen(config.port, () => {
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
  }).on('error', err => {
    Logger.error(' --SERVER-- ', err);
    process.exit(1);
  });

}

startServer();