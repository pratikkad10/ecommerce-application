import express from 'express';
import { getCurrentUserController, loginUserController, logoutUserController, registerUserController } from '../modules/auth/user.auth';
import { requireAuth } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', registerUserController);

router.post('/login', loginUserController);

router.get('/me', requireAuth(), getCurrentUserController);

router.get('/logout', requireAuth(), logoutUserController);

export default router;