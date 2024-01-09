
import { Router } from 'express';
import login from './login';
import root from './root';
import logout from './logout';
import diary from './diary';
import dailyCourse from './dailyCourse';

export default () => {
  const app = Router();
  root(app);
  login(app);
  logout(app);
  diary(app);
  dailyCourse(app)
  return app
}
