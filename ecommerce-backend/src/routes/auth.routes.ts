import express from 'express';
import { getCurrentUserController, loginUserController, logoutUserController, registerUserController } from '../modules/auth/auth.controller';
import { resendVerificationEmailController, updateEmailController, verifyUserEmailController } from '../modules/auth/verification.controller';
import { forgotPasswordController, resetPasswordController, updatePasswordController } from '../modules/auth/password.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import passport from '../config/passport.config';
import { googleCallbackController, facebookCallbackController } from '../modules/auth/auth.controller';

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

// GOOGLE OAUTH ROUTES

/**
 * Route: GET /auth/google
 * Initiates Google OAuth flow
 * Redirects user to Google login page
 */
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'], // Request access to user's profile and email
        session: false, // We're using JWT, not sessions
    })
);

/**
 * Route: GET /auth/google/callback
 * Google redirects here after user authenticates
 * Passport exchanges authorization code for user profile
 * Controller generates JWT and redirects to frontend
 */
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/auth/login?error=google_auth_failed`,
    }),
    googleCallbackController
);

// FACEBOOK OAUTH ROUTES

/**
 * Route: GET /auth/facebook
 * Initiates Facebook OAuth flow
 * Redirects user to Facebook login page
 */
router.get(
    '/facebook',
    passport.authenticate('facebook', {
        scope: ['email', 'public_profile'], // Request access to email and public profile
        session: false,
    })
);

/**
 * Route: GET /auth/facebook/callback
 * Facebook redirects here after user authenticates
 * Passport exchanges authorization code for user profile
 * Controller generates JWT and redirects to frontend
 */
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/auth/login?error=facebook_auth_failed`,
    }),
    facebookCallbackController
);

export default router;
