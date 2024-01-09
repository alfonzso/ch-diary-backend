
import { Router } from 'express';
import login from './login';
import root from './root';
import logout from './logout';
import diary from './diary';
import daily_course from './daily_course';

export default () => {
  const app = Router();
  root(app);
  login(app);
  logout(app);
  diary(app);
  daily_course(app)
  return app
}
