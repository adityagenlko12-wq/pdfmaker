import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../i18n/translations';

export type UserRole = 'admin' | 'user';
export type PlanTier = 'free' | 'pro' | 'enterprise';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: PlanTier;
  avatarUrl?: string;
  joinedDate: string;
  apiKey: string;
  usageThisMonth: number;
  monthlyLimit: number;
}

export interface InvoiceRecord {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  plan: PlanTier;
  items: Array<{ description: string; quantity: number; unitPrice: number; total: number }>;
  customerName: string;
  customerEmail: string;
}

export interface PopupSettings {
  enabled: boolean;
  position: 'top' | 'bottom'; // Moved to top by default as requested!
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  delaySeconds: number;
  showBadge: boolean;
  badgeText: string;
  isDismissed: boolean;
}

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

export interface SiteContextType {
  user: UserAccount;
  effectiveUser: UserAccount;
  impersonatedUser: UserAccount | null;
  startImpersonation: (target: UserAccount) => void;
  stopImpersonation: () => void;
  switchUser: (account: UserAccount) => void;
  updateUserPlan: (plan: PlanTier) => void;
  regenerateApiKey: () => void;

  theme: 'dark' | 'light';
  toggleTheme: () => void;

  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;

  currency: string;
  setCurrency: (c: string) => void;
  formatCurrency: (amount: number) => string;

  popupSettings: PopupSettings;
  updatePopupSettings: (partial: Partial<PopupSettings>) => void;
  dismissPopup: () => void;
  triggerPreviewPopup: () => void;

  favorites: string[];
  toggleFavorite: (toolId: string) => void;

  recentRuns: Array<{ id: string; toolId: string; toolName: string; timestamp: string }>;
  recordToolRun: (toolId: string, toolName: string) => void;

  invoices: InvoiceRecord[];
  addInvoice: (invoice: InvoiceRecord) => void;

  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;

  activeToolsList: string[];
  toggleToolStatus: (toolId: string) => void;
}

const DEMO_USERS: UserAccount[] = [
  {
    id: 'usr_admin_01',
    name: 'Alex Watson',
    email: 'alexwatson0786@gmail.com',
    role: 'admin',
    plan: 'enterprise',
    joinedDate: 'Jan 15, 2025',
    apiKey: 'tm_live_a94f8302e8812c77f01c',
    usageThisMonth: 12450,
    monthlyLimit: 100000
  },
  {
    id: 'usr_pro_02',
    name: 'Elena Rostova',
    email: 'elena.rostova@devteam.io',
    role: 'user',
    plan: 'pro',
    joinedDate: 'Mar 10, 2025',
    apiKey: 'tm_live_7710bc44e09f823a1',
    usageThisMonth: 4890,
    monthlyLimit: 25000
  },
  {
    id: 'usr_free_03',
    name: 'Guest Developer',
    email: 'guest.coder@gmail.com',
    role: 'user',
    plan: 'free',
    joinedDate: 'Sep 01, 2026',
    apiKey: 'tm_live_free_demo_key_99',
    usageThisMonth: 18,
    monthlyLimit: 50
  }
];

const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: 'inv_884910',
    number: 'INV-2026-0091',
    date: 'Sep 01, 2026',
    dueDate: 'Sep 01, 2026',
    amount: 19.00,
    currency: 'USD',
    status: 'paid',
    plan: 'pro',
    customerName: 'Alex Watson',
    customerEmail: 'alexwatson0786@gmail.com',
    items: [
      { description: 'ToolMatrix Pro Monthly Plan (Full Suite Access)', quantity: 1, unitPrice: 19.00, total: 19.00 }
    ]
  },
  {
    id: 'inv_884909',
    number: 'INV-2026-0082',
    date: 'Aug 01, 2026',
    dueDate: 'Aug 01, 2026',
    amount: 19.00,
    currency: 'USD',
    status: 'paid',
    plan: 'pro',
    customerName: 'Alex Watson',
    customerEmail: 'alexwatson0786@gmail.com',
    items: [
      { description: 'ToolMatrix Pro Monthly Plan (Full Suite Access)', quantity: 1, unitPrice: 19.00, total: 19.00 }
    ]
  }
];

const SiteContext = createContext<SiteContextType | null>(null);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('tm_active_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[0];
  });

  const [impersonatedUser, setImpersonatedUser] = useState<UserAccount | null>(null);
  const effectiveUser = impersonatedUser || user;

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('tm_theme') as 'dark' | 'light') || 'dark';
  });

  const [language, setLanguageState] = useState<Language>('en');
  const [currency, setCurrency] = useState<string>('USD');

  // Popup Settings - Position defaulted to 'top' as requested by user
  const [popupSettings, setPopupSettings] = useState<PopupSettings>({
    enabled: true,
    position: 'top', // Placed at top of screen!
    title: 'Special Developer Announcement',
    message: 'Upgrade to ToolMatrix Pro today and get 50% OFF your first 3 months with coupon code PRO50!',
    ctaText: 'Claim 50% Off',
    ctaLink: '/pricing',
    delaySeconds: 1,
    showBadge: true,
    badgeText: 'PREVIEW ANNOUNCEMENT',
    isDismissed: false
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tm_favorites');
      return saved ? JSON.parse(saved) : ['json-formatter', 'qr-code-generator', 'hash-generator', 'regex-tester'];
    } catch {
      return ['json-formatter', 'qr-code-generator'];
    }
  });

  const [recentRuns, setRecentRuns] = useState<Array<{ id: string; toolId: string; toolName: string; timestamp: string }>>(() => {
    try {
      const saved = localStorage.getItem('tm_recent_runs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activeToolsList, setActiveToolsList] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('tm_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const formatCurrency = (amount: number) => {
    const symbolMap: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
    const symbol = symbolMap[currency] || '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  const showToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const startImpersonation = (target: UserAccount) => {
    setImpersonatedUser(target);
    showToast({
      type: 'warning',
      title: 'Impersonation Mode Active',
      message: `Now viewing workspace as ${target.name} (${target.email})`
    });
  };

  const stopImpersonation = () => {
    setImpersonatedUser(null);
    showToast({
      type: 'info',
      title: 'Returned to Admin',
      message: 'Impersonation ended. You are back in your administrator profile.'
    });
  };

  const switchUser = (account: UserAccount) => {
    setUser(account);
    setImpersonatedUser(null);
    localStorage.setItem('tm_active_user', JSON.stringify(account));
    showToast({
      type: 'success',
      title: 'Account Switched',
      message: `Switched to ${account.name} (${account.role.toUpperCase()} - ${account.plan.toUpperCase()})`
    });
  };

  const updateUserPlan = (plan: PlanTier) => {
    const updated = { ...effectiveUser, plan };
    if (impersonatedUser) {
      setImpersonatedUser(updated);
    } else {
      setUser(updated);
      localStorage.setItem('tm_active_user', JSON.stringify(updated));
    }
    showToast({
      type: 'success',
      title: 'Plan Upgraded',
      message: `Subscription successfully updated to ${plan.toUpperCase()} tier!`
    });
  };

  const regenerateApiKey = () => {
    const newKey = `tm_live_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`;
    const updated = { ...effectiveUser, apiKey: newKey };
    if (impersonatedUser) {
      setImpersonatedUser(updated);
    } else {
      setUser(updated);
      localStorage.setItem('tm_active_user', JSON.stringify(updated));
    }
    showToast({
      type: 'success',
      title: 'API Key Generated',
      message: 'New secret API key generated and activated.'
    });
  };

  const updatePopupSettings = (partial: Partial<PopupSettings>) => {
    setPopupSettings(prev => ({ ...prev, ...partial }));
    showToast({
      type: 'success',
      title: 'Popup Settings Updated',
      message: 'Notification popup configuration saved successfully.'
    });
  };

  const dismissPopup = () => {
    setPopupSettings(prev => ({ ...prev, isDismissed: true }));
  };

  const triggerPreviewPopup = () => {
    setPopupSettings(prev => ({ ...prev, isDismissed: false }));
    showToast({
      type: 'info',
      title: 'Preview Triggered',
      message: 'Preview notification popup shown at top of the screen.'
    });
  };

  const toggleFavorite = (toolId: string) => {
    setFavorites(prev => {
      const next = prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId];
      localStorage.setItem('tm_favorites', JSON.stringify(next));
      return next;
    });
  };

  const recordToolRun = (toolId: string, toolName: string) => {
    const newRun = {
      id: Math.random().toString(36).substring(2, 8),
      toolId,
      toolName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setRecentRuns(prev => {
      const next = [newRun, ...prev.filter(r => r.toolId !== toolId)].slice(0, 10);
      localStorage.setItem('tm_recent_runs', JSON.stringify(next));
      return next;
    });

    // Update user usage
    const updated = { ...effectiveUser, usageThisMonth: effectiveUser.usageThisMonth + 1 };
    if (impersonatedUser) {
      setImpersonatedUser(updated);
    } else {
      setUser(updated);
      localStorage.setItem('tm_active_user', JSON.stringify(updated));
    }
  };

  const addInvoice = (inv: InvoiceRecord) => {
    setInvoices(prev => [inv, ...prev]);
  };

  const toggleToolStatus = (toolId: string) => {
    setActiveToolsList(prev =>
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
    );
  };

  return (
    <SiteContext.Provider
      value={{
        user,
        effectiveUser,
        impersonatedUser,
        startImpersonation,
        stopImpersonation,
        switchUser,
        updateUserPlan,
        regenerateApiKey,
        theme,
        toggleTheme,
        language,
        setLanguage,
        t,
        currency,
        setCurrency,
        formatCurrency,
        popupSettings,
        updatePopupSettings,
        dismissPopup,
        triggerPreviewPopup,
        favorites,
        toggleFavorite,
        recentRuns,
        recordToolRun,
        invoices,
        addInvoice,
        toasts,
        showToast,
        removeToast,
        activeToolsList,
        toggleToolStatus
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used within SiteProvider');
  return context;
};

export { DEMO_USERS };
