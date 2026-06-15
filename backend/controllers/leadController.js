const Lead = require('../models/Lead');
const Property = require('../models/Property');
const { sendEnquiryNotification, sendLeadAssignmentEmail } = require('../services/emailService');

// @desc    Create lead / enquiry
// @route   POST /api/leads
exports.createLead = async (req, res, next) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    const property = await Property.findById(propertyId).populate('agent', 'email name');
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const lead = await Lead.create({
      user: req.user ? req.user.id : undefined,
      property: propertyId,
      agent: property.agent._id,
      name,
      email,
      phone,
      message
    });

    // Increment property enquiry count
    await Property.findByIdAndUpdate(propertyId, { $inc: { enquiries: 1 } });

    // Notify agent
    try {
      await sendEnquiryNotification(lead, property, property.agent.email);
    } catch (e) {
      console.error('Email notification failed:', e.message);
    }

    res.status(201).json({ success: true, message: 'Enquiry submitted successfully', lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads (admin)
// @route   GET /api/leads
exports.getLeads = async (req, res, next) => {
  try {
    const { status, agent, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (agent) query.agent = agent;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('property', 'title location images price')
      .populate('agent', 'name email phone')
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, leads, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agent leads
// @route   GET /api/leads/agent
exports.getAgentLeads = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { agent: req.user.id };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('property', 'title location images price')
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, leads, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('property', 'title location images price')
      .populate('agent', 'name email phone')
      .populate('user', 'name email');

    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    // Only agent or admin can view
    if (lead.agent && lead.agent._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead status
// @route   PUT /api/leads/:id
exports.updateLead = async (req, res, next) => {
  try {
    let lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    if (lead.agent && lead.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { status, followUpDate, requirements, budget } = req.body;
    if (status) lead.status = status;
    if (followUpDate) lead.followUpDate = followUpDate;
    if (requirements) lead.requirements = requirements;
    if (budget) lead.budget = budget;

    await lead.save();
    res.json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Add note to lead
// @route   POST /api/leads/:id/notes
exports.addNote = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    lead.notes.push({ note: req.body.note, addedBy: req.user.id });
    await lead.save();

    await lead.populate('notes.addedBy', 'name');
    res.json({ success: true, notes: lead.notes });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign lead to agent (admin)
// @route   PUT /api/leads/:id/assign
exports.assignLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { agent: req.body.agentId },
      { new: true }
    ).populate('property', 'title').populate('agent', 'name email');

    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    try {
      await sendLeadAssignmentEmail(lead.agent, lead, lead.property);
    } catch (e) {}

    res.json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user enquiries
// @route   GET /api/leads/my-enquiries
exports.getMyEnquiries = async (req, res, next) => {
  try {
    const leads = await Lead.find({ user: req.user.id })
      .populate('property', 'title location images price')
      .sort('-createdAt');
    res.json({ success: true, leads });
  } catch (error) {
    next(error);
  }
};
