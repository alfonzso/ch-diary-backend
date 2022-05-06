import { Router } from 'express';
import { body } from 'express-validator';
import { authUser, logIn, refreshToken, register } from '../controllers';
import isAuthenticated from '../middlewares/isAuthenticated';
import { validateRequest } from '../middlewares/validate-request';

// import { NextFunction, Request, Response } from 'express';

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
router.post('/login', logIn);

router.post('/refreshToken', refreshToken);

// get auth user
router.get('/auth-user', isAuthenticated, authUser);

export default router;
