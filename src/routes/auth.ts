import { User } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { authUser, refreshToken, register } from '../controllers';
import { validateRequest, isAuthenticated } from '../middlewares';
import AuthService from '../services/auth';
import { myUtilsInstance } from '../utils';

import { Container } from 'typedi';
import { Logger } from 'winston';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  // signup route
  route.post(
    '/register',
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 4, max: 24 })
      .withMessage('Ensure password is between 4 and 24 characters'),
    validateRequest,
    register
  );

  // signin route
  // router.post('/login', logIn);
  route.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    try {
      const userDTO: User = req.body;
      const authServiceInstance = Container.get(AuthService);
      const [accessToken, refreshToken] = await authServiceInstance.LogIn(userDTO)
      myUtilsInstance.sendRefreshToken(res, refreshToken);
      res.json({
        accessToken,
        refreshToken
      });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });

  route.get('/refreshToken', refreshToken);

  // get auth user
  route.get('/auth-user', isAuthenticated, authUser);
}
// export default router;
