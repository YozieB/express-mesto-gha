const cardRoutes = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');
const { validateCardId, validateCard } = require('../utils/validations/cardValidation');

cardRoutes.delete('/:cardId/likes', validateCardId, dislikeCard);
cardRoutes.put('/:cardId/likes', validateCardId, likeCard);
cardRoutes.get('/', getCards);
cardRoutes.post('/', validateCard, createCard);
cardRoutes.delete('/:cardId', validateCardId, deleteCard);

module.exports = cardRoutes;
