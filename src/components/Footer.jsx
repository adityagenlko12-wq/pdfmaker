import React from 'react';
import { FileText, Shield, Lock, Globe, Heart, Smartphone, CreditCard } from 'lucide-react';
import { useSite } from '../cms/SiteContext';

export default function Footer({ onNavigate }) {
  const { settings, t } = useSite();

  return (
    <footer className="bg-gray-900 text-gray-400 text-sm border-t border-gray-800 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              {settings?.branding?.logoUrl && settings?.branding?.logoUrl !== '/logo.svg' ? (
                <img
                  src={settings.branding.logoUrl}
                  alt={settings?.branding?.siteName || settings?.siteName || 'Platform Logo'}
                  className="h-8 w-auto max-w-[120px] object-contain rounded-xl"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : null}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: settings?.branding?.primaryColor || '#2563eb'
                }}
              >
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {settings?.branding?.siteName || settings?.siteName || 'Vansh PDF'}
              </span>
            </div>

            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              {settings?.branding?.siteTagline || 'Every tool you need to use PDFs, 100% free and easy to use. Merge, split, compress, convert, rotate, and OCR documents with enterprise speed.'}
            </p>

            {/* Gateway Verification Badge */}
            <div className="pt-2 flex items-center gap-2 text-[11px] text-gray-400 font-medium">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>PCI-DSS Level 1 Encrypted Payment Security</span>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Merge & Split PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Neural OCR & Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Legally Valid E-Sign
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AES-256 PDF Protect
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Gemini AI Summary
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Apps Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ecosystem</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('mobile-apps-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else onNavigate && onNavigate('home');
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Android App (Google Play)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('mobile-apps-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else onNavigate && onNavigate('home');
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>iOS App (App Store)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('pricing')}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                  <span>SaaS Pricing & Plans</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('account')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cloud Document Vault
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-gray-400 hover:text-white transition-colors">
                  ISO 19005-2 PDF/A
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors">
                  GDPR Zero Retention
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors">
                  ESIGN & eIDAS Standard
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors">
                  Auto File Purge (120 min)
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Guarantee Subbar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>{settings?.branding?.copyrightText || `© ${new Date().getFullYear()} ${settings?.branding?.companyName || 'Vansh PDF Technologies Inc.'}. All rights reserved.`}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gray-400">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>TLS 1.3 End-to-End Encryption</span>
            </span>
            <span>•</span>
            <span className="text-gray-400">Port 3000 Active</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
