import { NextFunction, Request, Response, Router } from 'express';
import { isAuthenticated, validateRequest } from '../middlewares';
import { DiaryService } from '../services';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { addNewEntry, IUser } from '../types';
import { body, param, query } from 'express-validator';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from '../repositorys';
import { BadRequest } from '../errors';

const route = Router();

export default (app: Router) => {
  app.use('/interfood', route);

  // TODO: id ---> to ---> email or nickname ( id toooo long, like it here: /getEntry/id/:id' )

  route.post(
    '/import',
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

}