const express = require('express');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getAllTicketsForAnalytics,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketsByEmployeeId,
  checkStaleTickets,
  importTickets,
  exportMyTickets,
  exportAllTickets
} = require('../controllers/ticketController');
const upload = require("../middleware/upload")
const verifyToken = require('../middleware/verifyToken');
const uploadAttachment = require('../middleware/uploadAttachment');

// Routes
router.post('/create', verifyToken,  uploadAttachment.single("attachment"), createTicket);
router.get('/all', verifyToken, getAllTickets);
router.get("/analytics/all-tickets", getAllTicketsForAnalytics);
router.get('/view/:ticketNumber', verifyToken, getTicketById);
router.put('/edit/:ticketNumber', verifyToken, updateTicket);
router.get('/my-tickets', verifyToken, getTicketsByEmployeeId);
router.delete('/delete/:ticketNumber', verifyToken, deleteTicket);
router.post('/check-stale-tickets', verifyToken, checkStaleTickets); // Manual check for testing
router.get("/export/all", exportAllTickets);
router.get("/export/my", verifyToken, exportMyTickets);
router.post("/import", upload.single("file"), importTickets);


module.exports = router;
