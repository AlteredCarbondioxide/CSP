const db = require('../config/db');

exports.createTicket = (req, res) => {
    const { title, description } = req.body;
    const customer_id = req.user.id;
    db.run('INSERT INTO tickets (customer_id, title, description, status) VALUES (?, ?, ?, ?)', [customer_id, title, description, 'Open'], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error creating ticket' });
        }
        res.status(201).json({ message: 'Ticket created successfully' });
    });
};

  exports.viewTickets = (req, res) => {
    const customerId = req.user.id;
    if (!customerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    db.all('SELECT * FROM tickets WHERE customer_id =?', [customerId], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error retrieving tickets' });
      }
      res.json(rows); // Return a JSON response
    });
  };

  exports.viewTicketsall = (req, res) => {
    const customerId = req.user.id;
    if (!customerid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    db.all('SELECT * FROM tickets', (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error retrieving tickets' });
      }
      res.json(rows); // Return a JSON response
    });
  };

  

  exports.answerTicket = (req, res) => {
    const { id, answer } = req.body;
    db.run('UPDATE tickets SET answer = ?, status = "Answered" WHERE id = ?', [answer, id], function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error answering ticket' });
      }
  
      db.get('SELECT * FROM tickets WHERE id = ?', [id], (err, ticket) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error retrieving updated ticket' });
        }
        res.json(ticket); // Return the updated ticket object
      });
    });
};

  
  
  
