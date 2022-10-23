const cardModel = require('../models/card');
const {
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  INCORRECT_DATA_ERROR_CODE,
  SUCCESS_CREATED_CODE,
} = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await cardModel.find();
    if (cards.length === 0) {
      return res.status(NOT_FOUND_ERROR_CODE).json({
        message: 'Карточки не найдены',
      });
    }
    res.json(cards);
  } catch (error) {
    res.status(DEFAULT_ERROR_CODE).json({
      message: 'Не удалось получить пользователей',
    });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await cardModel.create({ name, link, owner: req.user._id });
    res.status(SUCCESS_CREATED_CODE).json({ card });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(INCORRECT_DATA_ERROR_CODE).json({
        message: 'Переданы некорректные данные',
      });
    }
    res.status(DEFAULT_ERROR_CODE).json({
      message: 'Не удалось создать карточку',
    });
  }
};

const deleteCard = async (req, res) => {
  try {
    const cardToRemove = await cardModel.findByIdAndRemove(req.params.cardId);
    if (!cardToRemove) {
      return res.status(NOT_FOUND_ERROR_CODE).json({
        message: 'Карточка с таким id не найдена',
      });
    }
    res.json({
      message: 'Карточка удалена',
    });
  } catch (error) {
    res.status(INCORRECT_DATA_ERROR_CODE).json({
      message: 'Не удалось удалить карточку',
    });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await cardModel.findByIdAndUpdate(
      req.params.cardId,
      {
        $addToSet: { likes: req.user._id },
      },
      {
        new: true,
      },
    );
    if (!card) {
      return res.status(NOT_FOUND_ERROR_CODE).json({
        message: 'Карточка с таким id не найдена',
      });
    }
    res.status(SUCCESS_CREATED_CODE).json({
      message: 'success',
      card,
    });
  } catch (error) {
    res.status(INCORRECT_DATA_ERROR_CODE).json({
      message: 'Не удалось поставить лайк',
    });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await cardModel.findByIdAndUpdate(
      req.params.cardId,
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      },
    );
    if (!card) {
      return res.status(NOT_FOUND_ERROR_CODE).json({
        message: 'Карточка с таким id не найдена',
      });
    }
    res.json({
      message: 'success',
      card,
    });
  } catch (error) {
    res.status(INCORRECT_DATA_ERROR_CODE).json({
      message: 'Не удалось снять лайк',
    });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
