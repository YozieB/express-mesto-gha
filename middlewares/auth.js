const jwt = require('jsonwebtoken');
const { NOT_FOUND_ERROR_CODE } = require('../utils/constants');

module.exports = (req, res, next) => {
  let payload;
  try {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    if (!token) {
      return res
        .status(NOT_FOUND_ERROR_CODE)
        .json({ message: 'Необходима авторизация' });
    }
    payload = jwt.verify(token, 'secret-key');
  } catch (e) {
    return res
      .status(NOT_FOUND_ERROR_CODE)
      .json({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
