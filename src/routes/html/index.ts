
import { Router } from 'express';
import login from './login';
import root from './root';
import logout from './logout';
import diary from './diary';
import dailyCourse from './dailyCourse';
import interfoodImport from './interfoodImport';

export default () => {
  const app = Router();
  root(app);
  login(app);
  logout(app);
  diary(app);
  dailyCourse(app)
  interfoodImport(app)
  return app
}
