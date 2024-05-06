// Users.js
const express = require('express');
const router = express.Router();
const dbConnection = require('../db'); // Import the database connection

// Define a route to verify if user exists
router.get('/verify-user', (req, res) => {
  console.log('verifying user', req.query);
  const { username, password } = req.query;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  dbConnection.query(
    'SELECT * FROM Users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error verifying user' });
      }

      if (results.length > 0) {
        // User with the provided username and password exists
        res.json({ exists: true, user: results[0] });
      } else {
        // User with the provided username and password does not exist
        res.json({ exists: false });
      }
    }
  );
});

// Create a new user
router.post('/create-user', (req, res) => {
  const currentDate = new Date();
  const date_registered = currentDate.toISOString().split('T')[0];

  const { username, password, name, email } = req.body;

  console.log('creating user: ', username, password, name, email, date_registered)

  if (!username || !password || !name || !email || !date_registered) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  dbConnection.query(
    'INSERT INTO Users (username, password, name, email, date_registered) VALUES (?, ?, ?, ?, ?)',
    [username, password, name, email, date_registered],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error creating user', result: false });
      }
      res.json({ message: 'User created successfully', result: true });
    }
  );
});

// Retrieve user by username
router.get('/get-user', (req, res) => {
  const username = req.query.username;
  const password = req.query.password
  dbConnection.query(
    'SELECT * FROM Users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error retrieving user' });
      }

      if (results.length > 0) {
        res.json({ user: results[0] });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  );
});

// Update user by username
router.put('/update-user', (req, res) => {
  const username = req.query.username;
  const { password, name, email } = req.body;

  console.log('update user', username, req.body)

  if (!username || !password || !name || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  dbConnection.query(
    'UPDATE Users SET password = ?, name = ?, email = ? WHERE username = ?',
    [password, name, email, username],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error updating user' });
      }

      res.json({ message: 'User updated successfully', result: true });
    }
  );
});

// Delete user by username
router.delete('/delete-user', (req, res) => {
  const { username, password } = req.params;

  dbConnection.query(
    'DELETE FROM Users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error deleting user' });
      }
      else {
        dbConnection.query(
          'DELETE FROM Expenses WHERE username = ?',
          [username],
          (err, results) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Error deleting user' });
            }
            res.json({ message: 'User Deleted successfully and Expenses Deleted Too', result: true });
          }
        );
      }
    }
  );
});

router.put('/update-categories', (req, res) => {
  const { categories } = req.body;
  const username = req.query.username;
  //console.log(req)
  
  console.log('update categories', username, categories)
  dbConnection.query(
    'UPDATE Users SET categories = ? WHERE username = ?',
    [categories.join(','), username],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error updating categories' });
      }
      res.json({ message: 'Categories updated successfully', result: true });
    }
  )
});

router.get('/get-categories', (req, res) => {
  const username = req.query.username;
  dbConnection.query(
    'SELECT categories FROM Users WHERE username = ?',
    [username],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error retrieving categories' });
      }
      if (results.length > 0) {
        console.log('categories: ', results[0].categories? results[0].categories.split(',') : [])
        res.json({ categories: results[0].categories? results[0].categories.split(',') : [] });;
      }
      else {
        res.status(404).json({ error: 'User not found' });
      }
    })
});

module.exports = router;
