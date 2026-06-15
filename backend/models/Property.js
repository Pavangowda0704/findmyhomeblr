const mongoose = require('mongoose');
const slugify = require('slugify');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: { type: String, unique: true },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'villa', 'independent_house', 'plot', 'commercial', 'pg', 'studio'],
    required: [true, 'Property type is required']
  },
  listingType: {
    type: String,
    enum: ['buy', 'rent', 'commercial'],
    required: [true, 'Listing type is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  priceUnit: {
    type: String,
    enum: ['total', 'per_month', 'per_sqft'],
    default: 'total'
  },
  location: {
    address: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, required: true, default: 'Bangalore' },
    state: { type: String, required: true, default: 'Karnataka' },
    pincode: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  images: [{
    url: { type: String, required: true },
    public_id: { type: String },
    caption: { type: String }
  }],
  amenities: [{
    type: String,
    enum: [
      'parking', 'gym', 'swimming_pool', 'security', 'lift', 'power_backup',
      'clubhouse', 'garden', 'intercom', 'wifi', 'ac', 'furnished',
      'semi_furnished', 'water_supply', 'gas_pipeline', 'vastu_compliant',
      'rainwater_harvesting', 'cctv', 'visitor_parking', 'fire_safety'
    ]
  }],
  bedrooms: { type: Number, min: 0, max: 20 },
  bathrooms: { type: Number, min: 0, max: 20 },
  balconies: { type: Number, min: 0, max: 10 },
  area: {
    total: { type: Number },
    carpet: { type: Number },
    unit: { type: String, enum: ['sqft', 'sqmt', 'sqyd'], default: 'sqft' }
  },
  floor: {
    current: { type: Number },
    total: { type: Number }
  },
  facing: {
    type: String,
    enum: ['north', 'south', 'east', 'west', 'north_east', 'north_west', 'south_east', 'south_west']
  },
  ageOfProperty: { type: Number },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featured: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['active', 'sold', 'rented', 'inactive'],
    default: 'active'
  },
  views: { type: Number, default: 0 },
  enquiries: { type: Number, default: 0 },
  nearbyPlaces: [{
    name: String,
    type: String,
    distance: String
  }],
  floorPlans: [{
    url: String,
    public_id: String,
    name: String
  }],
  highlights: [String]
}, { timestamps: true });

// Create slug before saving
propertySchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  next();
});

// Indexes
propertySchema.index({ 'location.city': 1, listingType: 1, status: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ featured: 1 });
propertySchema.index({ agent: 1 });
propertySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Property', propertySchema);
