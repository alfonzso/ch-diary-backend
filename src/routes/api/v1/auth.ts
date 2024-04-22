import 'reflect-metadata';

import { NextFunction, Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { User } from '@prisma/client';
import winston from 'winston';
import { validateRequest } from '../../../middlewares';
import { AuthService } from '../../../services';
import { utilsInstance } from '../../../utils';
import Container from 'typedi';


const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  interface RegisterRequest<T> extends Request {
    body: T
  }

  route.post(
    '/register',

    body('nickname')
      .exists()
      .withMessage('Ensure nickname is not empty')
      .bail()
      .isLength({ min: 1, max: 24 })
      .withMessage('Ensure nickname lenght greater than 1'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 4, max: 24 })
      .withMessage('Ensure password is between 4 and 24 characters'),
    validateRequest
    ,
    // async (req: TypedRequestBody<User>, res: Response, next: NextFunction) => {
    async (req: RegisterRequest<User>, res: Response, next: NextFunction) => {
      const logger: winston.Logger = Container.get('logger');
      try {
        const userDTO: User = req.body;
        const authServiceInstance = Container.get(AuthService);
        const [accessToken, refreshToken] = await authServiceInstance.Register(userDTO)
        utilsInstance.sendRefreshToken(res, refreshToken);
        res.status(201).json({
          success: true, data: {
            accessToken,
            refreshToken,
          }
        });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });
}