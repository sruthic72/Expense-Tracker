const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const db = require('./db')
const usersRouter = require('./Users/users_crud_eps');
const expensesRouter = require('./User_Expenses/users_expenses_eps');

app.use('/users', usersRouter);
app.use('/expenses', expensesRouter);

app.get('', (req, res) => {
  const response = { message: 'Hello, World!' };
  res.json(response);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
