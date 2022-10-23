const express = require('express');
const mongoose = require('mongoose');
const cardRoutes = require('./routes/card');
const userRoutes = require('./routes/user');
const { NOT_FOUND_ERROR_CODE } = require('./utils/constants');
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6351a91312e73f3fa046dce8',
  };

  next();
});
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
