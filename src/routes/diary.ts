import { NextFunction, Request, Response, Router } from 'express';
import { isAuthenticated } from '../middlewares';
import { DiaryService } from '../services/';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { addNewEntry } from '../types';

const route = Router();

export default (app: Router) => {
  app.use('/diary', route);

  // route.post('/addNewEntry', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  route.post('/addNewEntry', async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    try {
      const diaryServiceInstance = Container.get(DiaryService);
      const newEntry: addNewEntry = req.body
      const response = await diaryServiceInstance.AddNewEntry(newEntry)
      
      return res.status(200).json({ ...response, data: req.payload });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });
  route.get('/test', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    try {
      const authServiceInstance = Container.get(DiaryService);
      const response = await authServiceInstance.Test()
      return res.status(200).json({ ...response, data: req.payload });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });

  route.get('/test1', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    try {
      const authServiceInstance = Container.get(DiaryService);
      const response = await authServiceInstance.Test1()
      return res.status(200).json({ ...response, data: req.payload });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });
}