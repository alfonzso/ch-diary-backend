import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response, Router } from "express";
import config from "../config";
import { RouteNotFound } from "../errors";
import { errorHandler, isAuthenticated } from "../middlewares";
import routes from "../routes";
import diary from "../routes/diary";
// import authRoutes from '../routes/auth';
// import diaryRoutes from '../routes/diary';

// let's initialize our express app
export default ({ app }: { app: express.Application }) => {
  // const app = express();


  app.use(cookieParser());

  // let's parse our incoming request with JSON payload using the express.json() middleware
  app.use(express.json());

  // Add headers before the routes are defined
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,set-cookie,cookie,authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // add our routes
  // app.use(`${config.api.prefix}/auth`, authRoutes);
  // const aapp = Router();
  // // aapp.get('/test', isAuthenticated, (req, res, next) => {
  // aapp.get('/test', isAuthenticated, async (req, res, next) => {
  //   res.status(200).json({ success: true, message: 'sucsucsuc' });
  // });
  // // diary(aapp)
  // app.use(`${config.api.prefix}/diary`, aapp);

  // const mainRoutes = routes()
  // app.use(config.api.prefix, mainRoutes)
  app.use(config.api.prefix, routes())

  // catch all route
  app.all('*', (req, res) => {
    throw new RouteNotFound();
  });

  // add our error handler middleware
  // aapp.use(errorHandler);
  app.use(errorHandler);
  // app.use((
  //   err: Error,
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   res.status( 500);
  //   res.render('error', {
  //     message: err.message,
  //     error: {}
  //   });
  // });
  // mainRoutes.use(errorHandler);
  // app.use((
  //   err: Error,
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   /**
  //    * Handle 401 thrown by express-jwt library
  //    */
  //   console.log('fef---->')
  //   if (err.name === 'UnauthorizedError') {
  //     return res
  //       .status(401)
  //       .send({ message: err.message })
  //       .end();
  //   }
  //   return next(err);
  // });

  // export default app
}