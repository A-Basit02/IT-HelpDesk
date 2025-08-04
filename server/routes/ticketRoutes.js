const express = require('express');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketsByEmployeeId,
  checkStaleTickets
} = require('../controllers/ticketController');

const verifyToken = require('../middleware/verifyToken');

// Routes
router.post('/create', verifyToken, createTicket);
router.get('/all', verifyToken, getAllTickets);
router.get('/view/:ticketNumber', verifyToken, getTicketById);
router.put('/edit/:ticketNumber', verifyToken, updateTicket);
router.get('/my-tickets', verifyToken, getTicketsByEmployeeId);
router.delete('/delete/:ticketNumber', verifyToken, deleteTicket);
router.post('/check-stale-tickets', verifyToken, checkStaleTickets); // Manual check for testing



module.exports = router;
