// import 'reflect-metadata';

import { NextFunction, Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { User } from '@prisma/client';
import { validateRequest, isAuthenticated } from '../middlewares';
import { AuthService, UserService } from '../services/';
// import { myUtilsInstance } from '../utils';

import { Container } from 'typedi';
import { Logger } from 'winston';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  // get auth user
  route.delete(
    '/delete',
    body('email').isEmail().withMessage('Please provide a valid email address'),
    isAuthenticated,
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const userDTO: User = req.body;
        const authServiceInstance = Container.get(UserService);
        const isSucceed = await authServiceInstance.DeletUser(userDTO.email)
        return res.status(200).json({ success: isSucceed, message: "deleted" });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });
}
// export default router;
