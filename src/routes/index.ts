
import { Router } from 'express';
import auth from './auth';
import diary from './diary';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  diary(app);
  return app
}
