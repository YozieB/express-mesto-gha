const { Joi, celebrate } = require('celebrate');
const { LINK_REG_EXP_PATTERN } = require('../constants');

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateRegister = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(3).max(30),
    about: Joi.string().min(3).max(30),
    avatar: Joi.string().pattern(LINK_REG_EXP_PATTERN),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(3).max(30),
    about: Joi.string().min(3).max(30),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(LINK_REG_EXP_PATTERN),
  }),
});

module.exports = {
  validateAvatar,
  validateLogin,
  validateUserInfo,
  validateUserId,
  validateRegister,
};
