const cardRoutes = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

cardRoutes.delete('/:cardId/likes', dislikeCard);
cardRoutes.put('/:cardId/likes', likeCard);
cardRoutes.get('/', getCards);
cardRoutes.post('/', createCard);
cardRoutes.delete('/:cardId', deleteCard);

module.exports = cardRoutes;
