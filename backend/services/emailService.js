const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Find My Home BLR" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html
  });
};

const sendWelcomeEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Find My Home BLR!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #8ED600; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Find My Home BLR</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>Welcome, ${user.name}!</h2>
          <p>Thank you for registering with Find My Home BLR. Your account has been successfully created.</p>
          <p>Start exploring thousands of properties in Bangalore today.</p>
          <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: #8ED600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">Explore Properties</a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Find My Home BLR. All rights reserved.</p>
        </div>
      </div>
    `
  });
};

const sendEnquiryNotification = async (lead, property, agentEmail) => {
  await sendEmail({
    to: agentEmail,
    subject: `New Enquiry for ${property.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #8ED600; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Property Enquiry</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>New Lead Received</h2>
          <p><strong>Property:</strong> ${property.title}</p>
          <p><strong>Name:</strong> ${lead.name}</p>
          <p><strong>Email:</strong> ${lead.email}</p>
          <p><strong>Phone:</strong> ${lead.phone}</p>
          <p><strong>Message:</strong> ${lead.message || 'No message'}</p>
          <a href="${process.env.FRONTEND_URL}/agent/leads" style="display: inline-block; background: #8ED600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">View Lead</a>
        </div>
      </div>
    `
  });
};

const sendResetPasswordEmail = async (user, resetUrl) => {
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #8ED600; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset for your Find My Home BLR account.</p>
          <p>Click the button below to reset your password. This link expires in 10 minutes.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #8ED600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">Reset Password</a>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `
  });
};

const sendLeadAssignmentEmail = async (agent, lead, property) => {
  await sendEmail({
    to: agent.email,
    subject: `Lead Assigned: ${lead.name} - ${property.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #8ED600; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Lead Assigned</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>You've been assigned a new lead</h2>
          <p><strong>Lead Name:</strong> ${lead.name}</p>
          <p><strong>Property:</strong> ${property.title}</p>
          <p><strong>Contact:</strong> ${lead.phone}</p>
          <a href="${process.env.FRONTEND_URL}/agent/leads" style="display: inline-block; background: #8ED600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">View Lead Details</a>
        </div>
      </div>
    `
  });
};

module.exports = {
  sendWelcomeEmail,
  sendEnquiryNotification,
  sendResetPasswordEmail,
  sendLeadAssignmentEmail
};
