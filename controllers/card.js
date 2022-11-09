const cardModel = require('../models/card');
const { SUCCESS_CREATED_CODE } = require('../utils/constants');
const BadRequestError = require('../utils/errors/badRequestError');
const NotFoundError = require('../utils/errors/notFoundError');
const ForbiddenError = require('../utils/errors/forbiddenError');

const getCards = async (req, res, next) => {
  try {
    const cards = await cardModel.find();
    res.json(cards);
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await cardModel.create({ name, link, owner: req.user._id });
    res.status(SUCCESS_CREATED_CODE).json({ card });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданые некорректные данные'));
    } else {
      next(error);
    }
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const cardToRemove = await cardModel.findById(req.params.cardId);
    if (!cardToRemove) {
      throw new NotFoundError('Карточка с таким id не найдена');
    }
    if (cardToRemove.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Нельзя удалять чужие карточки');
    }
    const removableCard = await cardModel.findByIdAndRemove(req.params.cardId);
    res.json({
      message: 'Карточка удалена',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(error);
    }
  }
};

const likeCard = async (req, res, next) => {
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
      throw new NotFoundError('Карточка с таким id не найдена');
    }
    res.status(SUCCESS_CREATED_CODE).json({
      message: 'success',
      card,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(error);
    }
  }
};

const dislikeCard = async (req, res, next) => {
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
      throw new NotFoundError('Карточка с таким id не найдена');
    }
    res.json({
      message: 'success',
      card,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(error);
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
