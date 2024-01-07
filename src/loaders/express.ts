import cookieParser from "cookie-parser";
// import expressLayouts from "express-ejs-layouts";
import bodyParser from 'body-parser';

import express from "express";
import config from "../../config";
import { RouteNotFound } from "../errors";
import { errorHandler } from "../middlewares";
// import routes from "../routes";
// import renders from "../routes/renders";
// import path from "path";
import { handleAuth } from "../middlewares/handleAuth";
// import handlebars from "handlebars";
import { engine, create } from 'express-handlebars';
import html from "../routes/html";

// let's initialize our express app
type PathParams = string | RegExp | Array<string | RegExp>;

type FafaType = {
  // Path: PathParams,
  // Path: string,
  Path: PathParams,
  // handlers: () => any
  handlers: any
  // Handler: () => any
}
export default ({ app }: { app: express.Application }) => {

  app.use(express.static('./src/views'))

  app.set('trust proxy', 1)
  app.use(cookieParser());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(handleAuth);

  app.set('views', './src/views');

  const kk = {
    extname: '.hbs',
    defaultLayout: false,
    helpers: {
      dynamicPage() { return 'wellcome'; }
    }
  }
  app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: false,
    helpers: {
      dynamicPage() { return 'wellcome'; }
    },
  }));
  app.set('view engine', '.hbs');
  // app.set('view engine', 'handlebars');

  console.log("-------------> tt ", kk.helpers)

  // let's parse our incoming request with JSON payload using the express.json() middleware
  app.use(express.json());

  // Add headers before the routes are defined
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS || '');
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
  // const faf: FafaType = { Path: '/', handlers: html() }
  // app.use(faf)
  app.use('/', html())

  // add our routes
  // app.use(config.api.prefix, routes())

  // catch all route
  app.all('*', (req, res) => {
    console.log("path not found", req.method, req.url)
    throw new RouteNotFound();
  });

  // add our error handler middleware
  app.use(errorHandler);


  if (config.env != "prod") {
    const all_routes = require('express-list-endpoints');
    console.log(all_routes(app)
      .filter((route: any) => route.path != "*")
      .map((route: any) => route.path + " --> " + route.methods));
  }

}