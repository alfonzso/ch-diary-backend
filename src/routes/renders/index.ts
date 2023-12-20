
import { Router } from 'express';
import login from './login';
import root from './root';
import diary from './diary';
import logout from './logout';

export default () => {
  const app = Router();
  root(app);
  diary(app);
  login(app);
  logout(app);
  return app
}
