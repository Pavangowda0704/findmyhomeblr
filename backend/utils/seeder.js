const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding...');
};

const SEED_USERS = [
  { name: 'Admin User', email: 'admin@findmyhomeblr.com', phone: '9876543210', password: 'Admin@123', role: 'admin' },
  { name: 'Rajesh Kumar', email: 'agent@findmyhomeblr.com', phone: '9876543211', password: 'Agent@123', role: 'agent' },
  { name: 'Priya Singh', email: 'user@findmyhomeblr.com', phone: '9876543212', password: 'User@123', role: 'user' }
];

const SEED_PROPERTIES = [
  {
    title: '3 BHK Premium Apartment in Whitefield',
    description: 'Luxurious 3 BHK apartment with modern amenities in the heart of Whitefield tech corridor. Close to ITPL and major tech parks. Well-ventilated with scenic views. Perfect for families.',
    propertyType: 'apartment', listingType: 'buy', price: 8500000, priceUnit: 'total',
    location: { address: '123 Prestige Tech Park Road', locality: 'Whitefield', city: 'Bangalore', state: 'Karnataka', pincode: '560066' },
    images: [{ url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', public_id: 'seed_1' }],
    amenities: ['parking', 'gym', 'swimming_pool', 'security', 'lift', 'power_backup'],
    bedrooms: 3, bathrooms: 3, balconies: 2,
    area: { total: 1650, carpet: 1350, unit: 'sqft' },
    floor: { current: 8, total: 20 }, facing: 'east', featured: true, verified: true, status: 'active'
  },
  {
    title: '2 BHK Apartment for Rent in Koramangala',
    description: 'Fully furnished 2 BHK apartment for rent in Koramangala. Walking distance from restaurants and startups. Great connectivity.',
    propertyType: 'apartment', listingType: 'rent', price: 35000, priceUnit: 'per_month',
    location: { address: '456 5th Block', locality: 'Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560034' },
    images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', public_id: 'seed_2' }],
    amenities: ['parking', 'security', 'lift', 'wifi', 'furnished'],
    bedrooms: 2, bathrooms: 2,
    area: { total: 1100, carpet: 900, unit: 'sqft' },
    floor: { current: 3, total: 10 }, facing: 'north', featured: true, verified: true, status: 'active'
  },
  {
    title: '4 BHK Villa in HSR Layout',
    description: 'Independent 4 BHK villa with private garden in gated community. 24/7 security and covered parking.',
    propertyType: 'villa', listingType: 'buy', price: 18000000, priceUnit: 'total',
    location: { address: '78 Sector 2', locality: 'HSR Layout', city: 'Bangalore', state: 'Karnataka', pincode: '560102' },
    images: [{ url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', public_id: 'seed_3' }],
    amenities: ['parking', 'garden', 'security', 'power_backup', 'cctv'],
    bedrooms: 4, bathrooms: 4, balconies: 3,
    area: { total: 3200, carpet: 2800, unit: 'sqft' },
    facing: 'north_east', featured: true, verified: true, status: 'active'
  },
  {
    title: '1 BHK Studio in Electronic City',
    description: 'Affordable 1 BHK studio for IT professionals in Electronic City. Metro nearby. Semi-furnished.',
    propertyType: 'studio', listingType: 'rent', price: 15000, priceUnit: 'per_month',
    location: { address: 'Phase 2', locality: 'Electronic City', city: 'Bangalore', state: 'Karnataka', pincode: '560100' },
    images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', public_id: 'seed_4' }],
    amenities: ['parking', 'security', 'lift', 'wifi', 'semi_furnished'],
    bedrooms: 1, bathrooms: 1,
    area: { total: 550, carpet: 450, unit: 'sqft' },
    floor: { current: 4, total: 8 }, featured: false, verified: true, status: 'active'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('Cleared existing data');
    const createdUsers = [];
    for (const u of SEED_USERS) { createdUsers.push(await User.create(u)); }
    console.log('Created ' + createdUsers.length + ' users');
    const agent = createdUsers.find(u => u.role === 'agent');
    const props = SEED_PROPERTIES.map(p => ({ ...p, agent: agent._id }));
    const created = await Property.create(props);
    console.log('Created ' + created.length + ' properties');
    console.log('\n=============================');
    console.log('   SEED COMPLETE!');
    console.log('=============================');
    console.log('  Admin : admin@findmyhomeblr.com / Admin@123');
    console.log('  Agent : agent@findmyhomeblr.com / Agent@123');
    console.log('  User  : user@findmyhomeblr.com  / User@123');
    console.log('=============================\n');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};
seedDatabase();
