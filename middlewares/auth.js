const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/unathorizedError');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new UnauthorizedError('Необходима авторизация'));
    }
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
