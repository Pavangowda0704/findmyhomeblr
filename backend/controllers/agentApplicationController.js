const AgentApplication = require('../models/AgentApplication');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc  Submit agent application (public)
// @route POST /api/agent-applications
exports.submitApplication = async (req, res, next) => {
  try {
    const { name, email, phone, password, reraNumber, agencyName, experience, localities, about } = req.body;

    // Check if email already registered as user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please use a different email.' });
    }

    // Check duplicate pending application
    const existing = await AgentApplication.findOne({ email, status: 'pending' });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An application with this email is already under review.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const application = await AgentApplication.create({
      name, email, phone, password: hashedPassword,
      reraNumber, agencyName, experience, localities, about
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully! We will review and contact you within 2-3 business days.' });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all applications (admin)
// @route GET /api/agent-applications
exports.getApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await AgentApplication.countDocuments(query);
    const applications = await AgentApplication.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .select('-password');

    res.json({ success: true, applications, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    next(error);
  }
};

// @desc  Approve application — creates agent user account
// @route PUT /api/agent-applications/:id/approve
exports.approveApplication = async (req, res, next) => {
  try {
    const application = await AgentApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.status !== 'pending') return res.status(400).json({ success: false, message: 'Application already reviewed' });

    // Create agent user account
    const user = await User.create({
      name: application.name,
      email: application.email,
      phone: application.phone,
      password: application.password, // already hashed
      role: 'agent',
      isActive: true
    });

    // Skip bcrypt rehash — password already hashed
    // Use direct update to avoid pre-save hook re-hashing
    await User.findByIdAndUpdate(user._id, { password: application.password });

    application.status = 'approved';
    application.reviewedBy = req.user.id;
    application.reviewedAt = new Date();
    await application.save();

    res.json({ success: true, message: `Agent account created for ${application.name}` });
  } catch (error) {
    next(error);
  }
};

// @desc  Reject application
// @route PUT /api/agent-applications/:id/reject
exports.rejectApplication = async (req, res, next) => {
  try {
    const application = await AgentApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.status !== 'pending') return res.status(400).json({ success: false, message: 'Application already reviewed' });

    application.status = 'rejected';
    application.rejectionReason = req.body.reason || '';
    application.reviewedBy = req.user.id;
    application.reviewedAt = new Date();
    await application.save();

    res.json({ success: true, message: 'Application rejected' });
  } catch (error) {
    next(error);
  }
};