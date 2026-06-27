import express from 'express';
import { forgotPasswordController, getCurrentUserController, loginUserController, logoutUserController, registerUserController, resendVerificationEmailController, resetPasswordController, updateEmailController, updatePasswordController, verifyUserEmailController } from '../modules/auth/user.auth';
import { requireAuth } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', registerUserController);

router.post('/login', loginUserController);

router.get('/me', requireAuth(), getCurrentUserController);

router.get('/logout', requireAuth(), logoutUserController);

router.get('/verify-email', verifyUserEmailController);

router.post('/resend-verification-email', resendVerificationEmailController);

router.post('/forgot-password', forgotPasswordController);

router.post('/reset-password', resetPasswordController);

router.put('/update-password', requireAuth(), updatePasswordController);

router.put('/update-email', requireAuth(), updateEmailController);

export default router;