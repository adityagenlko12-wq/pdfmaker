import { loadData, saveData } from './payments.js';
import { addAuditLog } from './admin-saas.js';

/**
 * Default seeded popup ads
 */
const DEFAULT_POPUP_ADS = [
  {
    id: 'ad_popup_pro_promo',
    title: 'Spring Special: 50% Off Pro Annual Access',
    enabled: true,
    adType: 'custom_html', // 'custom_html' | 'adsense' | 'banner'
    content: {
      html: `<div style="text-align:center; padding: 24px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <span style="background: #eff6ff; color: #2563eb; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 10px; border-radius: 9999px; display: inline-block; margin-bottom: 12px;">🎉 Limited Time Offer</span>
  <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 800; color: #111827;">Unlock Unlimited PDF Power</h3>
  <p style="margin: 0 0 18px 0; font-size: 13px; color: #4b5563; line-height: 1.5;">Batch convert up to 2GB files, remove all waiting queues, OCR scanned pages & access 78+ premium PDF tools with zero ads.</p>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 12px; margin-bottom: 18px; text-align: left;">
    <div style="font-size: 12px; font-weight: 600; color: #059669; display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">✓ Unlimited 2GB File Size Limit</div>
    <div style="font-size: 12px; font-weight: 600; color: #059669; display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">✓ High-Accuracy OCR Text Recognition</div>
    <div style="font-size: 12px; font-weight: 600; color: #059669; display: flex; align-items: center; gap: 6px;">✓ 100% Ad-Free Experience for Teams</div>
  </div>
  <a href="#/pricing" style="display: block; width: 100%; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 700; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25); text-align: center; box-sizing: border-box;">Claim 50% Off Pro Now →</a>
  <span style="display: block; font-size: 11px; color: #9ca3af; margin-top: 10px;">Cancel anytime • 30-day money-back guarantee</span>
</div>`,
      adSenseClient: 'ca-pub-1234567890123456',
      adSenseSlot: '9876543210',
      bannerImageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
      bannerTargetUrl: '#/pricing',
      bannerHeadline: 'Upgrade to Vansh PDF Pro',
      bannerSubtext: 'Batch process up to 2GB PDFs with priority OCR and zero ads.'
    },
    position: 'top', // 'center' | 'bottom' | 'top'
    device: 'all', // 'all' | 'desktop' | 'mobile'
    displayTiming: 'immediately', // 'immediately' | 'delay'
    delaySeconds: 0,
    frequency: 'every_page', // 'once_per_session' | 'every_page'
    showCloseButton: true,
    closeButtonDelay: 0,
    targetPages: ['all'], // ['all'] or ['home', 'pricing', 'tool:*', etc.]
    maxWidth: 600,
    impressions: 342,
    clicks: 76,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ad_popup_compress_toast',
    title: 'Top Toast: High-Compression PDF Engine',
    enabled: true,
    adType: 'banner',
    content: {
      html: '',
      adSenseClient: '',
      adSenseSlot: '',
      bannerImageUrl: '',
      bannerTargetUrl: '#/tool:compress-pdf',
      bannerHeadline: 'Reduce PDF File Size by up to 90%',
      bannerSubtext: 'Our lossless compression keeps maximum visual clarity for web & email attachments.'
    },
    position: 'top',
    device: 'all',
    displayTiming: 'delay',
    delaySeconds: 3,
    frequency: 'once_per_session',
    showCloseButton: true,
    closeButtonDelay: 0,
    targetPages: ['home', 'pricing', 'tool:merge-pdf'],
    maxWidth: 480,
    impressions: 118,
    clicks: 22,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Initializes and gets all popup ads from database
 */
export function getAllPopupAds() {
  const data = loadData();
  if (!data.popupAds) {
    data.popupAds = DEFAULT_POPUP_ADS;
    saveData(data);
  }
  return data.popupAds;
}

/**
 * Returns active popup ads matching current page and device for clients
 */
export function getActivePopupAds(targetPage = 'home', device = 'all') {
  const ads = getAllPopupAds();
  const pageNorm = (targetPage || 'home').toLowerCase().trim();

  return ads.filter(ad => {
    if (!ad.enabled) return false;

    // Device check
    if (ad.device && ad.device !== 'all') {
      if (device && device !== 'all' && ad.device !== device) {
        return false;
      }
    }

    // Page check
    if (!ad.targetPages || ad.targetPages.length === 0 || ad.targetPages.includes('all')) {
      return true;
    }

    // Specific match or wildcard
    return ad.targetPages.some(tp => {
      const tpNorm = tp.toLowerCase().trim();
      if (tpNorm === 'all') return true;
      if (tpNorm === pageNorm) return true;
      if (tpNorm === 'tool:*' && pageNorm.startsWith('tool:')) return true;
      return false;
    });
  });
}

/**
 * Creates a new popup ad
 */
export function createPopupAd(payload, adminEmail = 'admin@vanshpdf.com') {
  const data = loadData();
  if (!data.popupAds) data.popupAds = DEFAULT_POPUP_ADS;

  const id = `ad_popup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newAd = {
    id,
    title: payload.title?.trim() || 'Untitled Popup Ad',
    enabled: payload.enabled !== false,
    adType: payload.adType || 'custom_html', // 'custom_html' | 'adsense' | 'banner'
    content: {
      html: payload.content?.html || '',
      adSenseClient: payload.content?.adSenseClient || '',
      adSenseSlot: payload.content?.adSenseSlot || '',
      bannerImageUrl: payload.content?.bannerImageUrl || '',
      bannerTargetUrl: payload.content?.bannerTargetUrl || '#/pricing',
      bannerHeadline: payload.content?.bannerHeadline || '',
      bannerSubtext: payload.content?.bannerSubtext || ''
    },
    position: payload.position || 'top', // 'center' | 'bottom' | 'top'
    device: payload.device || 'all', // 'all' | 'desktop' | 'mobile'
    displayTiming: payload.displayTiming || 'delay', // 'immediately' | 'delay'
    delaySeconds: Math.max(0, parseInt(payload.delaySeconds) || 0),
    frequency: payload.frequency || 'once_per_session', // 'once_per_session' | 'every_page'
    showCloseButton: payload.showCloseButton !== false,
    closeButtonDelay: Math.max(0, parseInt(payload.closeButtonDelay) || 0),
    targetPages: Array.isArray(payload.targetPages) && payload.targetPages.length > 0 ? payload.targetPages : ['all'],
    maxWidth: parseInt(payload.maxWidth) || 480,
    impressions: 0,
    clicks: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.popupAds.unshift(newAd);
  saveData(data);
  addAuditLog('Popup Ad Created', adminEmail, `Created popup ad "${newAd.title}" [${newAd.id}]`, 'info');
  return newAd;
}

/**
 * Updates an existing popup ad
 */
export function updatePopupAd(id, updates, adminEmail = 'admin@vanshpdf.com') {
  const data = loadData();
  if (!data.popupAds) data.popupAds = DEFAULT_POPUP_ADS;

  const index = data.popupAds.findIndex(a => a.id === id);
  if (index === -1) {
    throw new Error(`Popup Ad with id ${id} not found.`);
  }

  const existing = data.popupAds[index];
  const updatedAd = {
    ...existing,
    ...updates,
    content: {
      ...existing.content,
      ...(updates.content || {})
    },
    delaySeconds: updates.delaySeconds !== undefined ? Math.max(0, parseInt(updates.delaySeconds) || 0) : existing.delaySeconds,
    closeButtonDelay: updates.closeButtonDelay !== undefined ? Math.max(0, parseInt(updates.closeButtonDelay) || 0) : existing.closeButtonDelay,
    maxWidth: updates.maxWidth ? parseInt(updates.maxWidth) || 480 : existing.maxWidth,
    updatedAt: new Date().toISOString()
  };

  data.popupAds[index] = updatedAd;
  saveData(data);
  addAuditLog('Popup Ad Updated', adminEmail, `Updated popup ad "${updatedAd.title}" [${id}]`, 'info');
  return updatedAd;
}

/**
 * Deletes a popup ad
 */
export function deletePopupAd(id, adminEmail = 'admin@vanshpdf.com') {
  const data = loadData();
  if (!data.popupAds) data.popupAds = DEFAULT_POPUP_ADS;

  const index = data.popupAds.findIndex(a => a.id === id);
  if (index === -1) {
    throw new Error(`Popup Ad with id ${id} not found.`);
  }

  const removed = data.popupAds.splice(index, 1)[0];
  saveData(data);
  addAuditLog('Popup Ad Deleted', adminEmail, `Deleted popup ad "${removed.title}" [${id}]`, 'warning');
  return { success: true, id };
}

/**
 * Toggles enabled state of popup ad
 */
export function togglePopupAdStatus(id, enabled, adminEmail = 'admin@vanshpdf.com') {
  return updatePopupAd(id, { enabled: Boolean(enabled) }, adminEmail);
}

/**
 * Tracks impression count
 */
export function recordAdImpression(id) {
  const data = loadData();
  if (!data.popupAds) return false;
  const ad = data.popupAds.find(a => a.id === id);
  if (ad) {
    ad.impressions = (ad.impressions || 0) + 1;
    saveData(data);
    return true;
  }
  return false;
}

/**
 * Tracks click count
 */
export function recordAdClick(id) {
  const data = loadData();
  if (!data.popupAds) return false;
  const ad = data.popupAds.find(a => a.id === id);
  if (ad) {
    ad.clicks = (ad.clicks || 0) + 1;
    saveData(data);
    return true;
  }
  return false;
}

/**
 * Resets impression/click counters for an ad
 */
export function resetAdAnalytics(id, adminEmail = 'admin@vanshpdf.com') {
  const data = loadData();
  if (!data.popupAds) return false;
  const ad = data.popupAds.find(a => a.id === id);
  if (ad) {
    ad.impressions = 0;
    ad.clicks = 0;
    ad.updatedAt = new Date().toISOString();
    saveData(data);
    addAuditLog('Popup Ad Analytics Reset', adminEmail, `Reset impression/click counters for "${ad.title}" [${id}]`, 'info');
    return true;
  }
  return false;
}
