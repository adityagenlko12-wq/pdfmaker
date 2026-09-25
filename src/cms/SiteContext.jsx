import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vansh_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [settings, setSettings] = useState({
    siteName: 'Vansh PDF',
    siteTagline: 'Complete PDF Tools & SaaS Platform',
    currency: 'USD',
    currencySymbol: '$',
    appDownloads: {
      androidAppUrl: 'https://play.google.com/store/apps/details?id=com.vanshpdf.app',
      iosAppUrl: 'https://apps.apple.com/app/vansh-pdf-editor/id1628391024',
      androidAppEnabled: true,
      iosAppEnabled: true
    },
    gateways: []
  });

  const [loading, setLoading] = useState(true);

  const applyBrandingToDom = (b) => {
    if (!b || typeof window === 'undefined') return;
    try {
      if (b.siteName) {
        document.title = b.seo?.metaTitle || `${b.siteName} - ${b.siteTagline || 'PDF & OCR Intelligence Platform'}`;
      }
      if (b.seo?.metaDescription) {
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', b.seo.metaDescription);
      }
      if (b.primaryColor) {
        document.documentElement.style.setProperty('--brand-primary', b.primaryColor);
      }
      if (b.accentColor) {
        document.documentElement.style.setProperty('--brand-accent', b.accentColor);
      }
    } catch (e) {
      console.warn('DOM branding sync notice:', e);
    }
  };

  const updateBrandingState = (newBranding) => {
    setSettings(prev => ({
      ...prev,
      branding: newBranding,
      siteName: newBranding.siteName || prev.siteName,
      siteTagline: newBranding.siteTagline || prev.siteTagline,
      logoUrl: newBranding.logoUrl || prev.logoUrl
    }));
    applyBrandingToDom(newBranding);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        if (data.branding) {
          applyBrandingToDom(data.branding);
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${user.id}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('vansh_user', JSON.stringify(data.user));
        }
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
    if (user?.id) {
      refreshUser();
    }
  }, []);

  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    try {
      return localStorage.getItem('vansh_currency') || 'USD';
    } catch {
      return 'USD';
    }
  });

  const availableCurrencies = settings?.currencies || [
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5 },
    { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
    { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
    { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rate: 3.67 },
    { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rate: 1.36 },
    { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', rate: 1.52 }
  ];

  const currentCurrencyObj = availableCurrencies.find(c => c.code === selectedCurrency) || availableCurrencies[0];

  const changeCurrency = (code) => {
    setSelectedCurrency(code);
    try {
      localStorage.setItem('vansh_currency', code);
    } catch (e) {
      console.error(e);
    }
  };

  const convertPrice = (usdAmount) => {
    if (!usdAmount && usdAmount !== 0) return 0;
    const rate = currentCurrencyObj?.rate || 1.0;
    return parseFloat((usdAmount * rate).toFixed(2));
  };

  const formatPrice = (usdAmount) => {
    const converted = convertPrice(usdAmount);
    const symbol = currentCurrencyObj?.symbol || '$';
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    try {
      return localStorage.getItem('vansh_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const currentLanguageObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    try {
      document.documentElement.lang = selectedLanguage;
      document.documentElement.dir = currentLanguageObj.dir || 'ltr';
    } catch (e) {
      console.error(e);
    }
  }, [selectedLanguage, currentLanguageObj]);

  const changeLanguage = (code) => {
    setSelectedLanguage(code);
    try {
      localStorage.setItem('vansh_lang', code);
      const langObj = SUPPORTED_LANGUAGES.find(l => l.code === code);
      if (langObj) {
        document.documentElement.lang = code;
        document.documentElement.dir = langObj.dir || 'ltr';
      }
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key, fallback = '') => {
    return TRANSLATIONS[selectedLanguage]?.[key] || TRANSLATIONS.en?.[key] || fallback || key;
  };

  // Admin Impersonation Support
  const [impersonatorAdmin, setImpersonatorAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('vansh_impersonator_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const startImpersonation = (targetUser) => {
    if (!user) return;
    const adminBackup = impersonatorAdmin || user;
    setImpersonatorAdmin(adminBackup);
    localStorage.setItem('vansh_impersonator_admin', JSON.stringify(adminBackup));
    
    // Set target user as active user
    setUser({ ...targetUser, isImpersonated: true });
    localStorage.setItem('vansh_user', JSON.stringify({ ...targetUser, isImpersonated: true }));
  };

  const stopImpersonating = () => {
    if (!impersonatorAdmin) return;
    setUser(impersonatorAdmin);
    localStorage.setItem('vansh_user', JSON.stringify(impersonatorAdmin));
    setImpersonatorAdmin(null);
    localStorage.removeItem('vansh_impersonator_admin');
  };

  // Popup Ads & Top Preview Notification State
  const [popupSettings, setPopupSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('vansh_popup_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      enabled: true,
      position: 'top',
      title: 'Vansh PDF Enterprise Pro is Live',
      message: 'Unlock unlimited high-fidelity OCR, bulk processing, and automated API webhooks. Upgrade today for 20% off.',
      ctaText: 'Upgrade to Pro',
      ctaLink: '/pricing',
      delaySeconds: 1,
      showBadge: true,
      badgeText: 'TOP PREVIEW NOTIFICATION',
      isDismissed: false
    };
  });

  const dismissPopup = () => {
    setPopupSettings(prev => ({ ...prev, isDismissed: true }));
  };

  const triggerPreviewPopup = () => {
    setPopupSettings(prev => ({ ...prev, enabled: true, isDismissed: false }));
  };

  const updatePopupSettings = (newSettings) => {
    setPopupSettings(prev => {
      const updated = { ...prev, ...newSettings, isDismissed: false };
      try {
        localStorage.setItem('vansh_popup_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message, title = '') => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('vansh_user', JSON.stringify(userData));
    localStorage.setItem('vansh_token', token || userData.id);
  };

  const logout = () => {
    setUser(null);
    setImpersonatorAdmin(null);
    localStorage.removeItem('vansh_user');
    localStorage.removeItem('vansh_token');
    localStorage.removeItem('vansh_impersonator_admin');
  };

  return (
    <SiteContext.Provider
      value={{
        user,
        settings,
        loading,
        login,
        logout,
        refreshUser,
        fetchSettings,
        updateBrandingState,
        setUser,
        impersonatorAdmin,
        isImpersonating: Boolean(impersonatorAdmin),
        startImpersonation,
        stopImpersonating,
        selectedCurrency,
        currentCurrencyObj,
        availableCurrencies,
        changeCurrency,
        convertPrice,
        formatPrice,
        selectedLanguage,
        currentLanguageObj,
        supportedLanguages: SUPPORTED_LANGUAGES,
        changeLanguage,
        t,
        popupSettings,
        dismissPopup,
        triggerPreviewPopup,
        updatePopupSettings,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
