const userRoutes = require('express').Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  getMe,
} = require('../controllers/user');
const { validateUserId, validateUserInfo, validateAvatar } = require('../utils/validations/userValidation');

userRoutes.get('/', getUsers);
userRoutes.get('/:id', validateUserId, getUser);
userRoutes.patch('/me', validateUserInfo, updateUser);
userRoutes.patch('/me/avatar', validateAvatar, updateUserAvatar);
userRoutes.get('/me', getMe);

module.exports = userRoutes;
