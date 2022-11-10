const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
/* const cardRoutes = require('./routes/card');
const userRoutes = require('./routes/user');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/user'); */
const errorHandler = require('./middlewares/error');
const router = require('./routes');
/* const NotFoundError = require('./utils/errors/notFoundError');
const { validateLogin, validateRegister } = require('./utils/validations/userValidation'); */

const app = express();
app.use(express.json());
/* app.post('/signin', validateLogin, login);
app.post('/signup', validateRegister, createUser);
app.use(auth);
app.use('/cards', cardRoutes);
app.use('/users', userRoutes);
app.use('*', () => {
  throw new NotFoundError('Адреса не существует');
}); */
app.use(router);
app.use(errors());
app.use(errorHandler);
mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('DB OK'))
  .catch((error) => console.log(`DB Error: ${error}`));

app.listen(3000, (error) => {
  if (error) {
    console.log(`Server Error: ${error}`);
  } else {
    console.log('Server OK');
  }
});
