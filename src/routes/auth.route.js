import express from 'express';
import passport from 'passport';

import validate from '../middlewares/validate';
import auth from '../middlewares/auth';
import {
  registerValidate,
  loginValidate,
  logoutValidate,
  refreshTokensValidate,
  forgotPasswordValidate,
  resetPasswordValidate,
  verifyEmailValidate
} from '../validations/auth.validation';
import {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', validate(registerValidate), register);
router.post('/login', validate(loginValidate), login);
router.post('/logout', validate(logoutValidate), logout);
router.post('/refresh-tokens', validate(refreshTokensValidate), refreshTokens);
router.post(
  '/forgot-password',
  validate(forgotPasswordValidate),
  forgotPassword
);
router.post('/reset-password', validate(resetPasswordValidate), resetPassword);
router.post('/send-verification-email', auth(), sendVerificationEmail);
router.post('/verify-email', validate(verifyEmailValidate), verifyEmail);

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
  })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/',
    session: false
  }),
  (req, res) => {
    console.log(req.user);
  }
);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  }),
  (req, res) => {
    console.log(req.user);
  }
);

export default router;
