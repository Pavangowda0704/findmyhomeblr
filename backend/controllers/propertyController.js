const Property = require('../models/Property');
const SavedProperty = require('../models/SavedProperty');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const fs = require('fs');

// @desc    Get all properties with filters
// @route   GET /api/properties
exports.getProperties = async (req, res, next) => {
  try {
    const {
      listingType, propertyType, city, locality, minPrice, maxPrice,
      bedrooms, bathrooms, amenities, minArea, maxArea, featured,
      status = 'active', sort = '-createdAt', page = 1, limit = 12, search
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (listingType) query.listingType = listingType;
    if (propertyType) query.propertyType = propertyType;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (locality) query['location.locality'] = new RegExp(locality, 'i');
    if (featured) query.featured = featured === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (bathrooms) query.bathrooms = Number(bathrooms);
    if (amenities) query.amenities = { $all: amenities.split(',') };
    if (minArea || maxArea) {
      query['area.total'] = {};
      if (minArea) query['area.total'].$gte = Number(minArea);
      if (maxArea) query['area.total'].$lte = Number(maxArea);
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { 'location.locality': new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('agent', 'name email phone avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: properties.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent', 'name email phone avatar createdAt');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Increment views
    await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Check if saved
    let isSaved = false;
    if (req.user) {
      const saved = await SavedProperty.findOne({ user: req.user.id, property: property._id });
      isSaved = !!saved;
    }

    res.json({ success: true, property, isSaved });
  } catch (error) {
    next(error);
  }
};

// @desc    Get property by slug
// @route   GET /api/properties/slug/:slug
exports.getPropertyBySlug = async (req, res, next) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug })
      .populate('agent', 'name email phone avatar createdAt');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    await Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } });

    res.json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// @desc    Create property
// @route   POST /api/properties
exports.createProperty = async (req, res, next) => {
  try {
    req.body.agent = req.user.id;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(file =>
        uploadToCloudinary(file.path, 'findmyhomeblr/properties')
          .then(result => {
            fs.unlinkSync(file.path);
            return result;
          })
      );
      req.body.images = await Promise.all(imagePromises);
    }

    // Parse JSON fields
    if (typeof req.body.location === 'string') req.body.location = JSON.parse(req.body.location);
    if (typeof req.body.area === 'string') req.body.area = JSON.parse(req.body.area);
    if (typeof req.body.amenities === 'string') req.body.amenities = JSON.parse(req.body.amenities);
    if (typeof req.body.nearbyPlaces === 'string') req.body.nearbyPlaces = JSON.parse(req.body.nearbyPlaces);

    const property = await Property.create(req.body);
    res.status(201).json({ success: true, property });
  } catch (error) {
    // Cleanup uploaded files on error
    if (req.files) req.files.forEach(file => { try { fs.unlinkSync(file.path); } catch(e) {} });
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Only agent who owns it or admin can update
    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(file =>
        uploadToCloudinary(file.path, 'findmyhomeblr/properties')
          .then(result => {
            fs.unlinkSync(file.path);
            return result;
          })
      );
      const newImages = await Promise.all(imagePromises);
      req.body.images = [...(property.images || []), ...newImages];
    }

    if (typeof req.body.location === 'string') req.body.location = JSON.parse(req.body.location);
    if (typeof req.body.area === 'string') req.body.area = JSON.parse(req.body.area);
    if (typeof req.body.amenities === 'string') req.body.amenities = JSON.parse(req.body.amenities);

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    }).populate('agent', 'name email phone avatar');

    res.json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    // Delete images from cloudinary
    for (const image of property.images) {
      if (image.public_id) {
        try { await deleteFromCloudinary(image.public_id); } catch(e) {}
      }
    }

    await property.deleteOne();
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a specific property image
// @route   DELETE /api/properties/:id/images/:publicId
exports.deletePropertyImage = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const publicId = decodeURIComponent(req.params.publicId);
    await deleteFromCloudinary(publicId);

    property.images = property.images.filter(img => img.public_id !== publicId);
    await property.save();

    res.json({ success: true, images: property.images });
  } catch (error) {
    next(error);
  }
};

// @desc    Get similar properties
// @route   GET /api/properties/:id/similar
exports.getSimilarProperties = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    const similar = await Property.find({
      _id: { $ne: property._id },
      listingType: property.listingType,
      propertyType: property.propertyType,
      'location.city': property.location.city,
      status: 'active',
      price: { $gte: property.price * 0.7, $lte: property.price * 1.3 }
    })
      .populate('agent', 'name phone')
      .limit(4);

    res.json({ success: true, properties: similar });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
exports.getFeaturedProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ featured: true, status: 'active' })
      .populate('agent', 'name phone')
      .limit(8)
      .sort('-createdAt');
    res.json({ success: true, properties });
  } catch (error) {
    next(error);
  }
};
