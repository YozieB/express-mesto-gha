const userRoutes = require('express').Router();
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/user');

userRoutes.get('/', getUsers);
userRoutes.post('/', createUser);
userRoutes.get('/:id', getUser);
userRoutes.patch('/me', updateUser);
userRoutes.patch('/me/avatar', updateUserAvatar);

module.exports = userRoutes;
