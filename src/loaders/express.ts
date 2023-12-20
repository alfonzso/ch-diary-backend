import cookieParser from "cookie-parser";
// import expressLayouts from "express-ejs-layouts";
import bodyParser from 'body-parser';

import express from "express";
import config from "../../config";
import { RouteNotFound } from "../errors";
import { errorHandler } from "../middlewares";
import routes from "../routes";
import renders from "../routes/renders";
import path from "path";
import { checkUsers } from "../middlewares/checkUser";

// let's initialize our express app
export default ({ app }: { app: express.Application }) => {
  app.use(checkUsers);

  app.use(express.static('./src/views'))

  // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

  app.set('trust proxy', 1)
  app.use(cookieParser());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.urlencoded({ extended: true }));

  // app.use(expressLayouts);
  app.set('views', './src/views');
  // app.set('views', path.join(__dirname, '/src/views'));
  // app.engine('html', require('ejs').renderFile);
  // app.set('view engine', 'ejs');

  // const pug = require("pug");

  app.set("view engine", "pug");

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
  app.use('/', renders())

  // add our routes
  app.use(config.api.prefix, routes())

  // catch all route
  app.all('*', (req, res) => {
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