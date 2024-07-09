const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/auth');

router.post('/create', authMiddleware, ticketController.createTicket);
router.get('/employee', authMiddleware, ticketController.viewTickets);
router.post('/answer', authMiddleware, ticketController.answerTicket);
router.get('/tickets', authMiddleware, ticketController.viewTicketsall);

module.exports = router;
