const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// ✅ User Signup Function
exports.signup = (req, res) => {
    const { fullName, email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (results.length > 0) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ error: 'Error hashing password' });

            db.query('INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)', 
                [fullName, email, hash], 
                (error, results) => {
                    if (error) return res.status(500).json({ error: 'User registration failed' });
                    res.status(201).json({ message: 'User registered successfully' });
                }
            );
        });
    });
};

// ✅ User Login Function
exports.login = (req, res) => {
  const { email, password } = req.body;

  // ✅ Check if user exists in database
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

      // ✅ Compare hashed password
      bcrypt.compare(password, results[0].password, (err, match) => {
          if (!match) return res.status(401).json({ error: 'Invalid email or password' });

          // ✅ Generate JWT Token
          const token = jwt.sign({ id: results[0].id, email: results[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });

          res.json({ message: 'Login successful', token });
      });
  });
};
exports.getUser = (req, res) => {
    const userId = req.user.id;

    db.query('SELECT fullName, email FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(results[0]);
    });
};
