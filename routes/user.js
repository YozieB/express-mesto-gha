const userRoutes = require('express').Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  getMe,
} = require('../controllers/user');

userRoutes.get('/', getUsers);
userRoutes.get('/:id', getUser);
userRoutes.patch('/me', updateUser);
userRoutes.patch('/me/avatar', updateUserAvatar);
userRoutes.get('/me', getMe);

module.exports = userRoutes;
