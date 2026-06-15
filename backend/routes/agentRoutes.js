const express = require('express');
const router = express.Router();
const { getAgentDashboard, getAgentProperties, getAgentProfile } = require('../controllers/agentController');
const { protect } = require('../middleware/auth');
const agent = require('../middleware/agent');

router.get('/dashboard', protect, agent, getAgentDashboard);
router.get('/properties', protect, agent, getAgentProperties);
router.get('/:id/profile', getAgentProfile);

module.exports = router;
