import { NextFunction, Request, Response, Router } from 'express';
import { isAuthenticated, validateRequest } from '../middlewares';
import { DiaryService } from '../services/';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { addNewEntry, IUser } from '../types';
import { body, param, query } from 'express-validator';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from '../repositorys';
import { BadRequest } from '../errors';

const route = Router();

export default (app: Router) => {
  app.use('/diary', route);

  // TODO: id ---> to ---> email or nickname ( id toooo long, like it here: /getEntry/id/:id' )

  route.post(
    '/addNewEntry',
    body('userDTO.id').not().isEmpty(),
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const diaryServiceInstance = Container.get(DiaryService);
        const newEntry: addNewEntry = req.body
        const response = await diaryServiceInstance.addNewEntry(newEntry)

        return res.status(200).json({ ...response, data: req.payload });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });

  route.get(
    '/getEntry/nickname/:nickname',
    param('nickname').not().isEmpty().withMessage('id needed!'),
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const diaryServiceInstance = Container.get(DiaryService);
        const user = await Container.get(UserRepository).findUserByNickName(req.params.nickname as string)
        if (!user) throw new BadRequest('Nick not exists')
        console.log(user)
        const response = await diaryServiceInstance.getEntryByUserId(user)

        return res.status(200).json({ ...response });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });

  route.get(
    '/getEntry/nickname/:nickname/date/:date',
    param('nickname').not().isEmpty().withMessage('id needed!'),
    param('date').not().isEmpty().withMessage('date needed!'),
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const diaryServiceInstance = Container.get(DiaryService);
        const user = await Container.get(UserRepository).findUserByNickName(req.params.nickname as string)
        if (!user) throw new BadRequest('Nick not exists')
        const date: Date = new Date(req.params.date as string)
        const response = await diaryServiceInstance.getEntryByUserNickNameAndDate(user, date)

        return res.status(200).json({ ...response });
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