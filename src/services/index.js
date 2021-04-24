import {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail
} from './auth.service';
import {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail
} from './email.service';
import {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
} from './token.service';
import {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
} from './user.service';

const authService = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail
};
const emailService = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail
};
const tokenService = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
};
const userService = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
};

export { authService, emailService, tokenService, userService };
