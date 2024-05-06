// Database connection

const mysql = require('mysql2');
const db = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'rootpassword',
    database: 'ExpenseTrackerDB'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

module.exports = db;

/*
CREATE DATABASE IF NOT EXISTS ExpenseTrackerDB;
USE ExpenseTrackerDB;

DROP TABLE IF EXISTS Expenses;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    username VARCHAR(50) PRIMARY KEY UNIQUE,
    password VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    date_registered DATE
);

CREATE TABLE Expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    FOREIGN KEY(username) REFERENCES users(username)
);
*/