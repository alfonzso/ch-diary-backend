import 'reflect-metadata';

import { NextFunction, Request, Response, Router } from 'express';
import { body, cookie } from 'express-validator';
import { User } from '@prisma/client';
import { validateRequest, isAuthenticated } from '../middlewares';
import { AuthService } from '../services/';
import { utilsInstance } from '../utils';

import { Container } from 'typedi';
import { Logger } from 'winston';
import config from '../../config';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  interface RegisterRequest<T> extends Request {
    body: T
  }

  // signup route
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
      const logger: Logger = Container.get('logger');
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

  // signin route
  // router.post('/login', logIn);
  route.post('/login',
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password')
      .not().isEmpty()
      .withMessage('Password cannot be empty'),
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const userDTO: User = req.body;
        const authServiceInstance = Container.get(AuthService);
        const [accessToken, refreshToken] = await authServiceInstance.LogIn(userDTO)
        utilsInstance.sendRefreshToken(res, refreshToken);
        res.json({ accessToken, refreshToken });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });


  route.post('/logout',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {

        res.clearCookie(config.jwtCookieName, {
          httpOnly: true,
          sameSite: true,
          path: '/api/auth',
        });

        res.status(201).json({ success: true, message: 'User logged out successfully' })

      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });

  route.get(
    '/refreshToken',
    cookie(config.jwtCookieName).not().isEmpty().withMessage('Token cannot be empty'),
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      try {
        const refreshToken: string = req.cookies.refresh_token;
        const authServiceInstance = Container.get(AuthService);
        const accessToken = await authServiceInstance.RefreshToken(refreshToken)

        res.json({ accessToken, refreshToken });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });

  // get auth user
  route.get('/authUser', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    try {
      const authServiceInstance = Container.get(AuthService);
      const [isSucceed,] = await authServiceInstance.AuthUser()
      return res.status(200).json({ success: isSucceed, data: req.payload });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });

}
// export default router;
