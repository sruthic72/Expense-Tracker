CREATE DATABASE IF NOT EXISTS ExpenseTrackerDB;
USE ExpenseTrackerDB;
DROP PROCEDURE IF EXISTS InsertDummyExpenses;
DROP TABLE IF EXISTS Expenses;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    username VARCHAR(50) PRIMARY KEY UNIQUE,
    password VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    date_registered DATE,
    categories TEXT
);

CREATE TABLE Expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    amount DECIMAL(10, 2) NOT NULL,
    category TEXT,
    date DATE NOT NULL,
    description TEXT,
    FOREIGN KEY(username) REFERENCES users(username)
);


-- Insert dummy users
INSERT INTO Users (username, password, name, email, date_registered, categories)
VALUES
    ('user1', 'password1', 'User One', 'user1@example.com', '2023-01-01', 'food and dining,transportation,housing,utilities,entertainment and leisure'),
    ('user2', 'password2', 'User Two', 'user2@example.com', '2022-02-15', 'food and dining,transportation,housing,utilities,entertainment and leisure'),
    ('user3', 'password3', 'User Three', 'user3@example.com', '2021-05-10','food and dining,transportation,housing,utilities,entertainment and leisure'),
    ('user4', 'password4', 'User Four', 'user4@example.com', '2020-08-20', 'food and dining,transportation,housing,utilities,entertainment and leisure'),
    ('user5', 'password5', 'User Five', 'user5@example.com', '2019-12-31', 'food and dining,transportation,housing,utilities,entertainment and leisure');

-- Insert 1000 expenses for each user
DELIMITER //

CREATE PROCEDURE InsertDummyExpenses()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE userIndex INT DEFAULT 0;
    DECLARE categoryIndex INT DEFAULT 0;
    DECLARE category VARCHAR(255);
    DECLARE categories VARCHAR(255);
    
    SET categories = 'food and dining,transportation,housing,utilities,entertainment and leisure';
    
    WHILE userIndex < 5 DO
        SET i = 0;
        WHILE i < 1000 DO
			-- Select a random category
            SET categoryIndex = ROUND(RAND() * 4) + 1;
            SET category = SUBSTRING_INDEX(SUBSTRING_INDEX(categories, ',', categoryIndex), ',', -1);
            
            INSERT INTO Expenses (username, amount, date, description, category)
            VALUES (
                CONCAT('user', userIndex + 1),
                RAND() * 1000,  -- Random amount between 0 and 1000
                DATE_ADD('2021-01-01', INTERVAL RAND() * 1300 DAY), -- Random date between 2020-01-01 and 2024-3-31
                CONCAT('Expense ', i + 1),
                category
            );
            SET i = i + 1;
        END WHILE;
        SET userIndex = userIndex + 1;
    END WHILE;
    
END //

DELIMITER ;
CALL InsertDummyExpenses();


SELECT category, COUNT(*) AS count FROM Expenses WHERE username = 'user1' GROUP BY category ;