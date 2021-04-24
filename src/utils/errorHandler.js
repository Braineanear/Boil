import mongoose from 'mongoose';
import config from '../config/config';
import AppError from './appError';

export const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof AppError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;
    const { message } = error;
    error = new AppError(statusCode, message);
  }
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;
  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack })
  };

  res.status(statusCode).json({
    response
  });
};
