import express from 'express';
import { getCurrentUserController, loginUserController, logoutUserController, registerUserController } from '../modules/auth/user.auth';


const router = express.Router();

router.post('/register', registerUserController);

router.post('/login', loginUserController);

router.get('/me', getCurrentUserController);

router.get('/logout', logoutUserController);

export default router;