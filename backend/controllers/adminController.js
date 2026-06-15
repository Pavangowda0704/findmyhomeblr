const User = require('../models/User');
const Property = require('../models/Property');
const Lead = require('../models/Lead');

// @desc    Get dashboard overview
// @route   GET /api/admin/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers, totalAgents, totalProperties, totalLeads,
      activeProperties, newLeadsThisMonth, recentProperties, recentLeads
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'agent' }),
      Property.countDocuments(),
      Lead.countDocuments(),
      Property.countDocuments({ status: 'active' }),
      Lead.countDocuments({
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }),
      Property.find().populate('agent', 'name').sort('-createdAt').limit(5),
      Lead.find().populate('property', 'title').populate('agent', 'name').sort('-createdAt').limit(5)
    ]);

    // Monthly leads data for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyLeads = await Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Property type distribution
    const propertyTypeStats = await Property.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } }
    ]);

    // Lead status distribution
    const leadStatusStats = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers, totalAgents, totalProperties, totalLeads,
        activeProperties, newLeadsThisMonth
      },
      charts: { monthlyLeads, propertyTypeStats, leadStatusStats },
      recent: { properties: recentProperties, leads: recentLeads }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ];

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort('-createdAt').skip(skip).limit(Number(limit));

    res.json({ success: true, users, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify property
// @route   PUT /api/admin/properties/:id/verify
exports.verifyProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { verified: req.body.verified },
      { new: true }
    );
    res.json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// @desc    Feature property
// @route   PUT /api/admin/properties/:id/feature
exports.featureProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { featured: req.body.featured },
      { new: true }
    );
    res.json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const cityStats = await Property.aggregate([
      { $group: { _id: '$location.city', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const listingTypeStats = await Property.aggregate([
      { $group: { _id: '$listingType', count: { $sum: 1 } } }
    ]);

    const topAgents = await Lead.aggregate([
      { $group: { _id: '$agent', leadCount: { $sum: 1 } } },
      { $sort: { leadCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agentInfo' } },
      { $unwind: '$agentInfo' },
      { $project: { 'agentInfo.name': 1, 'agentInfo.email': 1, leadCount: 1 } }
    ]);

    res.json({ success: true, analytics: { cityStats, listingTypeStats, topAgents } });
  } catch (error) {
    next(error);
  }
};
