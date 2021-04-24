import Joi from 'joi';
import { password, objectId } from './custome.validation';

export const createUserValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    passwordConfirm: Joi.string().required().custom(password),
    username: Joi.string().required(),
    fullName: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin')
  })
};

export const getUsersValidate = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

export const getUserValidate = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
};

export const updateUserValidate = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId)
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string()
    })
    .min(1)
};

export const deleteUserValidate = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
};
