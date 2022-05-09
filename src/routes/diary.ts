import { Router } from 'express';
import { test, test1 } from '../controllers';
import { isAuthenticated } from '../middlewares/';

const route = Router();

export default (app: Router) => {
  app.use('/diary', route);
  route.get('/test', isAuthenticated, test);
  route.get('/test1', isAuthenticated, test1);
}