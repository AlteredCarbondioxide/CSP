const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.signup = (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error creating user' });
        }
        res.status(201).json({ message: 'User created successfully' });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      if (err || !user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const redirectUrl = user.role === 'employee' ? '/employee-tickets.html' : '/create-ticket.html';
      res.json({ token, redirectUrl });
    });
  };
  
