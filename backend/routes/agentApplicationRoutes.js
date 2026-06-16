const express = require('express');
const router = express.Router();
const {
  submitApplication, getApplications, approveApplication, rejectApplication
} = require('../controllers/agentApplicationController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', submitApplication);                                    // public
router.get('/', protect, admin, getApplications);                       // admin
router.put('/:id/approve', protect, admin, approveApplication);         // admin
router.put('/:id/reject', protect, admin, rejectApplication);           // admin

module.exports = router;