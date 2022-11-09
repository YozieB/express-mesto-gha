const jwt = require('jsonwebtoken');
const ForbiddenError = require('../utils/errors/forbiddenError');

module.exports = (req, res, next) => {
  let payload;
  try {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    if (!token) {
      return next(new ForbiddenError('Необходима авторизация'));
    }
    payload = jwt.verify(token, 'secret-key');
  } catch (e) {
    return next(new ForbiddenError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
