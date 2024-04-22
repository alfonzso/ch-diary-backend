import { Router } from 'express';
import auth from './v1/auth';
import user from './v1/user';
// import { userInfo } from 'os';
// import auth from './auth';
// import diary from './diary';
// import interfood from './interfood';
// import user from './user';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  // diary(app);
  user(app);
  // interfood(app);
  return app
}