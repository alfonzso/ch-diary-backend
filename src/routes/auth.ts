import { User } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { authUser, refreshToken, register } from '../controllers';
import { validateRequest, isAuthenticated } from '../middlewares';
import AuthService from '../services/auth';
import { sendRefreshToken } from '../utils';

import { Container } from 'typedi';
import { Logger } from 'winston';

const router = Router();

// signup route
router.post(
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
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const logger: Logger = Container.get('logger');
  try {
    const userDTO: User = req.body;
    const authServiceInstance = Container.get(AuthService);
    // const authServiceInstance = new AuthService()
    const [accessToken, refreshToken] = await authServiceInstance.LogIn(userDTO)
    sendRefreshToken(res, refreshToken);
    res.json({
      accessToken,
      refreshToken
    });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
});

router.get('/refreshToken', refreshToken);

// get auth user
router.get('/auth-user', isAuthenticated, authUser);

export default router;
