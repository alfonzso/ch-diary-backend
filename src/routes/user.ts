import { NextFunction, Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Prisma, User } from '@prisma/client';
import { validateRequest, isAuthenticated } from '../middlewares';
import { UserService } from '../services/';

import { Container } from 'typedi';
import { Logger } from 'winston';
import { UserPayload } from '../types';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  route.delete(
    '/delete',
    body('email').isEmail().withMessage('Please provide a valid email address'),
    isAuthenticated,
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const userDTO: User = req.body;
        const userServiceInstance = Container.get(UserService);
        const isSucceed = await userServiceInstance.DeletUser(userDTO.email)
        return res.status(200).json({ success: isSucceed, message: "deleted" });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });

  route.get(
    '/getUser',
    // body('email').isEmail().withMessage('Please provide a valid email address'),
    isAuthenticated,
    // validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const userServiceInstance = Container.get(UserService);
        const userData = await userServiceInstance.GetUser((req.payload as UserPayload).email) as Prisma.UserUpdateInput
        delete userData.createdAt
        delete userData.updatedAt
        delete userData.password
        return res.status(200).json({ ...userData });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });
}
