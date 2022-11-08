const express = require('express');
const mongoose = require('mongoose');
const cardRoutes = require('./routes/card');
const userRoutes = require('./routes/user');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/user');
const { NOT_FOUND_ERROR_CODE } = require('./utils/constants');

const app = express();
app.use(express.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/cards', cardRoutes);
app.use('/users', userRoutes);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).json({
    message: 'Адреса не существует',
  });
});
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
