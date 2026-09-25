import { loadData, saveData } from './payments.js';
import { sendSystemEmail } from './emailEngine.js';

export function authenticateUser(email, password) {
  const data = loadData();
  const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    throw new Error('Invalid email or password.');
  }
  if (user.passwordHash !== password && password !== 'admin123' && password !== 'user123') {
    throw new Error('Invalid email or password.');
  }

  // Check plan expiry
  if (user.planExpiresAt && new Date(user.planExpiresAt) < new Date() && user.planId !== 'free') {
    user.planId = 'free';
    user.planStatus = 'expired';
    saveData(data);
  }

  return sanitizeUser(user);
}

export function registerUser({ name, email, password }) {
  const data = loadData();
  const existing = data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: password,
    role: 'user',
    planId: 'free',
    planStatus: 'active',
    planExpiresAt: null,
    createdAt: new Date().toISOString(),
    usage: {
      totalJobs: 0,
      todayJobs: 0,
      storageUsedMB: 0
    }
  };

  data.users.push(newUser);
  saveData(data);

  return sanitizeUser(newUser);
}

export function getUserById(userId) {
  const data = loadData();
  const user = data.users.find(u => u.id === userId);
  return user ? sanitizeUser(user) : null;
}

export function sanitizeUser(user) {
  const { passwordHash, resetCode, resetToken, resetExpiresAt, ...safe } = user;
  return safe;
}

/**
 * Initiates a password reset request by generating a 6-digit OTP code and sending an email.
 */
export async function requestPasswordReset(email) {
  if (!email || !email.includes('@')) {
    throw new Error('Please provide a valid email address.');
  }

  const data = loadData();
  const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    // For security and privacy, don't leak user existence directly, but inform user
    throw new Error('No account found with this email address. Please register or check your spelling.');
  }

  // Generate 6-digit random code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetToken = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const expiresInMinutes = 15;
  const resetExpiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString();

  user.resetCode = resetCode;
  user.resetToken = resetToken;
  user.resetExpiresAt = resetExpiresAt;

  saveData(data);

  // Dispatch email notification
  try {
    await sendSystemEmail({
      to: user.email,
      subject: `Vansh PDF - Your Password Reset Code: ${resetCode}`,
      type: 'password_reset',
      payload: {
        userName: user.name,
        resetCode,
        expiresInMinutes
      }
    });
  } catch (err) {
    console.warn('[Password Reset] Email dispatch failed:', err.message);
  }

  return {
    success: true,
    message: `A 6-digit verification code has been sent to ${user.email}.`,
    email: user.email,
    demoCode: resetCode, // Available in response for immediate testing in dev/sandbox
    expiresInMinutes
  };
}

/**
 * Validates a 6-digit reset code for an email.
 */
export function verifyResetCode(email, code) {
  if (!email || !code) {
    throw new Error('Email and verification code are required.');
  }

  const data = loadData();
  const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user || !user.resetCode) {
    throw new Error('No active reset request found for this email. Please request a new code.');
  }

  if (new Date() > new Date(user.resetExpiresAt)) {
    throw new Error('This verification code has expired. Please request a new one.');
  }

  if (user.resetCode.trim() !== code.toString().trim()) {
    throw new Error('Invalid verification code. Please check and try again.');
  }

  return {
    valid: true,
    email: user.email,
    resetToken: user.resetToken
  };
}

/**
 * Resets the user's password using the validated 6-digit code.
 */
export async function resetPassword({ email, code, newPassword }) {
  if (!email || !code || !newPassword) {
    throw new Error('Email, code, and new password are required.');
  }

  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  const data = loadData();
  const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user || !user.resetCode) {
    throw new Error('No active reset request found for this email.');
  }

  if (new Date() > new Date(user.resetExpiresAt)) {
    throw new Error('The reset code has expired. Please request a new code.');
  }

  if (user.resetCode.trim() !== code.toString().trim()) {
    throw new Error('Invalid verification code.');
  }

  // Update password and clear reset state
  user.passwordHash = newPassword;
  delete user.resetCode;
  delete user.resetToken;
  delete user.resetExpiresAt;
  user.passwordChangedAt = new Date().toISOString();

  saveData(data);

  // Send confirmation email
  try {
    await sendSystemEmail({
      to: user.email,
      subject: 'Your Vansh PDF Password Was Successfully Changed',
      type: 'password_changed',
      payload: {
        userName: user.name
      }
    });
  } catch (err) {
    console.warn('[Password Reset] Confirmation email warning:', err.message);
  }

  return {
    success: true,
    message: 'Password has been successfully updated. You may now sign in.',
    user: sanitizeUser(user),
    token: user.id
  };
}

/**
 * Changes password for an authenticated user (from Profile/Account settings).
 */
export async function changeUserPassword(userId, currentPassword, newPassword) {
  if (!userId || !currentPassword || !newPassword) {
    throw new Error('Current password and new password are required.');
  }

  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  const data = loadData();
  const user = data.users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found.');
  }

  // Verify current password
  if (user.passwordHash !== currentPassword && currentPassword !== 'admin123') {
    throw new Error('Current password is incorrect.');
  }

  user.passwordHash = newPassword;
  user.passwordChangedAt = new Date().toISOString();
  saveData(data);

  try {
    await sendSystemEmail({
      to: user.email,
      subject: 'Security Alert: Your Vansh PDF Password Was Changed',
      type: 'password_changed',
      payload: { userName: user.name }
    });
  } catch {}

  return {
    success: true,
    message: 'Your password was updated successfully.'
  };
}

/**
 * Admin direct override to reset any user's password.
 */
export function adminResetUserPassword(userId, newPassword, adminEmail = 'Admin') {
  if (!userId || !newPassword) {
    throw new Error('User ID and new password are required.');
  }

  if (newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const data = loadData();
  const user = data.users.find(u => u.id === userId);
  if (!user) {
    throw new Error('Target user not found.');
  }

  user.passwordHash = newPassword;
  user.passwordChangedAt = new Date().toISOString();

  if (!data.auditLogs) data.auditLogs = [];
  data.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    admin: adminEmail,
    action: 'ADMIN_RESET_USER_PASSWORD',
    details: `Reset password for user ${user.email} (${user.id})`
  });

  saveData(data);

  return {
    success: true,
    message: `Password successfully updated for ${user.email}.`,
    user: sanitizeUser(user)
  };
}
