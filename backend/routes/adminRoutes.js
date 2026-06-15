const express = require('express');
const router = express.Router();
const {
  getDashboard, getUsers, updateUser, deleteUser,
  verifyProperty, featureProperty, getAnalytics
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.use(protect, admin);

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/properties/:id/verify', verifyProperty);
router.put('/properties/:id/feature', featureProperty);
router.get('/analytics', getAnalytics);

module.exports = router;
