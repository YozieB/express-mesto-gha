const jwt = require('jsonwebtoken');
const { NOT_FOUND_ERROR_CODE } = require('../utils/constants');
const ForbiddenError = require('../utils/errors/forbiddenError');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new ForbiddenError('Необходима авторизация'));
    }
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    return next(new ForbiddenError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
