import cookieParser from "cookie-parser";
import express from "express";
import config from "../config";
import { RouteNotFound } from "../errors";
import { errorHandler } from "../middlewares";
import routes from "../routes";

// let's initialize our express app
export default ({ app }: { app: express.Application }) => {
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
  app.use(config.api.prefix, routes())

  // catch all route
  app.all('*', (req, res) => {
    throw new RouteNotFound();
  });

  // add our error handler middleware
  app.use(errorHandler);

  const all_routes = require('express-list-endpoints');
  console.log(all_routes(app)
    .filter((route: any) => route.path != "*")
    .map((route: any) => route.path + " --> " + route.methods));

}