import React, { useState } from 'react';
import { FileText, ChevronDown, User, Shield, LogOut, LayoutDashboard, Smartphone, CreditCard, Sparkles, AlertTriangle, Bell, DollarSign, Globe } from 'lucide-react';
import { useSite } from '../cms/SiteContext';

export default function Header({ onNavigate, currentPage }) {
  const {
    user,
    logout,
    settings,
    selectedCurrency,
    availableCurrencies,
    changeCurrency,
    selectedLanguage,
    supportedLanguages,
    currentLanguageObj,
    changeLanguage,
    t
  } = useSite();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const handleNav = (page) => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <>
      {/* Global Maintenance Mode Banner */}
      {settings?.maintenanceMode && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 border-b border-amber-600 shadow-xs z-50">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-900" />
          <span>
            {settings?.maintenanceNotice || 'System is currently undergoing scheduled maintenance. Some tools may be temporarily slow.'}
          </span>
        </div>
      )}

      {/* Top Announcement Banner */}
      {settings?.announcement?.enabled && settings?.announcement?.text && !settings?.maintenanceMode && (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 shadow-xs z-50">
          <Bell className="w-3.5 h-3.5 shrink-0 text-blue-200 animate-pulse" />
          <span>{settings.announcement.text}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            {settings?.branding?.logoUrl && settings?.branding?.logoUrl !== '/logo.svg' ? (
              <img
                src={settings.branding.logoUrl}
                alt={settings?.branding?.siteName || settings?.siteName || 'Platform Logo'}
                className="h-9 w-auto max-w-[140px] object-contain rounded-xl"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : null}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
              style={{
                backgroundColor: settings?.branding?.primaryColor || '#2563eb'
              }}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                {settings?.branding?.siteName || settings?.siteName || 'Vansh PDF'}
              </span>
              <span className="ml-1.5 hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wide border border-blue-100">
                {settings?.branding?.brandBadgeText || 'SaaS v2.4'}
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentPage === 'home' ? 'text-blue-600 bg-blue-50/60 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t('nav_all_tools', 'All PDF Tools')}
            </button>

            <button
              onClick={() => handleNav('pricing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentPage === 'pricing' ? 'text-blue-600 bg-blue-50/60 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t('nav_pricing', 'Pricing & Plans')}
            </button>

            <button
              onClick={() => {
                if (currentPage === 'home') {
                  const el = document.getElementById('mobile-apps-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleNav('home');
                  setTimeout(() => {
                    document.getElementById('mobile-apps-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-500" />
              <span>{t('nav_mobile_app', 'Mobile Apps')}</span>
            </button>

            {user && (
              <button
                onClick={() => handleNav('account')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentPage === 'account' ? 'text-blue-600 bg-blue-50/60 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t('nav_account', 'User Dashboard')}</span>
              </button>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={() => handleNav('admin')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentPage === 'admin' ? 'text-amber-700 bg-amber-50 font-bold' : 'text-amber-600 hover:text-amber-700 hover:bg-amber-50/70'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('nav_admin', 'Admin Panel')}</span>
              </button>
            )}
          </nav>

          {/* Right: Language, Currency Selector & Auth Controls */}
          <div className="flex items-center gap-2">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setLanguageDropdownOpen(!languageDropdownOpen);
                  setCurrencyDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-all cursor-pointer"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentLanguageObj?.flag || '🌐'} {currentLanguageObj?.name || 'English'}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {languageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    Select Language
                  </div>
                  {(supportedLanguages || []).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setLanguageDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedLanguage === lang.code ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 uppercase">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setCurrencyDropdownOpen(!currencyDropdownOpen);
                  setLanguageDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-all cursor-pointer"
                title="Select Payment Currency"
              >
                <span className="text-blue-600 font-extrabold">{availableCurrencies?.find(c => c.code === selectedCurrency)?.symbol || '$'}</span>
                <span>{selectedCurrency}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    Select Currency
                  </div>
                  {(availableCurrencies || []).map((cur) => (
                    <button
                      key={cur.code}
                      onClick={() => {
                        changeCurrency(cur.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedCurrency === cur.code ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 font-mono font-bold text-gray-500">{cur.symbol}</span>
                        <span>{cur.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">{cur.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm font-medium text-gray-800 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold leading-none truncate max-w-[120px]">{user.name}</span>
                    <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mt-0.5">
                      {user.planId || 'free'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                          Plan: {user.planId}
                        </span>
                        {user.role === 'admin' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleNav('account')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-400" />
                      <span>User Overview & 3D Stats</span>
                    </button>

                    <button
                      onClick={() => handleNav('pricing')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span>Upgrade Plan</span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full px-4 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-amber-500" />
                        <span>Admin Analytics & CMS</span>
                      </button>
                    )}

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        handleNav('home');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav_logout', 'Sign Out')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-3.5 py-1.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  {t('nav_login', 'Log In')}
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('nav_register', 'Get Started')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
