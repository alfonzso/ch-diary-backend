import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import express from "express";
import config from "../../config";
import { RouteNotFound } from "../errors";
import { errorHandler } from "../middlewares";
import { handleAuth, handleGlobals } from "../middlewares/handleAuth";
import { engine } from 'express-handlebars';
import html from "../routes/html";
import { htmxFolderConfigMap } from "../../config/htmxFolderConfigMap";
import path from "path";
import routes from "../routes";
import api from "../routes/api";


export default ({ app }: { app: express.Application }) => {

  app.use(express.static('./src/views'))

  app.set('trust proxy', 1)
  app.use(cookieParser());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(handleAuth);
  app.use(handleGlobals);

  // app.set('views', './src/views');
  app.set('views', path.join(__dirname, '..', 'views'));


  app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: false,
    helpers: {
      dynamicPage() { return htmxFolderConfigMap.components.wellcome.replace("./partials/", ""); }
    },
  }));
  app.set('view engine', '.hbs');

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

  app.use(config.api.prefix, api())
  app.use('/', html())

  // add our routes
  // app.use(config.api.prefix, routes())

  // catch all route
  app.all('*', (req, res) => {
    console.log("path not found", req.method, req.url)
    // throw new RouteNotFound();
    let render = {
      file: './partials/main', ops: {
        layout: 'index', helpers: {
          dynamicPage() { return 'errors/404'; }
        },
      }
    }

    // res.render(render.file, render.ops)
    res.render(render.file, { ...render.ops, ...req.GlobalTemplates })

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