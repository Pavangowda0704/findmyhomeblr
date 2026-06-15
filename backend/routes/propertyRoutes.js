const express = require('express');
const router = express.Router();
const {
  getProperties, getProperty, getPropertyBySlug, createProperty,
  updateProperty, deleteProperty, deletePropertyImage,
  getSimilarProperties, getFeaturedProperties
} = require('../controllers/propertyController');
const { protect, optionalAuth } = require('../middleware/auth');
const agent = require('../middleware/agent');
const upload = require('../middleware/upload');

router.get('/', optionalAuth, getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/slug/:slug', optionalAuth, getPropertyBySlug);
router.get('/:id', optionalAuth, getProperty);
router.get('/:id/similar', getSimilarProperties);

router.post('/', protect, agent, upload.array('images', 10), createProperty);
router.put('/:id', protect, agent, upload.array('images', 10), updateProperty);
router.delete('/:id', protect, agent, deleteProperty);
router.delete('/:id/images/:publicId', protect, agent, deletePropertyImage);

module.exports = router;
