
import { Router } from 'express';
import login from './register';
import pug from "pug";
import { isAuthenticated, refreshToAccess } from '../../middlewares/jwtHandler';
import root from './root';
import diary from './diary';

// import { userInfo } from 'os';
// import auth from './auth';
// import diary from './diary';
// import interfood from './interfood';
// import user from './user';

// function logOriginalUrl (req, res, next) {
//   console.log('Request URL:', req.originalUrl)
//   next()
// }

// function logMethod (req, res, next) {
//   console.log('Request Type:', req.method)
//   next()
// }


// guaranteed to get dependencies
export default () => {
  const app = Router();
  root(app);
  diary(app);
  login(app);
  return app
}
