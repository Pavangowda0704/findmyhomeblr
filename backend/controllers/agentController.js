const mongoose = require('mongoose');
const Property = require('../models/Property');
const Lead = require('../models/Lead');
const User = require('../models/User');

// @desc    Get agent dashboard stats
// @route   GET /api/agent/dashboard
exports.getAgentDashboard = async (req, res, next) => {
  try {
    const agentId = req.user.id;

    const [totalListings, activeListings, totalLeads, openLeads] = await Promise.all([
      Property.countDocuments({ agent: agentId }),
      Property.countDocuments({ agent: agentId, status: 'active' }),
      Lead.countDocuments({ agent: agentId }),
      Lead.countDocuments({ agent: agentId, status: { $in: ['new', 'contacted', 'interested'] } })
    ]);

    const recentLeads = await Lead.find({ agent: agentId })
      .populate('property', 'title images price')
      .sort('-createdAt')
      .limit(5);

    const recentProperties = await Property.find({ agent: agentId })
      .sort('-createdAt')
      .limit(5);

    const leadStatusStats = await Lead.aggregate([
      { $match: { agent: new mongoose.Types.ObjectId(agentId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: { totalListings, activeListings, totalLeads, openLeads },
      recentLeads,
      recentProperties,
      leadStatusStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agent's properties
// @route   GET /api/agent/properties
exports.getAgentProperties = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 12 } = req.query;
    const query = { agent: req.user.id };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, properties, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agent profile
// @route   GET /api/agent/:id/profile
exports.getAgentProfile = async (req, res, next) => {
  try {
    const agent = await User.findOne({ _id: req.params.id, role: 'agent' })
      .select('-password');

    if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });

    const properties = await Property.find({ agent: req.params.id, status: 'active' }).limit(6);
    const totalListings = await Property.countDocuments({ agent: req.params.id });

    res.json({ success: true, agent, properties, totalListings });
  } catch (error) {
    next(error);
  }
};
