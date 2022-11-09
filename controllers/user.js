const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const { SUCCESS_CREATED_CODE } = require('../utils/constants');
const BadRequestError = require('../utils/errors/badRequestError');
const NotFoundError = require('../utils/errors/notFoundError');
const ConflictError = require('../utils/errors/conflictError');
const UnauthorizedError = require('../utils/errors/unathorizedError');

const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.status(SUCCESS_CREATED_CODE).json({ user });
  } catch (error) {
    if (error.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    }
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('Пользователь с таким id не найден');
    }
    res.json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    res.json({ user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    next(error);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        avatar,
      },
      { new: true, runValidators: true },
    );
    res.json({ user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
      expiresIn: '7d',
    });
    res.json({
      token,
    });
  } catch (error) {
    next(new UnauthorizedError('Неправильные почта или пароль'));
  }
};
const getMe = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ _id: req.user._id });
    res.json(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    next(error);
  }
};
module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  updateUserAvatar,
  login,
  getMe,
};
