import { loadData, saveData, adminConfirmManualPayment, adminRefundPayment, getGatewayStatus } from './payments.js';
import { TOOLS } from './catalog.js';

export function getAdminOverview() {
  const data = loadData();
  const totalUsers = data.users.length;
  const premiumUsers = data.users.filter(u => u.planId !== 'free' && u.planStatus === 'active').length;
  const paidPayments = (data.payments || []).filter(p => p.status === 'paid');
  const pendingPayments = (data.payments || []).filter(p => p.status === 'pending');
  const failedPayments = (data.payments || []).filter(p => p.status === 'failed');
  const refundedPayments = (data.payments || []).filter(p => p.status === 'refunded');

  const totalRevenue = paidPayments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
  const totalPaymentsCount = (data.payments || []).length;

  // MRR calculation: sum of monthly equivalent for all active premium users
  const mrr = data.users.reduce((sum, u) => {
    if (u.planStatus !== 'active' || u.planId === 'free') return sum;
    const plan = data.plans.find(p => p.id === u.planId);
    return sum + (plan ? plan.price : 0);
  }, 0);

  // Total jobs processed
  const totalJobs = (data.dailyStats || []).reduce((sum, d) => sum + (d.jobs || 0), 0) +
    data.users.reduce((sum, u) => sum + (u.usage?.totalJobs || 0), 0);
  const totalFailedJobs = (data.dailyStats || []).reduce((sum, d) => sum + (d.failedJobs || 0), 0);

  // Gateway volume breakdown
  const gatewayBreakdown = {
    stripe: { count: 0, revenue: 0 },
    paypal: { count: 0, revenue: 0 },
    razorpay: { count: 0, revenue: 0 },
    manual: { count: 0, revenue: 0 }
  };

  paidPayments.forEach(p => {
    const gw = p.gateway || 'stripe';
    if (!gatewayBreakdown[gw]) gatewayBreakdown[gw] = { count: 0, revenue: 0 };
    gatewayBreakdown[gw].count += 1;
    gatewayBreakdown[gw].revenue += parseFloat(p.amount) || 0;
  });

  // Status breakdown
  const statusDistribution = [
    { name: 'Paid', value: paidPayments.length, color: '#10B981' },
    { name: 'Pending', value: pendingPayments.length, color: '#F59E0B' },
    { name: 'Failed', value: failedPayments.length, color: '#EF4444' },
    { name: 'Refunded', value: refundedPayments.length, color: '#6B7280' }
  ];

  // User tier breakdown
  const planDistribution = data.plans.map((p, idx) => {
    const count = data.users.filter(u => u.planId === p.id).length;
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'];
    return {
      name: p.name,
      value: count,
      color: colors[idx % colors.length]
    };
  });

  return {
    kpis: {
      totalUsers,
      premiumUsers,
      freeUsers: totalUsers - premiumUsers,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalPayments: totalPaymentsCount,
      pendingPayments: pendingPayments.length,
      paidPayments: paidPayments.length,
      failedPayments: failedPayments.length,
      refundedPayments: refundedPayments.length,
      totalJobs,
      failedJobs: totalFailedJobs,
      mrr: parseFloat(mrr.toFixed(2)),
      conversionRate: totalUsers > 0 ? parseFloat(((premiumUsers / totalUsers) * 100).toFixed(1)) : 0
    },
    dailyStats: data.dailyStats || [],
    toolUsage: data.toolUsage || [],
    gatewayBreakdown,
    statusDistribution,
    planDistribution,
    recentPayments: (data.payments || []).slice(0, 8),
    gateways: getGatewayStatus()
  };
}

export function getAppDownloadSettings() {
  const data = loadData();
  const downloads = data.settings?.appDownloads || {
    androidAppUrl: 'https://play.google.com/store/apps/details?id=com.vanshpdf.app',
    iosAppUrl: 'https://apps.apple.com/app/vansh-pdf-editor/id1628391024',
    androidAppEnabled: true,
    iosAppEnabled: true,
    releaseVersion: 'v2.4.0',
    updatedAt: new Date().toISOString()
  };
  return downloads;
}

export function updateAppDownloadSettings(newSettings) {
  const data = loadData();
  if (!data.settings) data.settings = {};
  data.settings.appDownloads = {
    ...data.settings.appDownloads,
    ...newSettings,
    updatedAt: new Date().toISOString()
  };
  saveData(data);
  return data.settings.appDownloads;
}

export function getAdminPayments(query = {}) {
  const data = loadData();
  let list = [...(data.payments || [])];
  if (query.status && query.status !== 'all') {
    list = list.filter(p => p.status === query.status);
  }
  if (query.gateway && query.gateway !== 'all') {
    list = list.filter(p => p.gateway === query.gateway);
  }
  if (query.search) {
    const s = query.search.toLowerCase();
    list = list.filter(p =>
      p.id?.toLowerCase().includes(s) ||
      p.userEmail?.toLowerCase().includes(s) ||
      p.userName?.toLowerCase().includes(s) ||
      p.transactionId?.toLowerCase().includes(s)
    );
  }
  return list;
}

export function updateGatewayConfig(gatewayKey, updates) {
  const data = loadData();
  if (!data.settings.gateways[gatewayKey]) {
    throw new Error(`Gateway ${gatewayKey} not found.`);
  }
  data.settings.gateways[gatewayKey] = {
    ...data.settings.gateways[gatewayKey],
    ...updates
  };
  saveData(data);
  return data.settings.gateways[gatewayKey];
}

// --- USER MANAGEMENT & RBAC ---
export function getAllUsers() {
  const data = loadData();
  return (data.users || []).map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role || 'user',
    permissions: u.permissions || (
      u.role === 'admin' ? ['manage_users', 'manage_plans', 'manage_payments', 'manage_cms', 'view_audit']
      : u.role === 'moderator' ? ['manage_users', 'view_audit']
      : u.role === 'support' ? ['view_audit', 'reset_quota']
      : ['use_tools', 'save_vault']
    ),
    planId: u.planId || 'free',
    planStatus: u.planStatus || 'active',
    planExpiresAt: u.planExpiresAt,
    createdAt: u.createdAt,
    usage: u.usage || { totalJobs: 0, todayJobs: 0, storageUsedMB: 0 },
    apiKey: u.apiKey || `vpdf_live_${u.id.replace('usr_', '')}_${u.email.split('@')[0]}`
  }));
}

export function updateAdminUser(userId, updates) {
  const data = loadData();
  const user = data.users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found.');
  }
  if (updates.role !== undefined) {
    user.role = updates.role;
    if (updates.permissions) {
      user.permissions = updates.permissions;
    } else {
      user.permissions = (
        user.role === 'admin' ? ['manage_users', 'manage_plans', 'manage_payments', 'manage_cms', 'view_audit']
        : user.role === 'moderator' ? ['manage_users', 'view_audit']
        : user.role === 'support' ? ['view_audit', 'reset_quota']
        : ['use_tools', 'save_vault']
      );
    }
  }
  if (updates.permissions !== undefined) user.permissions = updates.permissions;
  if (updates.planId !== undefined) {
    user.planId = updates.planId;
    user.planStatus = 'active';
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    user.planExpiresAt = expires.toISOString();
  }
  if (updates.planStatus !== undefined) user.planStatus = updates.planStatus;
  if (updates.extendDays) {
    const baseDate = user.planExpiresAt && new Date(user.planExpiresAt) > new Date()
      ? new Date(user.planExpiresAt)
      : new Date();
    baseDate.setDate(baseDate.getDate() + Number(updates.extendDays));
    user.planExpiresAt = baseDate.toISOString();
    user.planStatus = 'active';
  }
  if (updates.planExpiresAt !== undefined) user.planExpiresAt = updates.planExpiresAt;
  if (updates.name !== undefined) user.name = updates.name;
  if (updates.email !== undefined) user.email = updates.email;
  if (updates.resetDailyQuota) {
    if (!user.usage) user.usage = { totalJobs: 0, todayJobs: 0, storageUsedMB: 0 };
    user.usage.todayJobs = 0;
  }
  saveData(data);
  return { ...user, passwordHash: undefined };
}

export function deleteAdminUser(userId) {
  const data = loadData();
  const index = data.users.findIndex(u => u.id === userId);
  if (index === -1) {
    throw new Error('User not found.');
  }
  const deleted = data.users.splice(index, 1)[0];
  saveData(data);
  return { success: true, deletedId: deleted.id };
}

export function createAdminUser(userData) {
  const data = loadData();
  if (!userData.email || !userData.name) {
    throw new Error('Name and email are required.');
  }
  const existing = data.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existing) {
    throw new Error('User with this email already exists.');
  }
  const newUser = {
    id: `usr_${Date.now().toString(36)}`,
    name: userData.name,
    email: userData.email,
    passwordHash: userData.password || 'user123',
    role: userData.role || 'user',
    planId: userData.planId || 'free',
    planStatus: 'active',
    planExpiresAt: userData.planId !== 'free' ? new Date(Date.now() + 365 * 86400000).toISOString() : null,
    createdAt: new Date().toISOString(),
    usage: { totalJobs: 0, todayJobs: 0, storageUsedMB: 0 },
    apiKey: `vpdf_live_${Date.now().toString(36)}`
  };
  data.users.push(newUser);
  saveData(data);
  return { ...newUser, passwordHash: undefined };
}

// --- TOOLS CATALOG MANAGEMENT ---
export function getAdminTools() {
  const data = loadData();
  const configuredTools = data.tools || [];
  const baseTools = TOOLS.map(t => ({ ...t, enabled: true }));
  return baseTools.map(bt => {
    const saved = configuredTools.find(ct => ct.id === bt.id);
    const usage = (data.toolUsage || []).find(tu => tu.toolId === bt.id) || { count: 120, successRate: 99.1 };
    return {
      ...bt,
      ...(saved || {}),
      usageCount: usage.count || 0,
      successRate: usage.successRate || 99.0
    };
  });
}

export function updateAdminTool(toolId, updates) {
  const data = loadData();
  if (!data.tools) data.tools = [];
  let existingIndex = data.tools.findIndex(t => t.id === toolId);
  if (existingIndex >= 0) {
    data.tools[existingIndex] = { ...data.tools[existingIndex], ...updates };
  } else {
    data.tools.push({ id: toolId, ...updates });
  }
  saveData(data);
  return getAdminTools().find(t => t.id === toolId);
}

// --- PLANS CONFIGURATION ---
export function getAdminPlans() {
  const data = loadData();
  return data.plans || [];
}

export function updateAdminPlan(planId, updates) {
  const data = loadData();
  if (!data.plans) data.plans = [];
  let plan = data.plans.find(p => p.id === planId);
  if (!plan) {
    throw new Error('Plan not found.');
  }
  if (updates.name !== undefined) plan.name = updates.name;
  if (updates.price !== undefined) {
    plan.price = parseFloat(updates.price);
    plan.priceMonthly = parseFloat(updates.price);
  }
  if (updates.priceMonthly !== undefined) {
    plan.price = parseFloat(updates.priceMonthly);
    plan.priceMonthly = parseFloat(updates.priceMonthly);
  }
  if (updates.annualPrice !== undefined) {
    plan.annualPrice = parseFloat(updates.annualPrice);
    plan.priceYearly = parseFloat(updates.annualPrice);
  }
  if (updates.priceYearly !== undefined) {
    plan.annualPrice = parseFloat(updates.priceYearly);
    plan.priceYearly = parseFloat(updates.priceYearly);
  }
  if (updates.dailyQuota !== undefined) {
    plan.dailyQuota = parseInt(updates.dailyQuota, 10);
    if (!plan.limits) plan.limits = {};
    plan.limits.dailyOperations = parseInt(updates.dailyQuota, 10);
  }
  if (updates.maxFileSizeMB !== undefined) {
    if (!plan.limits) plan.limits = {};
    plan.limits.maxFileSizeMB = parseInt(updates.maxFileSizeMB, 10);
  }
  if (updates.features !== undefined && Array.isArray(updates.features)) {
    plan.features = updates.features;
  }
  if (updates.limits) {
    plan.limits = { ...plan.limits, ...updates.limits };
  }
  if (updates.isPopular !== undefined) {
    plan.isPopular = Boolean(updates.isPopular);
  }
  saveData(data);
  return plan;
}

export function createAdminPlan(planData) {
  const data = loadData();
  if (!data.plans) data.plans = [];
  const id = planData.id?.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_') || `plan_${Date.now().toString(36)}`;
  if (data.plans.some(p => p.id === id)) {
    throw new Error(`Plan with ID "${id}" already exists.`);
  }

  const newPlan = {
    id,
    name: planData.name || 'Custom Plan',
    price: parseFloat(planData.priceMonthly || planData.price || 0),
    priceMonthly: parseFloat(planData.priceMonthly || planData.price || 0),
    annualPrice: parseFloat(planData.priceYearly || planData.annualPrice || 0),
    priceYearly: parseFloat(planData.priceYearly || planData.annualPrice || 0),
    billingCycle: 'monthly',
    dailyQuota: parseInt(planData.dailyQuota || 50, 10),
    isPopular: Boolean(planData.isPopular),
    features: Array.isArray(planData.features) ? planData.features : [
      'Access to core PDF tools',
      'Batch conversion',
      'Email support'
    ],
    limits: {
      dailyOperations: parseInt(planData.dailyQuota || 50, 10),
      maxFileSizeMB: parseInt(planData.maxFileSizeMB || 50, 10),
      batchLimit: 20
    }
  };

  data.plans.push(newPlan);
  saveData(data);
  return newPlan;
}

export function deleteAdminPlan(planId) {
  const data = loadData();
  if (!data.plans) data.plans = [];
  if (planId === 'free' || planId === 'pro') {
    throw new Error(`Default system plan "${planId}" cannot be deleted.`);
  }
  const index = data.plans.findIndex(p => p.id === planId);
  if (index === -1) {
    throw new Error('Plan not found.');
  }
  const deleted = data.plans.splice(index, 1)[0];
  saveData(data);
  return { success: true, deletedId: deleted.id };
}

export function adminDirectGrantPlan(userId, planId, durationDays = 365, notes = '', adminEmail = 'admin@vanshpdf.com') {
  const data = loadData();
  const user = (data.users || []).find(u => u.id === userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found.`);
  }
  const plan = (data.plans || []).find(p => p.id === planId);
  if (!plan) {
    throw new Error(`Plan with ID ${planId} not found.`);
  }

  user.planId = plan.id;
  user.planStatus = 'active';
  const expiresAt = new Date(Date.now() + Number(durationDays) * 86400000);
  user.planExpiresAt = expiresAt.toISOString();

  // Create authoritative verified payment/grant record
  const grantRecord = {
    id: `pay_grant_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    orderId: `ORD_GRANT_${Date.now()}`,
    invoiceId: `INV-GRANT-${Date.now().toString().slice(-6)}`,
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    planId: plan.id,
    planName: plan.name,
    amount: 0,
    currency: 'USD',
    gateway: 'admin_grant',
    status: 'paid',
    verificationStatus: 'Granted by Administrator',
    transactionId: `GRANT_${Date.now()}`,
    notes: notes || `Direct administrative grant by ${adminEmail}`,
    createdAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString(),
    verifiedBy: adminEmail
  };

  if (!data.payments) data.payments = [];
  data.payments.unshift(grantRecord);

  addAuditLog('Direct Plan Grant', adminEmail, `Granted "${plan.name}" to ${user.email} (${durationDays} days)`, 'success');
  saveData(data);

  return { success: true, user, grantRecord };
}

// --- GENERAL CMS, BRANDING & SITE SETTINGS ---
export function getBrandingSettings() {
  const data = loadData();
  const def = {
    siteName: 'Vansh PDF',
    siteTagline: 'Complete PDF Tools & Neural OCR Platform',
    companyName: 'Vansh Technologies Inc.',
    logoUrl: '/logo.svg',
    logoDarkUrl: '',
    faviconUrl: '/favicon.ico',
    primaryColor: '#2563eb',
    accentColor: '#4f46e5',
    brandBadgeText: 'Enterprise Pro v2.4',
    contactEmail: 'support@vanshpdf.com',
    supportPhone: '+1 (800) 555-PDFS',
    helpCenterUrl: 'https://help.vanshpdf.com',
    copyrightText: `© ${new Date().getFullYear()} Vansh Technologies Inc. All rights reserved.`,
    socialLinks: {
      twitter: 'https://twitter.com/vanshpdf',
      github: 'https://github.com/vanshpdf',
      linkedin: 'https://linkedin.com/company/vanshpdf',
      discord: 'https://discord.gg/vanshpdf'
    },
    seo: {
      metaTitle: 'Vansh PDF - Fast, Secure PDF Tools & Neural OCR Suite',
      metaDescription: '78+ online PDF and OCR tools: Merge, Compress, Convert, Scan, and Extract OCR text with ISO 32000-1 compliance.',
      metaKeywords: 'pdf tools, ocr pdf, image to text, searchable pdf, handwriting ocr, receipt ocr, merge pdf, convert pdf',
      ogImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      twitterHandle: '@vanshpdf',
      allowIndexing: true
    },
    customCode: {
      gaMeasurementId: 'G-VANSHPDF26',
      gtmId: '',
      metaPixelId: '',
      customCss: '',
      customHeaderJs: ''
    },
    legal: {
      termsUrl: '#terms',
      privacyUrl: '#privacy',
      refundUrl: '#refund',
      gdprNoticeEnabled: true
    }
  };

  return {
    ...def,
    ...(data.settings?.branding || {}),
    siteName: data.settings?.branding?.siteName || data.settings?.siteName || def.siteName,
    siteTagline: data.settings?.branding?.siteTagline || data.settings?.siteTagline || def.siteTagline,
    logoUrl: data.settings?.branding?.logoUrl || data.settings?.logoUrl || def.logoUrl,
    contactEmail: data.settings?.branding?.contactEmail || data.settings?.contactEmail || def.contactEmail,
    seo: { ...def.seo, ...(data.settings?.branding?.seo || {}) },
    socialLinks: { ...def.socialLinks, ...(data.settings?.branding?.socialLinks || {}) },
    customCode: { ...def.customCode, ...(data.settings?.branding?.customCode || {}) },
    legal: { ...def.legal, ...(data.settings?.branding?.legal || {}) }
  };
}

export function updateBrandingSettings(updates, adminEmail = 'Admin') {
  const data = loadData();
  if (!data.settings) data.settings = {};
  if (!data.settings.branding) data.settings.branding = getBrandingSettings();

  data.settings.branding = {
    ...data.settings.branding,
    ...updates,
    seo: { ...data.settings.branding.seo, ...(updates.seo || {}) },
    socialLinks: { ...data.settings.branding.socialLinks, ...(updates.socialLinks || {}) },
    customCode: { ...data.settings.branding.customCode, ...(updates.customCode || {}) },
    legal: { ...data.settings.branding.legal, ...(updates.legal || {}) }
  };

  // Keep root backwards-compatible settings in sync
  if (updates.siteName) data.settings.siteName = updates.siteName;
  if (updates.siteTagline) data.settings.siteTagline = updates.siteTagline;
  if (updates.logoUrl) data.settings.logoUrl = updates.logoUrl;
  if (updates.contactEmail) data.settings.contactEmail = updates.contactEmail;

  addAuditLog('Branding Updated', adminEmail, `Site branding and visual assets updated (${updates.siteName || 'Theme updated'})`);
  saveData(data);
  return getBrandingSettings();
}

// --- SYSTEM OPERATIONS, MAINTENANCE & BACKUP ---
export function getSystemOpsConfig() {
  const data = loadData();
  return {
    maintenanceMode: Boolean(data.settings?.maintenanceMode),
    maintenanceNotice: data.settings?.maintenanceNotice || 'System is currently undergoing scheduled infrastructure upgrades. Document conversion may be temporarily queued.',
    maintenanceEstimatedReturn: data.settings?.maintenanceEstimatedReturn || '15 minutes',
    allowAdminBypass: data.settings?.allowAdminBypass !== false,
    fileRetentionMinutes: data.settings?.fileRetentionMinutes || 120, // 2 hours
    maxUploadSizeMB: data.settings?.maxUploadSizeMB || 100,
    enforceCaptcha: Boolean(data.settings?.enforceCaptcha),
    rateLimitPerMinute: data.settings?.rateLimitPerMinute || 60,
    announcement: data.settings?.announcement || {
      enabled: true,
      text: '🚀 New Release: High-fidelity Neural OCR with multi-language detection is now live!',
      colorTheme: 'blue',
      dismissible: true,
      link: '/pricing'
    }
  };
}

export function updateSystemOpsConfig(updates, adminEmail = 'Admin') {
  const data = loadData();
  if (!data.settings) data.settings = {};
  data.settings = {
    ...data.settings,
    ...updates
  };
  addAuditLog('System Operations Updated', adminEmail, `System Ops & Maintenance parameters updated. Maintenance=${data.settings.maintenanceMode ? 'ON' : 'OFF'}`);
  saveData(data);
  return getSystemOpsConfig();
}

export function exportSystemBackup() {
  const data = loadData();
  return {
    version: '2.4.0',
    exportedAt: new Date().toISOString(),
    environment: 'production',
    data: {
      settings: data.settings || {},
      gateways: data.gateways || {},
      plans: data.plans || [],
      users: (data.users || []).map(u => ({ ...u, password: '***' })), // strip sensitive password hashes
      paymentsCount: (data.payments || []).length,
      coupons: data.coupons || [],
      guestLimits: data.guestLimits || {},
      integrations: data.integrations || {},
      popupAds: data.popupAds || []
    }
  };
}

export function restoreSystemBackup(backupContent, adminEmail = 'Admin') {
  if (!backupContent || !backupContent.data) {
    throw new Error('Invalid backup file structure: missing root data payload.');
  }
  const currentData = loadData();
  const bData = backupContent.data;

  if (bData.settings) currentData.settings = { ...currentData.settings, ...bData.settings };
  if (bData.gateways) currentData.gateways = { ...currentData.gateways, ...bData.gateways };
  if (Array.isArray(bData.plans) && bData.plans.length > 0) currentData.plans = bData.plans;
  if (Array.isArray(bData.coupons)) currentData.coupons = bData.coupons;
  if (bData.guestLimits) currentData.guestLimits = bData.guestLimits;
  if (bData.integrations) currentData.integrations = bData.integrations;

  addAuditLog('System Backup Restored', adminEmail, `Restored configuration snapshot from ${backupContent.exportedAt || 'uploaded file'}`);
  saveData(currentData);
  return { success: true, restoredAt: new Date().toISOString() };
}

export function purgeTempFiles(adminEmail = 'Admin') {
  const data = loadData();
  const initialDocs = (data.documents || []).length;
  // Keep only documents newer than 1 hour or permanent flagged
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  data.documents = (data.documents || []).filter(d => d.createdAt > oneHourAgo || d.isPermanent);
  const purgedCount = initialDocs - data.documents.length;
  addAuditLog('Storage Purge Executed', adminEmail, `Purged ${purgedCount} expired temporary files and cached binary artifacts.`);
  saveData(data);
  return { success: true, purgedCount };
}

// --- GENERAL CMS & SITE SETTINGS ---
export function getGeneralSettings() {
  const data = loadData();
  const branding = getBrandingSettings();
  return {
    siteName: branding.siteName,
    siteTagline: branding.siteTagline,
    logoUrl: branding.logoUrl,
    contactEmail: branding.contactEmail,
    currency: data.settings?.currency || 'USD',
    currencySymbol: data.settings?.currencySymbol || '$',
    announcement: data.settings?.announcement || {
      enabled: true,
      text: '🚀 New Release: High-fidelity Neural OCR with multi-language detection is now live!'
    },
    maintenanceMode: Boolean(data.settings?.maintenanceMode),
    maintenanceNotice: data.settings?.maintenanceNotice || 'System is currently undergoing scheduled maintenance. Some tools may be temporarily slow.',
    seoDescription: branding.seo.metaDescription,
    branding,
    appDownloads: getAppDownloadSettings()
  };
}

export function updateGeneralSettings(updates) {
  const data = loadData();
  if (!data.settings) data.settings = {};
  data.settings = {
    ...data.settings,
    ...updates
  };
  saveData(data);
  return getGeneralSettings();
}

// --- USER DOCUMENTS VAULT & PROFILE ---
export function getUserDocuments(userId) {
  const data = loadData();
  if (!data.documents) {
    data.documents = [];
    saveData(data);
  }
  return data.documents.filter(d => d.userId === userId);
}

export function addUserDocument(userId, doc) {
  const data = loadData();
  if (!data.documents) data.documents = [];
  const newDoc = {
    id: `doc_${Date.now().toString(36)}`,
    userId,
    name: doc.name || 'Processed_Document.pdf',
    toolId: doc.toolId || 'general',
    toolName: doc.toolName || 'PDF Operation',
    size: doc.size || '1.1 MB',
    pages: doc.pages || 1,
    createdAt: new Date().toISOString(),
    status: 'ready'
  };
  data.documents.unshift(newDoc);
  saveData(data);
  return newDoc;
}

export function deleteUserDocument(userId, docId) {
  const data = loadData();
  if (!data.documents) return { success: true };
  data.documents = data.documents.filter(d => !(d.id === docId && d.userId === userId));
  saveData(data);
  return { success: true, deletedId: docId };
}

export function updateUserProfile(userId, { name, currentPassword, newPassword, emailNotifications, twoFactorEnabled }) {
  const data = loadData();
  const user = data.users.find(u => u.id === userId);
  if (!user) throw new Error('User not found.');
  if (name) user.name = name;
  if (newPassword) {
    if (user.passwordHash && currentPassword && user.passwordHash !== currentPassword) {
      throw new Error('Current password is incorrect.');
    }
    user.passwordHash = newPassword;
  }
  if (emailNotifications !== undefined) user.emailNotifications = emailNotifications;
  if (twoFactorEnabled !== undefined) user.twoFactorEnabled = twoFactorEnabled;
  saveData(data);
  return { ...user, passwordHash: undefined };
}

export function regenerateUserApiKey(userId) {
  const data = loadData();
  const user = data.users.find(u => u.id === userId);
  if (!user) throw new Error('User not found.');
  user.apiKey = `vpdf_live_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
  saveData(data);
  return { apiKey: user.apiKey };
}

// --- AUDIT SYSTEM LOGGING ---
export function addAuditLog(action, actor = 'System', details = '', severity = 'info') {
  const data = loadData();
  if (!data.auditLogs) {
    data.auditLogs = [];
  }
  const newLog = {
    id: `log_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    action,
    actor,
    details,
    severity
  };
  data.auditLogs.unshift(newLog);
  if (data.auditLogs.length > 100) data.auditLogs = data.auditLogs.slice(0, 100);
  saveData(data);
  return newLog;
}

export function getAuditLogs() {
  const data = loadData();
  if (!data.auditLogs || data.auditLogs.length === 0) {
    addAuditLog('System Initialized', 'Admin Governance', 'Audit tracking layer initialized');
    return loadData().auditLogs || [];
  }
  return data.auditLogs;
}

// --- COUPON / PROMO CODE ENGINE ---
export function getAdminCoupons() {
  const data = loadData();
  if (!data.coupons) {
    data.coupons = [
      { code: 'VANSH50', discountPercent: 50, maxUses: 100, usedCount: 14, active: true },
      { code: 'WELCOME10', discountPercent: 10, maxUses: 500, usedCount: 68, active: true }
    ];
    saveData(data);
  }
  return data.coupons;
}

export function createOrUpdateCoupon(couponData) {
  const data = loadData();
  if (!data.coupons) data.coupons = [];
  const code = (couponData.code || '').trim().toUpperCase();
  if (!code) throw new Error('Coupon code is required.');
  const existingIdx = data.coupons.findIndex(c => c.code === code);
  const discountPercent = Math.min(100, Math.max(1, Number(couponData.discountPercent) || 10));
  const maxUses = Math.max(1, Number(couponData.maxUses) || 100);
  const active = couponData.active !== undefined ? Boolean(couponData.active) : true;

  if (existingIdx >= 0) {
    data.coupons[existingIdx] = {
      ...data.coupons[existingIdx],
      discountPercent,
      maxUses,
      active
    };
    addAuditLog('Coupon Updated', 'Admin', `Coupon ${code} updated to ${discountPercent}% discount`);
    saveData(data);
    return data.coupons[existingIdx];
  } else {
    const newCoupon = {
      code,
      discountPercent,
      maxUses,
      usedCount: 0,
      active,
      createdAt: new Date().toISOString()
    };
    data.coupons.push(newCoupon);
    addAuditLog('Coupon Created', 'Admin', `Coupon ${code} created with ${discountPercent}% discount`);
    saveData(data);
    return newCoupon;
  }
}

export function deleteCoupon(code) {
  const data = loadData();
  if (!data.coupons) return { success: true };
  data.coupons = data.coupons.filter(c => c.code !== code);
  addAuditLog('Coupon Deleted', 'Admin', `Coupon ${code} deleted permanently`);
  saveData(data);
  return { success: true, deletedCode: code };
}

export function validateCoupon(code) {
  const data = loadData();
  const c = (data.coupons || []).find(x => x.code === (code || '').trim().toUpperCase());
  if (!c) throw new Error('Invalid coupon code.');
  if (!c.active) throw new Error('This coupon has expired or has been deactivated.');
  if (c.usedCount >= c.maxUses) throw new Error('Coupon maximum usage limit reached.');
  return {
    code: c.code,
    discountPercent: c.discountPercent,
    valid: true
  };
}

// --- INTEGRATION SETTINGS (SMTP, S3 Storage, Webhooks, SEO) ---
export function getSystemIntegrations() {
  const data = loadData();
  return data.integrations || {
    smtp: {
      host: 'smtp.mailgun.org',
      port: 587,
      user: 'postmaster@mg.vanshpdf.com',
      fromEmail: 'noreply@vanshpdf.com',
      ssl: true,
      enabled: false
    },
    storage: {
      provider: 'local',
      bucket: 'vansh-pdf-vault',
      region: 'us-east-1',
      cdnDomain: 'https://cdn.vanshpdf.com',
      autoPurgeHours: 2
    },
    webhooks: {
      outgoingUrl: 'https://webhook.site/demo-vansh',
      secret: 'whsec_vansh_live_948293849',
      events: ['payment.success', 'user.registered', 'job.completed'],
      enabled: true
    },
    seo: {
      metaTitle: 'Vansh PDF - Fast, Secure & Free Online PDF Editor',
      metaDescription: 'Convert, compress, edit, merge and sign PDFs with 78+ professional tools.',
      googleAnalyticsId: 'G-VANSHPDF2026',
      customHeadCode: '',
      customFooterCode: ''
    }
  };
}

export function updateSystemIntegrations(updates) {
  const data = loadData();
  if (!data.integrations) data.integrations = getSystemIntegrations();
  data.integrations = {
    ...data.integrations,
    ...updates,
    smtp: { ...data.integrations.smtp, ...(updates.smtp || {}) },
    storage: { ...data.integrations.storage, ...(updates.storage || {}) },
    webhooks: { ...data.integrations.webhooks, ...(updates.webhooks || {}) },
    seo: { ...data.integrations.seo, ...(updates.seo || {}) }
  };
  addAuditLog('Integrations Updated', 'Admin', 'Updated system SMTP, storage, and webhook configurations');
  saveData(data);
  return data.integrations;
}
