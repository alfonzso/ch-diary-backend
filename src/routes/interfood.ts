import { NextFunction, Response, Router } from 'express';
import { isAuthenticated, validateRequest } from '../middlewares';
import { DiaryService, InterfoodService } from '../services';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { InterfoodImport, UserPayload } from '../types';
import { body } from 'express-validator';
import { FailToAddNewEntryError } from '../errors/failToAddNewEntry';

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
        const importedFoodList: InterfoodImport[] = await interFoodTypeInstance.import(req.payload!.userId, req.body.data)

        for (const food of importedFoodList) {
          const { success } = await diaryServiceInstance.addNewEntry({ userDTO: { id: food.userId! }, foodPortion: food.foodPortion!, foodProp: food.foodProp!, ...food });
          if (!success) throw new FailToAddNewEntryError()
        }

        return res.status(200).json({ importedFoodList });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });

}