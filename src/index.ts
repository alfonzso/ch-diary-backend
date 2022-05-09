// import 'express-async-errors';
// import app from './loaders/express';

// const port = process.env.PORT || 8080;

// // listen to our express app
// app.listen(port, () => {
//   console.log(`Our Application is up and running on port ${port}`);
// });

import 'reflect-metadata'; // We need this in order to use @Decorators
import config from './config';
import express from 'express';
import Logger from './loaders/logger';
// import { errorHandler } from './middlewares';

async function startServer() {
  const app = express();

  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   **/
  await require('./loaders').default({ expressApp: app });


  app.listen(config.port, () => {
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
  // })
  }).on('error', err => {
    Logger.error('------------------------------------------>',err);
    process.exit(1);
  });

}

startServer();