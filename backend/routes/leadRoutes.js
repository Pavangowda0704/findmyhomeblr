const express = require('express');
const router = express.Router();
const {
  createLead, getLeads, getAgentLeads, getLead,
  updateLead, addNote, assignLead, getMyEnquiries
} = require('../controllers/leadController');
const { protect, optionalAuth } = require('../middleware/auth');
const admin = require('../middleware/admin');
const agent = require('../middleware/agent');

router.post('/', optionalAuth, createLead);
router.get('/', protect, admin, getLeads);
router.get('/agent', protect, agent, getAgentLeads);
router.get('/my-enquiries', protect, getMyEnquiries);
router.get('/:id', protect, agent, getLead);
router.put('/:id', protect, agent, updateLead);
router.post('/:id/notes', protect, agent, addNote);
router.put('/:id/assign', protect, admin, assignLead);

module.exports = router;
