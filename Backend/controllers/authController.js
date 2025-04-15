const argon2 = require('argon2'); // Importing argon2 for password hashing
const db = require('../db'); // Assuming you've exported your DB connection from db.js
const jwt = require('jsonwebtoken');
const { promisify } = require('util');


const signup = async (req, res) => {
    const { studentid, name, email, password, year } = req.body;

    // Input validation (optional but recommended)
    if (!studentid || !name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // Hash the password before storing it
        const hashedPassword = await argon2.hash(password);

        // SQL query to insert user into the database
        const query = `INSERT INTO users (studentid, name, email, password, year) 
                       VALUES (?, ?, ?, ?, ?)`;

        // Execute the query
        db.execute(query, [studentid, name, email, hashedPassword, year], (err, results) => {
            if (err) {
                // Handle error (e.g., if email is already taken)
                return res.status(500).json({ message: 'Error saving user data', error: err.message });
            }

             // Generate token if everything is fine
            const token = jwt.sign(
                { id: studentid }, 
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXP_TIME }
            );
            // Send success response
            res.status(201).json({ message: 'User registered successfully', userId: results.insertId, jwt:token });
        });
    } catch (err) {
        // If hashing fails
        return res.status(500).json({ message: 'Error hashing password', error: err.message });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Email or password is missing' });
        }

        // SQL query to find the user by email
        const query = `SELECT * FROM users WHERE email = ?`;

        db.execute(query, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching user data', error: err.message });
            }

            // Check if user exists
            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            console.log(results);
            const user = results[0];

            // Compare the provided password with the stored hashed password
            const passwordMatch = await argon2.verify(user.password, password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.studentid }, // Using studentid for the payload
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXP_TIME }
            );

            // Send the response with the user data and token
            res.status(200).json({
                status: 'success',
                data: {
                    user: {
                        studentid: user.studentid,
                        name: user.name,
                        email: user.email,
                        year: user.year
                    },
                    token: token
                }
            });
        });
    } catch (err) {
        // If an error occurs, send a response with status code 400 and the error message
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};


const protect = async (req, res, next) => {
    let token;

    // 1) Getting token and checking if it's there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'JSON token is missing' });
    }

    try {
        // 2) Verifying token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // Ensure user is authenticated
        if (!decoded) {
            throw new Error("Unauthorized: You must be logged in to add an experience.");
          }
        // 3) Check if user still exists
        const query = 'SELECT * FROM users WHERE studentid = ?'; // Assuming studentid is used in the token payload
        db.execute(query, [decoded.id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching user data', error: err.message });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'The user belonging to this token does no longer exist.' });
            }

            const currentUser = results[0];

            // 4) Check if user changed password after the token was issued
            // Assuming `changedPasswordAfter` method exists and is defined for the `currentUser`
            if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
                return res.status(401).json({ message: 'The user belonging to this token has recently changed their password.' });
            }

            // GRANT ACCESS TO PROTECTED ROUTE
            req.user = currentUser;
            next();
        });
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};


module.exports = { signup, login, protect };
