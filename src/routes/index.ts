
// import { Router } from 'express';
// import login from './login';
import api from './api';
import html from './html';
// import diary from './diary';
// import logout from './logout';

export default () => {
  // const app = Router();
  api();
  html();
  // diary(app);
  // login(app);
  // logout(app);
  // return app
  return [html(), api()]
}
