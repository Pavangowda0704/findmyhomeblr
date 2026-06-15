const User = require('../models/User');
const SavedProperty = require('../models/SavedProperty');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const fs = require('fs');

// @desc    Update user profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    if (req.file) {
      const user = await User.findById(req.user.id);
      if (user.avatar && user.avatar.public_id) {
        try { await deleteFromCloudinary(user.avatar.public_id); } catch(e) {}
      }
      const result = await uploadToCloudinary(req.file.path, 'findmyhomeblr/avatars');
      fs.unlinkSync(req.file.path);
      updateData.avatar = result;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true, runValidators: true
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Save property
// @route   POST /api/users/saved/:propertyId
exports.saveProperty = async (req, res, next) => {
  try {
    const existing = await SavedProperty.findOne({
      user: req.user.id,
      property: req.params.propertyId
    });

    if (existing) {
      await existing.deleteOne();
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { savedProperties: req.params.propertyId }
      });
      return res.json({ success: true, saved: false, message: 'Property removed from saved' });
    }

    await SavedProperty.create({ user: req.user.id, property: req.params.propertyId });
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { savedProperties: req.params.propertyId }
    });
    res.json({ success: true, saved: true, message: 'Property saved successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved properties
// @route   GET /api/users/saved
exports.getSavedProperties = async (req, res, next) => {
  try {
    const saved = await SavedProperty.find({ user: req.user.id })
      .populate('property', 'title price location images propertyType listingType bedrooms bathrooms area status')
      .sort('-createdAt');
    res.json({ success: true, savedProperties: saved });
  } catch (error) {
    next(error);
  }
};

// @desc    Get compare list
// @route   GET /api/users/compare
exports.getCompareList = async (req, res, next) => {
  try {
    const CompareProperty = require('../models/CompareProperty');
    let compareList = await CompareProperty.findOne({ user: req.user.id })
      .populate('properties');
    if (!compareList) return res.json({ success: true, properties: [] });
    res.json({ success: true, properties: compareList.properties });
  } catch (error) {
    next(error);
  }
};

// @desc    Update compare list
// @route   POST /api/users/compare/:propertyId
exports.toggleCompare = async (req, res, next) => {
  try {
    const CompareProperty = require('../models/CompareProperty');
    let compareList = await CompareProperty.findOne({ user: req.user.id });

    if (!compareList) {
      compareList = await CompareProperty.create({
        user: req.user.id,
        properties: [req.params.propertyId]
      });
      return res.json({ success: true, added: true });
    }

    const idx = compareList.properties.findIndex(p => p.toString() === req.params.propertyId);
    if (idx > -1) {
      compareList.properties.splice(idx, 1);
      await compareList.save();
      return res.json({ success: true, added: false });
    }

    if (compareList.properties.length >= 4) {
      return res.status(400).json({ success: false, message: 'You can compare maximum 4 properties' });
    }

    compareList.properties.push(req.params.propertyId);
    await compareList.save();
    res.json({ success: true, added: true });
  } catch (error) {
    next(error);
  }
};
