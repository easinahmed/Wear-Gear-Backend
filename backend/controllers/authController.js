const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generate.token');
const sendMail = require('../utils/sendMail');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({ name, email, password, verificationToken });
    const token = generateToken(user);

    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    const text = `Welcome ${name}!\n\nPlease verify your email by clicking this link:\n${verifyLink}\n\nIf you didn't create an account, please ignore this email.`;
    const html = `
      <div style="max-width:480px;margin:0 auto;font-family:Helvetica,Arial,sans-serif;padding:32px 24px">
        <h1 style="font-size:20px;text-transform:uppercase;letter-spacing:2px;margin:0 0 24px">Wear &amp; Gear</h1>
        <p style="font-size:14px;line-height:1.6;color:#333">Hi <strong>${name}</strong>,</p>
        <p style="font-size:14px;line-height:1.6;color:#333">Thanks for creating an account. Please verify your email address by clicking the button below:</p>
        <a href="${verifyLink}" style="display:inline-block;background:#000;color:#fff;padding:12px 32px;font-size:12px;text-transform:uppercase;letter-spacing:2px;text-decoration:none;margin:24px 0">Verify Email</a>
        <p style="font-size:12px;color:#888;margin-top:32px">If you didn't create this account, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px">Wear &amp; Gear</p>
      </div>`;
    sendMail(email, 'Verify your Wear & Gear account', text, html)
      .catch(err => console.error(`[MAIL FAILED] to ${email} — verify:`, err.message));

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resendVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isVerified) {
      return res.json({ message: 'Email is already verified' });
    }
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    const text = `Hi ${user.name}!\n\nPlease verify your email by clicking this link:\n${verifyLink}`;
    const html = `
      <div style="max-width:480px;margin:0 auto;font-family:Helvetica,Arial,sans-serif;padding:32px 24px">
        <h1 style="font-size:20px;text-transform:uppercase;letter-spacing:2px;margin:0 0 24px">Wear &amp; Gear</h1>
        <p style="font-size:14px;line-height:1.6;color:#333">Hi <strong>${user.name}</strong>,</p>
        <p style="font-size:14px;line-height:1.6;color:#333">Please verify your email address by clicking the button below:</p>
        <a href="${verifyLink}" style="display:inline-block;background:#000;color:#fff;padding:12px 32px;font-size:12px;text-transform:uppercase;letter-spacing:2px;text-decoration:none;margin:24px 0">Verify Email</a>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px">Wear &amp; Gear</p>
      </div>`;
    sendMail(user.email, 'Verify your Wear & Gear account', text, html)
      .catch(err => console.error(`[MAIL FAILED] to ${user.email} — resend verify:`, err.message));

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      phone: user.phone,
      address: user.address,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account with that email exists' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const text = `Hi ${user.name},\n\nYou requested a password reset. Click this link to reset your password:\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`;
    const html = `
      <div style="max-width:480px;margin:0 auto;font-family:Helvetica,Arial,sans-serif;padding:32px 24px">
        <h1 style="font-size:20px;text-transform:uppercase;letter-spacing:2px;margin:0 0 24px">Wear &amp; Gear</h1>
        <p style="font-size:14px;line-height:1.6;color:#333">Hi <strong>${user.name}</strong>,</p>
        <p style="font-size:14px;line-height:1.6;color:#333">You requested a password reset. Click the button below to set a new password:</p>
        <a href="${resetLink}" style="display:inline-block;background:#000;color:#fff;padding:12px 32px;font-size:12px;text-transform:uppercase;letter-spacing:2px;text-decoration:none;margin:24px 0">Reset Password</a>
        <p style="font-size:12px;color:#888">This link expires in <strong>1 hour</strong>.</p>
        <p style="font-size:12px;color:#888;margin-top:16px">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px">Wear &amp; Gear</p>
      </div>`;
    sendMail(email, 'Reset your Wear & Gear password', text, html)
      .catch(err => console.error(`[MAIL FAILED] to ${email} — forgot password:`, err.message));

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile, verifyEmail, resendVerification, forgotPassword, resetPassword };
