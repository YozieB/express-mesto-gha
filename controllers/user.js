const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const {
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  INCORRECT_DATA_ERROR_CODE,
  SUCCESS_CREATED_CODE,
  UNAUTHORIZED_ERROR_CODE,
} = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({
      message: 'Произошла ошибка на сервере',
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar, email, password } = req.body;
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
    if (error.name === 'ValidationError') {
      return res.status(INCORRECT_DATA_ERROR_CODE).json({
        message: 'Переданы некорректные данные',
      });
    }
    res.status(DEFAULT_ERROR_CODE).json({
      message: 'Не удалось создать пользователя',
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(NOT_FOUND_ERROR_CODE).json({
        message: 'Пользователь с таким id не найден',
      });
    }
    res.json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(INCORRECT_DATA_ERROR_CODE).json({
        message: 'Переданы некорректные данные',
      });
    }
    res.status(DEFAULT_ERROR_CODE).json({
      message: 'Произошла ошибка на сервере',
    });
  }
};

const updateUser = async (req, res) => {
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
      return res.status(INCORRECT_DATA_ERROR_CODE).json({
        message: 'Переданы некорректные данные',
      });
    }
    res.status(DEFAULT_ERROR_CODE).json({
      message: 'Не удалось обновить данные пользователя',
    });
  }
};

const updateUserAvatar = async (req, res) => {
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
      return res.status(INCORRECT_DATA_ERROR_CODE).json({
        message: 'Переданы некорректные данные',
      });
    }
    res.status(DEFAULT_ERROR_CODE).json({
      message: 'Не удалось обновить данные пользователя',
    });
  }
};
const login = async (req, res) => {
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
    res.status(UNAUTHORIZED_ERROR_CODE).json({
      message: 'Неправильные почта или пароль',
    });
  }
};
const getMe = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.user._id });
    res.json(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(INCORRECT_DATA_ERROR_CODE).json({
        message: 'Переданы некорректные данные',
      });
    }
    return res.status(DEFAULT_ERROR_CODE).json({
      message: 'Не удалось получить данные пользователя',
    });
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
