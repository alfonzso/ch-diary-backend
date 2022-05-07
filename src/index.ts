import express from 'express';
import 'express-async-errors';
import { RouteNotFound } from './errors/routeNotFound';
import errorHandler from './middlewares/error-handler';
import authRoutes from './routes/auth';
import diaryRoutes from './routes/diary';
import cookieParser from "cookie-parser";

const port = process.env.PORT || 8080;

// let's initialize our express app
const app = express();


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

// add our routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/diary', diaryRoutes);

// catch all route
app.all('*', async () => {
  throw new RouteNotFound();
});

// add our error handler middleware
app.use(errorHandler);

// listen to our express app
app.listen(port, () => {
  console.log(`Our Application is up and running on port ${port}`);
});
