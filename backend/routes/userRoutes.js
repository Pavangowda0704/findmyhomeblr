const express = require('express');
const router = express.Router();
const {
  updateProfile, saveProperty, getSavedProperties,
  getCompareList, toggleCompare
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.get('/saved', protect, getSavedProperties);
router.post('/saved/:propertyId', protect, saveProperty);
router.get('/compare', protect, getCompareList);
router.post('/compare/:propertyId', protect, toggleCompare);

module.exports = router;
