const express = require('express');
const router = express.Router();
const dbConnection = require('../db'); // Import the database connection

// Get all expenses of a user using username
router.get('/get-expenses-of-user', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    dbConnection.query(
        'SELECT * FROM Expenses WHERE username = ? ORDER BY date DESC;',
        [username],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error fetching expenses' });
            }

            res.json(results);
        }
    );
});

// Update an expense of a user using expense_id and username
router.put('/update-expense-of-user', (req, res) => {
    const { username } = req.query
    const expense = req.body;
    //REMOVE expense_id
    console.log('editing expense ', req.body)
    const expense_id = expense.expense_id
    delete expense.expense_id
    dbConnection.query(
        'UPDATE Expenses SET ? WHERE id = ? AND username = ?',
        [expense, expense_id, username],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error updating expense' });
            }

            res.json({ message: 'Expense updated successfully' });
        }
    );
});

// Add an expense of a user using username
router.post('/add-expense-of-user', (req, res) => {
    const { username, amount, date, description, category } = req.body;

    if (!username || !amount || !date) {
        return res.status(400).json({ error: 'Username, amount, and date are required' });
    }

    dbConnection.query(
        'INSERT INTO Expenses (username, amount, date, description, category) VALUES (?, ?, ?, ?, ?)',
        [username, amount, date, description, category],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error adding expense' });
            }

            res.json({ message: 'Expense added successfully', expenseId: results.insertId });
        }
    );
});

// Delete an expense of a user using expense_id and username
router.delete('/delete-expense-of-user', (req, res) => {

    const { expense_id, username } = req.query;
    //console.log(req)
    console.log('deleteing ', expense_id, username)
    if (!expense_id || !username) {
        return res.status(400).json({ error: 'Expense ID and username are required' });
    }

    dbConnection.query(
        'DELETE FROM Expenses WHERE id = ? AND username = ?',
        [expense_id, username],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error deleting expense' });
            }

            res.json({ message: 'Expense deleted successfully', result: true });
        }
    );
});

// Get all expenses of a user in a date range using username and date ranges
router.get('/get-expenses-of-user-daterange', (req, res) => {
    const { username, startDate, endDate } = req.query;

    if (!username || !startDate || !endDate) {
        return res.status(400).json({ error: 'Username, start date, and end date are required' });
    }

    dbConnection.query(
        'SELECT * FROM Expenses WHERE username = ? AND date BETWEEN ? AND ?',
        [username, startDate, endDate],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error fetching expenses in date range' });
            }

            res.json(results);
        }
    );
});

// Define the endpoint to get the accumulated expenses
router.get('/get-accumulated-expenses', (req, res) => {

    //console.log(req)
    const { username, days } = req.query;
    console.log('accumulated expenses of ', username, ' of ', days)
    // Calculate the date 'n' days ago from the current date
    const currentDate = new Date();
    const nDaysAgo = new Date(currentDate - days * 24 * 60 * 60 * 1000);


    // Execute the SQL query to accumulate expenses
    dbConnection.query(
        'SELECT SUM(amount) AS total FROM Expenses WHERE username = ? AND date >= ?',
        [username, nDaysAgo],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error retrieving accumulated expenses' });
            }

            // Extract the total accumulated value from the query results
            const totalValue = results[0].total || 0;

            res.json({ accumulatedExpenses: totalValue });
        }
    );
});

// Define the endpoint to get expenses in previous n months
router.get('/get-expenses-previous-months', (req, res) => {

    //console.log(req)
    const username = req.query.username
    const n = parseInt(req.query.months);
    console.log('get-expenses-previous-months ', username, n)


    if (isNaN(n) || n < 1) {
        return res.status(400).json({ error: 'Invalid number of months' });
    }

    // Get the current date
    const currentDate = new Date();

    // Create an array to store the results for each month
    const results = {};

    // Loop through the previous n months
    for (let i = 0; i < n; i++) {
        // Calculate the start and end date for the current month
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);

        // Format the month-year as 'month-year' (e.g., 'December-2023')
        const monthYear = `${startOfMonth.toLocaleString('en-US', { month: 'long' })}-${startOfMonth.getFullYear()}`;

        // Execute the SQL query to get expenses for the current month
        dbConnection.query(
            'SELECT SUM(amount) AS total FROM Expenses WHERE date >= ? AND date <= ? and username = ?',
            [startOfMonth, endOfMonth, username],
            (err, queryResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error retrieving expenses' });
                }

                // Extract the total expenses for the current month
                const totalValue = queryResults[0].total || 0;

                // Add the result to the results object
                results[monthYear] = totalValue;

                // If we have collected results for all requested months, send the response
                if (Object.keys(results).length === n) {
                    res.json(results);
                }
            }
        );
    }
});

// Define the endpoint to get expenses for previous n years
router.get('/get-expenses-previous-years', (req, res) => {
    //console.log(req)
    const username = req.query.username
    const n = parseInt(req.query.years);
    console.log('get-expenses-previous-years ', username, n)

    if (isNaN(n) || n < 1) {
        return res.status(400).json({ error: 'Invalid number of years' });
    }

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Create an array to store the results for each year
    const results = {};

    // Loop through the previous n years
    for (let i = 0; i < n; i++) {
        const year = currentYear - i;

        // Execute the SQL query to get expenses for the current year
        dbConnection.query(
            'SELECT SUM(amount) AS total FROM Expenses WHERE YEAR(date) = ? AND username = ?',
            [year, username],
            (err, queryResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error retrieving expenses' });
                }

                // Extract the total expenses for the current year
                const totalValue = queryResults[0].total || 0;

                // Add the result to the results object
                results[year] = totalValue;

                // If we have collected results for all requested years, send the response
                if (Object.keys(results).length === n) {
                    res.json(results);
                }
            }
        );
    }
});

// Define the endpoint to get expenses for previous n days
router.get('/get-expenses-previous-days', (req, res) => {
    const username = req.query.username
    const n = parseInt(req.query.years);
    console.log('get-expenses-previous-days ', username, n)

    if (isNaN(n) || n < 1) {
        return res.status(400).json({ error: 'Invalid number of days' });
    }

    // Get the current date
    const currentDate = new Date();

    // Create an array to store the results for each date
    const results = {};

    // Loop through the previous n days
    for (let i = 0; i < n; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);

        // Format the date as day-month-year (e.g., 12-Dec-2023)
        const formattedDate = `${date.getDate()}-${date.toLocaleString('en-US', { month: 'short' })}-${date.getFullYear()}`;

        // Execute the SQL query to get expenses for the current date
        dbConnection.query(
            'SELECT SUM(amount) AS total FROM Expenses WHERE DATE(date) = ? AND username = ?',
            [date.toISOString().split('T')[0], username],
            (err, queryResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error retrieving expenses' });
                }

                // Extract the total expenses for the current date
                const totalValue = queryResults[0].total || 0;

                // Add the result to the results object
                results[formattedDate] = totalValue;

                // If we have collected results for all requested dates, send the response
                if (Object.keys(results).length === n) {
                    res.json(results);
                }
            }
        );
    }
});

// Endpoint to get expense categories and their counts to plot a pie chart
router.get('/get-categories-counts', (req, res) => {
    // SQL query to count expenses in each category
    const username = req.query.username;
    const query = `
    SELECT category, COUNT(*) AS count FROM Expenses WHERE username = ? GROUP BY category ;
    `;

    dbConnection.query(query, [username], (error, results) => {
        if (error) {
            // If there's an error, send a 500 status code and the error message
            res.status(500).json({ error: error.message });
        } else {
            // Otherwise, send the results back as JSON
            const convertedObject = {};

            results.forEach(item => {
                convertedObject[item.category] = item.count;
            });
            res.json(convertedObject);
        }
    });
});

// Endpoint to get the expense categories and their sum of amounts
router.get('/get-categories-amounts', (req, res) => {
    // SQL query to sum amounts in each category
    const username = req.query.username;
    const query = `
        SELECT category, SUM(amount) AS total_amount
        FROM Expenses
        WHERE username = ?
        GROUP BY category
    `;

    dbConnection.query(query, [username], (error, results) => {
        if (error) {
            // If there's an error, send a 500 status code and the error message
            res.status(500).json({ error: error.message });
        } else {
            // Otherwise, send the results back as JSON
            // Transform the result to ensure the total_amount is a float (as some DB drivers return strings for DECIMAL fields)
            const transformedResults = results.map(result => ({
                ...result,
                total_amount: parseFloat(result.total_amount)
            }));

            const convertedObject = {};

            transformedResults.forEach(item => {
                convertedObject[item.category] = item.total_amount;
            });
            res.json(convertedObject);
        }
    });
});

// Endpoint to get expenses count in certain amount ranges
router.post('/post-expenses-counts-in-ranges', (req, res) => {
    const username = req.query.username; // Get username from query parameters
    const ranges = req.body.ranges; // Get ranges from the request body
    //console.log(username,ranges)

    // Validate input
    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }
    if (!Array.isArray(ranges) || ranges.length === 0) {
        return res.status(400).json({ error: "Valid ranges are required in the request body" });
    }

    // Construct SQL query parts for each range
    const rangeConditions = ranges.map(([minVal, maxVal], index) =>
        `SUM(CASE WHEN amount BETWEEN ${minVal} AND ${maxVal} THEN 1 ELSE 0 END) AS range${index + 1}`
    ).join(', ');

    const query = `
        SELECT ${rangeConditions}
        FROM Expenses
        WHERE username = ?
    `;

    // Execute the query
    dbConnection.query(query, [username], (error, results) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json(results[0]);
        }
    });
});

// Endpoint to get top N most expensive expenses of a user
router.post('/post-top-n-expenses', (req, res) => {
    const username = req.query.username; // Get username from query parameters
    const n = parseInt(req.body.n); // Get n from query parameters

    // Validate input
    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }
    if (isNaN(n) || n < 1) {
        return res.status(400).json({ error: "A valid 'n' number is required" });
    }

    // SQL query to fetch top N most expensive expenses for the specified user
    const query = `
        SELECT * FROM Expenses
        WHERE username = ?
        ORDER BY amount DESC
        LIMIT ?
    `;

    // Execute the query
    dbConnection.query(query, [username, n], (error, results) => {
        if (error) {
            // Handle query error
            res.status(500).json({ error: error.message });
        } else {
            // Send the query results
            res.json(results);
        }
    });
});

// Endpoint

module.exports = router;