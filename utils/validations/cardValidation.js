const { Joi, celebrate } = require('celebrate');
const { LINK_REG_EXP_PATTERN } = require('../constants');

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(LINK_REG_EXP_PATTERN),
  }),
});

module.exports = {
  validateCard,
  validateCardId,
};
