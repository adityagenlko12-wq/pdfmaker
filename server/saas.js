import { loadData, saveData } from './payments.js';
import { checkGuestQuota } from './guestManager.js';

export function checkUserQuota(userId, toolId, guestContext = {}) {
  const data = loadData();
  const user = data.users.find(u => u.id === userId);

  if (!user) {
    // Unauthenticated guest user: enforced by guest limits (max operations & duration)
    return checkGuestQuota(guestContext.guestToken, guestContext.clientIp, toolId);
  }

  // Check if account was suspended or banned by administrator
  if (user.planStatus === 'banned') {
    return {
      allowed: false,
      reason: 'Your account has been suspended by the administrator. Please contact billing/support.',
      plan: user.planId,
      banned: true
    };
  }

  // Check plan validity expiration
  if (user.planExpiresAt && new Date(user.planExpiresAt) < new Date() && user.planId !== 'free') {
    user.planId = 'free';
    saveData(data);
  }

  const plan = data.plans.find(p => p.id === user.planId) || data.plans[0];
  const dailyLimit = plan.limits?.dailyJobs || 5;
  const todayJobs = user.usage?.todayJobs || 0;

  if (todayJobs >= dailyLimit && plan.id === 'free') {
    return {
      allowed: false,
      reason: `Daily quota of ${dailyLimit} PDF operations reached on Free Starter. Please upgrade to Pro for unlimited operations.`,
      plan: plan.id,
      todayJobs,
      dailyLimit
    };
  }

  return {
    allowed: true,
    isGuest: false,
    plan: plan.id,
    todayJobs,
    dailyLimit,
    remaining: Math.max(0, dailyLimit - todayJobs)
  };
}
