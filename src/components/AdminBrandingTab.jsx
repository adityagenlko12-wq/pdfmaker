import React, { useState, useEffect } from 'react';
import {
  Palette, Globe, Image, Shield, Sparkles, Check, RefreshCw, Eye,
  ExternalLink, Share2, Code, FileText, Phone, Mail, AlertCircle, Save
} from 'lucide-react';
import { useSite } from '../cms/SiteContext';

export function AdminBrandingTab({ getHeaders, showNotification }) {
  const { settings, updateBrandingState } = useSite();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Preset Color Palettes
  const COLOR_PRESETS = [
    { name: 'Corporate Blue', primary: '#2563eb', accent: '#4f46e5' },
    { name: 'Emerald Trust', primary: '#059669', accent: '#0d9488' },
    { name: 'Royal Indigo', primary: '#4338ca', accent: '#6366f1' },
    { name: 'Imperial Violet', primary: '#7c3aed', accent: '#9333ea' },
    { name: 'Crimson Tech', primary: '#dc2626', accent: '#e11d48' },
    { name: 'Slate Executive', primary: '#0f172a', accent: '#334155' }
  ];

  const [form, setForm] = useState({
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
  });

  const [activeSection, setActiveSection] = useState('identity');

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/branding', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setForm(prev => ({
          ...prev,
          ...data,
          seo: { ...prev.seo, ...(data.seo || {}) },
          socialLinks: { ...prev.socialLinks, ...(data.socialLinks || {}) },
          customCode: { ...prev.customCode, ...(data.customCode || {}) },
          legal: { ...prev.legal, ...(data.legal || {}) }
        }));
      }
    } catch (err) {
      console.error('Failed to load branding:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/branding', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const data = await res.json();
        if (updateBrandingState) {
          updateBrandingState(data.branding);
        }
        showNotification('Site branding, visual themes & SEO identity updated successfully!');
      } else {
        const err = await res.json();
        showNotification(`Failed: ${err.error || 'Could not save branding'}`);
      }
    } catch (err) {
      showNotification(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/20">
              <Palette className="w-3.5 h-3.5" />
              <span>Whitelabel & Visual Customization</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Site Branding & Identity Studio
            </h2>
            <p className="text-blue-200 text-xs sm:text-sm mt-1 max-w-2xl">
              Control your SaaS logo, brand name, primary color palettes, footer copyrights, SEO meta tags, and live OpenGraph social share cards.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 hover:scale-105"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Publishing Brand...' : 'Publish Brand Changes'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'identity', label: '1. Brand & Logos', icon: Palette },
          { id: 'colors', label: '2. Colors & Theme', icon: Sparkles },
          { id: 'footer', label: '3. Footer & Socials', icon: Globe },
          { id: 'seo', label: '4. SEO & Social Cards', icon: Share2 },
          { id: 'analytics', label: '5. Analytics & Scripts', icon: Code },
          { id: 'preview', label: '6. Live Brand Preview', icon: Eye }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: IDENTITY & LOGOS */}
      {activeSection === 'identity' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-600" />
              <span>Core Brand Identity</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Platform Name / Brand Title
              </label>
              <input
                type="text"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                placeholder="e.g. Vansh PDF"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">Displayed on navbar, tab titles, invoice headers, and emails.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Brand Tagline & Headline
              </label>
              <input
                type="text"
                value={form.siteTagline}
                onChange={(e) => setForm({ ...form, siteTagline: e.target.value })}
                placeholder="e.g. Complete PDF Tools & Neural OCR Platform"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Legal Company / Organization Name
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="e.g. Vansh Technologies Inc."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">Used on invoices, payment receipts, and legal terms.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Header Badge Pill Text
              </label>
              <input
                type="text"
                value={form.brandBadgeText}
                onChange={(e) => setForm({ ...form, brandBadgeText: e.target.value })}
                placeholder="e.g. Enterprise Pro v2.4"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Logo & Visual Assets */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Image className="w-4 h-4 text-indigo-600" />
              <span>Logos & Icons</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Primary Header Logo URL
              </label>
              <input
                type="text"
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                placeholder="/logo.svg or https://example.com/logo.png"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <div className="mt-2 p-3 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100">
                <span className="text-xs text-gray-500 font-medium">Preview:</span>
                <div className="h-8 px-3 py-1 bg-white border border-gray-200 rounded-lg flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                    PDF
                  </div>
                  <span className="text-xs font-bold text-gray-900">{form.siteName}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Favicon URL (.ico or .png)
              </label>
              <input
                type="text"
                value={form.faviconUrl}
                onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })}
                placeholder="/favicon.ico or https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-xs text-blue-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Instant Dynamic Rendering</span>
              </div>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                When you save, the platform dynamically swaps the application title, navbar brand icon, document export letterheads, and browser tab favicons without server restarts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: COLORS & THEME */}
      {activeSection === 'colors' && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Theme Colors & Visual Accents</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Choose from pre-crafted enterprise themes or define your company hex colors.
            </p>
          </div>

          {/* Preset Palettes Grid */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-3">
              One-Click Color Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {COLOR_PRESETS.map((p) => {
                const isSelected = form.primaryColor === p.primary;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setForm({ ...form, primaryColor: p.primary, accentColor: p.accent })}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: p.primary }} />
                      <div className="w-3.5 h-3.5 rounded-full shadow-inner" style={{ backgroundColor: p.accent }} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-900">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hex Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Primary Brand Color (Hex)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  className="w-12 h-10 rounded-xl cursor-pointer border border-gray-200 p-1 bg-white"
                />
                <input
                  type="text"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Secondary Accent Color (Hex)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.accentColor}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  className="w-12 h-10 rounded-xl cursor-pointer border border-gray-200 p-1 bg-white"
                />
                <input
                  type="text"
                  value={form.accentColor}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono uppercase"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: FOOTER & SOCIALS */}
      {activeSection === 'footer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Contact & Legal Links</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Support Phone / Hotline
              </label>
              <input
                type="text"
                value={form.supportPhone}
                onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Help Center / Knowledgebase URL
              </label>
              <input
                type="text"
                value={form.helpCenterUrl}
                onChange={(e) => setForm({ ...form, helpCenterUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={form.copyrightText}
                onChange={(e) => setForm({ ...form, copyrightText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-blue-600" />
              <span>Social Media Accounts</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Twitter / X Profile URL
              </label>
              <input
                type="text"
                value={form.socialLinks?.twitter || ''}
                onChange={(e) => setForm({
                  ...form,
                  socialLinks: { ...form.socialLinks, twitter: e.target.value }
                })}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                LinkedIn Company URL
              </label>
              <input
                type="text"
                value={form.socialLinks?.linkedin || ''}
                onChange={(e) => setForm({
                  ...form,
                  socialLinks: { ...form.socialLinks, linkedin: e.target.value }
                })}
                placeholder="https://linkedin.com/company/..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                GitHub Repository URL
              </label>
              <input
                type="text"
                value={form.socialLinks?.github || ''}
                onChange={(e) => setForm({
                  ...form,
                  socialLinks: { ...form.socialLinks, github: e.target.value }
                })}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Discord Community URL
              </label>
              <input
                type="text"
                value={form.socialLinks?.discord || ''}
                onChange={(e) => setForm({
                  ...form,
                  socialLinks: { ...form.socialLinks, discord: e.target.value }
                })}
                placeholder="https://discord.gg/..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SEO & SOCIAL CARDS */}
      {activeSection === 'seo' && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-600" />
              <span>Search Engine Optimization & OpenGraph Cards</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Configure how your platform appears when shared on Google, WhatsApp, Slack, Twitter, and LinkedIn.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Global Meta Title
                </label>
                <input
                  type="text"
                  value={form.seo?.metaTitle || ''}
                  onChange={(e) => setForm({
                    ...form,
                    seo: { ...form.seo, metaTitle: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Global Meta Description
                </label>
                <textarea
                  rows={3}
                  value={form.seo?.metaDescription || ''}
                  onChange={(e) => setForm({
                    ...form,
                    seo: { ...form.seo, metaDescription: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Meta Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={form.seo?.metaKeywords || ''}
                  onChange={(e) => setForm({
                    ...form,
                    seo: { ...form.seo, metaKeywords: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Social Share Card Image URL (1200x630 px)
                </label>
                <input
                  type="text"
                  value={form.seo?.ogImageUrl || ''}
                  onChange={(e) => setForm({
                    ...form,
                    seo: { ...form.seo, ogImageUrl: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Simulated Google Search Result */}
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-gray-700">
                Live Google Search Snippet Simulation
              </label>
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 text-left font-sans">
                <div className="flex items-center gap-2 text-xs text-gray-700 mb-1">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[8px] font-bold">
                    P
                  </div>
                  <span className="font-medium">https://{form.siteName.toLowerCase().replace(/\s+/g, '')}.com</span>
                </div>
                <div className="text-base sm:text-lg font-medium text-blue-700 hover:underline cursor-pointer line-clamp-1">
                  {form.seo?.metaTitle || `${form.siteName} - ${form.siteTagline}`}
                </div>
                <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {form.seo?.metaDescription || 'Every tool you need to use PDFs, 100% free and easy to use. Merge, split, compress, convert, rotate, and OCR PDFs with enterprise speed.'}
                </p>
              </div>

              {/* Simulated Social Share Card Preview */}
              <label className="block text-xs font-semibold text-gray-700 pt-2">
                Social Share Card (Twitter / LinkedIn / WhatsApp)
              </label>
              <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-xs">
                <div
                  className="h-36 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${form.seo?.ogImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200'})`
                  }}
                />
                <div className="p-3 bg-gray-50">
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    {form.siteName.toLowerCase().replace(/\s+/g, '')}.COM
                  </span>
                  <div className="text-xs font-bold text-gray-900 truncate">
                    {form.seo?.metaTitle || form.siteName}
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-1">
                    {form.seo?.metaDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: ANALYTICS & SCRIPTS */}
      {activeSection === 'analytics' && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-600" />
              <span>Third-Party Analytics & Custom Scripts</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Add Google Analytics, Tag Manager, or custom tracking code safely.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Google Analytics 4 Measurement ID
              </label>
              <input
                type="text"
                value={form.customCode?.gaMeasurementId || ''}
                onChange={(e) => setForm({
                  ...form,
                  customCode: { ...form.customCode, gaMeasurementId: e.target.value }
                })}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Google Tag Manager (GTM) Container ID
              </label>
              <input
                type="text"
                value={form.customCode?.gtmId || ''}
                onChange={(e) => setForm({
                  ...form,
                  customCode: { ...form.customCode, gtmId: e.target.value }
                })}
                placeholder="GTM-XXXXXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Meta Pixel ID
              </label>
              <input
                type="text"
                value={form.customCode?.metaPixelId || ''}
                onChange={(e) => setForm({
                  ...form,
                  customCode: { ...form.customCode, metaPixelId: e.target.value }
                })}
                placeholder="123456789012345"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Custom CSS Theme Overrides
            </label>
            <textarea
              rows={4}
              value={form.customCode?.customCss || ''}
              onChange={(e) => setForm({
                ...form,
                customCode: { ...form.customCode, customCss: e.target.value }
              })}
              placeholder="/* Add custom CSS rules here */"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono bg-gray-50"
            />
          </div>
        </div>
      )}

      {/* SECTION 6: LIVE PREVIEW */}
      {activeSection === 'preview' && (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Real-Time Brand Output Preview</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Here is how your site header and brand elements render live with current settings.
            </p>
          </div>

          {/* Header Mockup */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center gap-2 text-xs text-gray-500 font-mono">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="ml-2">https://{form.siteName.toLowerCase().replace(/\s+/g, '')}.com/</span>
            </div>

            <div className="p-4 bg-white flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-md"
                  style={{ backgroundColor: form.primaryColor }}
                >
                  PDF
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold text-gray-900">
                    {form.siteName}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
                    style={{ backgroundColor: form.accentColor }}
                  >
                    {form.brandBadgeText}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: form.primaryColor }}
                >
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Hero Mockup */}
            <div className="p-8 bg-gradient-to-b from-gray-50 to-white text-center space-y-3">
              <h1 className="text-2xl font-black text-gray-900">
                {form.siteTagline}
              </h1>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                {form.seo?.metaDescription}
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <div
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md"
                  style={{ backgroundColor: form.primaryColor }}
                >
                  Explore All OCR Tools
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Action Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-xl flex items-center justify-between">
        <div className="text-xs text-gray-600">
          Ready to apply branding changes across all user sessions.
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save & Publish Branding'}</span>
        </button>
      </div>
    </div>
  );
}
