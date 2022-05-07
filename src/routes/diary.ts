import { Router } from 'express';
import { test, test1 } from '../controllers';
import isAuthenticated from '../middlewares/isAuthenticated';

const router = Router();

router.get('/test', isAuthenticated, test);
router.get('/test1', isAuthenticated, test1);

export default router;