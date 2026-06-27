import express from 'express';
import { getCurrentUserController, loginUserController, logoutUserController, registerUserController } from '../modules/auth/auth.controller';
import { resendVerificationEmailController, updateEmailController, verifyUserEmailController } from '../modules/auth/verification.controller';
import { forgotPasswordController, resetPasswordController, updatePasswordController } from '../modules/auth/password.controller';
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
