import { NextFunction, Request, Response, Router } from 'express';
import { isAuthenticated, validateRequest } from '../middlewares';
import { DiaryService, InterfoodService } from '../services';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { addNewEntry, InterfoodImport, IUser, UserPayload } from '../types';
import { body, param, query } from 'express-validator';
import { Prisma, User } from '@prisma/client';
import { InterFoodTypeRepository, UserRepository } from '../repositorys';
import { BadRequest } from '../errors';

const route = Router();

export default (app: Router) => {
  app.use('/interfood', route);

  interface RegisterRequest<T> extends Express.Request {
    body: T
    payload?: UserPayload
  }

  route.post(
    '/import',
    body('data')
      .exists()
      .withMessage("Please add some data to import !").bail()
      .isArray({ min: 0 })
      .withMessage('Data must be an array with at least one element !')
    ,
    validateRequest,
    isAuthenticated,
    async (req: RegisterRequest<{ data: string[], payload: UserPayload }>, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const interFoodTypeInstance = Container.get(InterfoodService);
        const diaryServiceInstance = Container.get(DiaryService);
        const response: InterfoodImport[] = await interFoodTypeInstance.import(req.payload!.userId, req.body.data)

        for (const food of response) {
          await diaryServiceInstance.addNewEntry({ userDTO: { id: food.userId! }, foodPortion: food.foodPortion!, foodProp: food.foodProp!, ...food });
        }

        return res.status(200).json({ ...response, data: req.payload });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });

}