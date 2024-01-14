
import { Router } from 'express';
import login from './login';
import root from './root';
import logout from './logout';
import allDiary from './allDiary';
import dailyCourse from './dailyCourse';
import interfoodImport from './interfoodImport';
import main from './main';
import navbar from './navbar';

export default () => {
  const app = Router();
  root(app);
  main(app);
  navbar(app)
  login(app);
  logout(app);
  allDiary(app);
  dailyCourse(app)
  interfoodImport(app)
  return app
}
