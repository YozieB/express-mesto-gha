const userModel = require('../models/user');
const {
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  INCORRECT_DATA_ERROR_CODE,
  SUCCESS_CREATED_CODE,
} = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    res.status(INCORRECT_DATA_ERROR_CODE).json({
      message: 'Не удалось получить пользователей',
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await userModel.create({ name, about, avatar });
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
    res.status(INCORRECT_DATA_ERROR_CODE).json({
      message: 'Не удалось найти пользователя',
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
module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  updateUserAvatar,
};
