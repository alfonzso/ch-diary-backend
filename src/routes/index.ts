
import { Router } from 'express';
import { userInfo } from 'os';
import auth from './auth';
import diary from './diary';
import user from './user';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  diary(app);
  user(app);
  return app
}
