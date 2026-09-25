import { loadData, saveData } from './payments.js';

/**
 * Guest / Unauthenticated Access Governance Manager
 * Controls how long (session duration minutes) and how many times (operations count)
 * a guest user can use tools without logging in.
 */
export function getGuestLimitsConfig() {
  const data = loadData();
  const def = {
    enabled: true, // Whether unauthenticated guests can use tools
    maxOperations: 3, // How many times a guest can use tools (default 3 operations)
    sessionDurationMinutes: 60, // How long a guest session lasts (default 60 minutes)
    maxFileSizeMB: 15, // Max file size upload for guests in MB
    requireLoginAfterLimit: true,
    limitMessage: 'You have reached the guest access limit. Please sign up for a free account or log in to continue using Vansh PDF tools.'
  };
  return {
    ...def,
    ...(data.settings?.guestLimits || {})
  };
}

export function updateGuestLimitsConfig(updates) {
  const data = loadData();
  if (!data.settings) data.settings = {};
  data.settings.guestLimits = {
    ...getGuestLimitsConfig(),
    ...updates
  };
  saveData(data);
  return data.settings.guestLimits;
}

/**
 * Resolves or initializes a guest session record
 */
export function getGuestSession(guestToken, clientIp = '127.0.0.1') {
  const data = loadData();
  if (!data.guestSessions) {
    data.guestSessions = [];
  }
  const safeToken = guestToken || `guest_${clientIp.replace(/[^a-zA-Z0-9]/g, '_')}`;
  let session = data.guestSessions.find(s => s.token === safeToken || (s.ip === clientIp && s.token === safeToken));
  const now = new Date();
  if (!session) {
    session = {
      token: safeToken,
      ip: clientIp,
      firstSeen: now.toISOString(),
      lastSeen: now.toISOString(),
      operationsCount: 0,
      operations: []
    };
    data.guestSessions.push(session);
    // Keep last 500 guest sessions
    if (data.guestSessions.length > 500) {
      data.guestSessions = data.guestSessions.slice(-500);
    }
    saveData(data);
  }
  return session;
}

/**
 * Checks whether an unauthenticated guest is allowed to execute a tool.
 */
export function checkGuestQuota(guestToken, clientIp = '127.0.0.1', toolId = null) {
  const config = getGuestLimitsConfig();

  // 1. If guest usage is disabled by admin
  if (!config.enabled) {
    return {
      allowed: false,
      isGuest: true,
      guestDisabled: true,
      reason: 'Guest access without login is disabled by the administrator. Please log in or create an account to use this tool.',
      maxOperations: config.maxOperations,
      remainingOperations: 0,
      sessionDurationMinutes: config.sessionDurationMinutes,
      limitMessage: config.limitMessage
    };
  }

  const session = getGuestSession(guestToken, clientIp);
  const now = Date.now();
  const firstSeenTime = new Date(session.firstSeen).getTime();
  const elapsedMinutes = Math.floor((now - firstSeenTime) / (60 * 1000));
  const maxMinutes = Number(config.sessionDurationMinutes) || 60;
  const minutesRemaining = Math.max(0, maxMinutes - elapsedMinutes);
  const isTimeExpired = elapsedMinutes >= maxMinutes;

  const currentCount = session.operationsCount || (session.operations ? session.operations.length : 0);
  const maxOps = Number(config.maxOperations) || 3;
  const remainingOps = Math.max(0, maxOps - currentCount);
  const isCountExceeded = currentCount >= maxOps;

  // Check 2: Has the guest session time duration expired?
  if (isTimeExpired) {
    return {
      allowed: false,
      isGuest: true,
      timeExpired: true,
      reason: `Guest session time limit reached (${maxMinutes} min window expired). Please create a free account to continue.`,
      operationsUsed: currentCount,
      maxOperations: maxOps,
      remainingOperations: 0,
      sessionDurationMinutes: maxMinutes,
      minutesRemaining: 0,
      limitMessage: config.limitMessage
    };
  }

  // Check 3: Has the guest reached maximum number of tool operations?
  if (isCountExceeded) {
    return {
      allowed: false,
      isGuest: true,
      countExceeded: true,
      reason: config.limitMessage || `Guest limit of ${maxOps} operations reached. Please log in or sign up to continue.`,
      operationsUsed: currentCount,
      maxOperations: maxOps,
      remainingOperations: 0,
      sessionDurationMinutes: maxMinutes,
      minutesRemaining,
      limitMessage: config.limitMessage
    };
  }

  // Allowed
  return {
    allowed: true,
    isGuest: true,
    operationsUsed: currentCount,
    maxOperations: maxOps,
    remainingOperations: remainingOps,
    sessionDurationMinutes: maxMinutes,
    minutesRemaining,
    maxFileSizeMB: config.maxFileSizeMB || 15,
    firstSeen: session.firstSeen,
    plan: 'guest'
  };
}

/**
 * Records an operation done by a guest.
 */
export function recordGuestUsage(guestToken, clientIp = '127.0.0.1', toolId, meta = {}) {
  const data = loadData();
  if (!data.guestSessions) data.guestSessions = [];
  const safeToken = guestToken || `guest_${clientIp.replace(/[^a-zA-Z0-9]/g, '_')}`;
  let session = data.guestSessions.find(s => s.token === safeToken);
  if (!session) {
    session = {
      token: safeToken,
      ip: clientIp,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      operationsCount: 0,
      operations: []
    };
    data.guestSessions.push(session);
  }
  session.lastSeen = new Date().toISOString();
  session.operationsCount = (session.operationsCount || 0) + 1;
  if (!session.operations) session.operations = [];
  session.operations.push({
    toolId,
    timestamp: new Date().toISOString(),
    ...meta
  });
  saveData(data);
  return session;
}

/**
 * Returns summary stats of guest activity for the admin dashboard.
 */
export function getGuestActivityStats() {
  const data = loadData();
  const sessions = data.guestSessions || [];
  const config = getGuestLimitsConfig();
  const totalSessions = sessions.length;
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const activeTodaySessions = sessions.filter(s => new Date(s.lastSeen).getTime() > oneDayAgo);
  const totalOperationsToday = activeTodaySessions.reduce((acc, s) => acc + (s.operationsCount || 0), 0);
  const sessionsAtLimit = activeTodaySessions.filter(s => (s.operationsCount || 0) >= config.maxOperations).length;

  return {
    config,
    totalSessions,
    activeTodayCount: activeTodaySessions.length,
    totalOperationsToday,
    sessionsAtLimit,
    recentSessions: sessions.slice(-15).reverse().map(s => ({
      token: s.token.slice(0, 14) + '...',
      ip: s.ip ? s.ip.replace(/\.\d+$/, '.***') : 'masked',
      firstSeen: s.firstSeen,
      lastSeen: s.lastSeen,
      operationsCount: s.operationsCount || 0,
      status: (s.operationsCount || 0) >= config.maxOperations ? 'Limit Reached' : 'Active'
    }))
  };
}

/**
 * Resets all guest sessions (admin action)
 */
export function clearAllGuestSessions() {
  const data = loadData();
  data.guestSessions = [];
  saveData(data);
  return { success: true, message: 'All guest sessions have been reset.' };
}
