const router = require('express').Router();
const cardRoutes = require('./card');
const userRoutes = require('./user');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/user');
const NotFoundError = require('../utils/errors/notFoundError');
const { validateLogin, validateRegister } = require('../utils/validations/userValidation');

router.post('/signin', validateLogin, login);
router.post('/signup', validateRegister, createUser);
router.use(auth);
router.use('/cards', cardRoutes);
router.use('/users', userRoutes);
router.use('*', () => {
  throw new NotFoundError('Адреса не существует');
});

module.exports = router;
