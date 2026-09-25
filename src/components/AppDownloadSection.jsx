import React, { useState } from 'react';
import { Smartphone, Download, CheckCircle2, QrCode, Star, ArrowUpRight, ShieldCheck, Laptop } from 'lucide-react';
import { useSite } from '../cms/SiteContext';

export default function AppDownloadSection() {
  const { settings } = useSite();
  const [activeTab, setActiveTab] = useState('android');

  const downloads = settings?.appDownloads || {
    androidAppUrl: 'https://play.google.com/store/apps/details?id=com.vanshpdf.app',
    iosAppUrl: 'https://apps.apple.com/app/vansh-pdf-editor/id1628391024',
    desktopAppUrl: 'https://vanshpdf.com/downloads/vansh-pdf-setup.exe',
    androidAppEnabled: true,
    iosAppEnabled: true,
    desktopAppEnabled: true,
    androidVersion: 'v2.4.1',
    iosVersion: 'v2.4.0',
    desktopVersion: 'v1.9.8',
    totalDownloads: '142,800+'
  };

  const handleDownload = (platform) => {
    let url = '#';
    if (platform === 'android') url = downloads.androidAppUrl;
    else if (platform === 'ios') url = downloads.iosAppUrl;
    else if (platform === 'desktop') url = downloads.desktopAppUrl;

    if (url && url !== '#') {
      // In web app, trigger direct download / redirect
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <section id="mobile-apps-section" className="py-20 bg-gray-50 border-t border-gray-200/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span>Cross-Platform Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Work With PDFs <br className="hidden sm:inline" />
            <span className="text-blue-600">Everywhere You Go.</span>
          </h2>
          <p className="text-base text-gray-600 font-normal">
            Download our native Android, iOS, and Desktop apps. Edit on the move, scan physical receipts with your camera, and synchronize your document vault automatically.
          </p>
        </div>

        {/* 3D App Showcase Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Panel: App Specs & Direct Store Links */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              {/* Star Rating & Download Count */}
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-2 font-bold text-gray-800">4.9 / 5.0</span>
                </div>
                <span>•</span>
                <span>{downloads.totalDownloads || '142,000+'} Verified Installs</span>
              </div>

              {/* Feature Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-gray-900">Offline Processing</h5>
                    <p className="text-xs text-gray-500">Perform merge, split, and rotate even without an active internet connection.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-gray-900">Camera OCR Scanner</h5>
                    <p className="text-xs text-gray-500">Auto-boundary detection and perspective correction for paper bills.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-gray-900">Biometric Sign & Protect</h5>
                    <p className="text-xs text-gray-500">Unlock your AES-256 encrypted vault with FaceID or Fingerprint sensor.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-gray-900">Multi-Device Sync</h5>
                    <p className="text-xs text-gray-500">Seamlessly continue documents started in web browser on your phone.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Download Buttons */}
            <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-4 items-center">
              
              {/* Android Play Store */}
              {downloads.androidAppEnabled !== false && (
                <button
                  onClick={() => handleDownload('android')}
                  className="px-5 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white flex items-center gap-3 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                >
                  <Smartphone className="w-6 h-6 text-emerald-400" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 uppercase leading-none font-medium">Get it on</p>
                    <p className="text-sm font-bold leading-tight">Google Play</p>
                  </div>
                </button>
              )}

              {/* iOS App Store */}
              {downloads.iosAppEnabled !== false && (
                <button
                  onClick={() => handleDownload('ios')}
                  className="px-5 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white flex items-center gap-3 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                >
                  <Smartphone className="w-6 h-6 text-blue-400" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 uppercase leading-none font-medium">Download on the</p>
                    <p className="text-sm font-bold leading-tight">Apple App Store</p>
                  </div>
                </button>
              )}

              {/* Desktop Client */}
              {downloads.desktopAppEnabled !== false && (
                <button
                  onClick={() => handleDownload('desktop')}
                  className="px-5 py-3 rounded-2xl bg-white border border-gray-300 hover:border-gray-400 text-gray-800 flex items-center gap-3 transition-all shadow-xs hover:shadow-sm cursor-pointer"
                >
                  <Laptop className="w-6 h-6 text-indigo-600" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-500 uppercase leading-none font-medium">Desktop Client</p>
                    <p className="text-sm font-bold leading-tight">Windows & Mac</p>
                  </div>
                </button>
              )}

            </div>
          </div>

          {/* Right Panel: 3D Isometric Device Mockup Stage */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 sm:p-12 flex flex-col items-center justify-center text-white relative overflow-hidden perspective-1000">
            
            {/* Ambient Background Circles */}
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-black/20 rounded-full blur-2xl" />

            {/* 3D Phone Shell */}
            <div className="card-3d relative w-64 h-[440px] bg-gray-900 rounded-[36px] border-4 border-gray-800 shadow-2xl p-3 flex flex-col justify-between preserve-3d animate-float-3d">
              
              {/* Speaker & Dynamic Island */}
              <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gray-800" />
              </div>

              {/* Mobile Screen Mockup */}
              <div className="flex-1 bg-white rounded-2xl p-3 text-gray-900 overflow-hidden flex flex-col justify-between">
                
                {/* Mock Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="font-extrabold text-xs text-blue-600">Vansh PDF Mobile</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>

                {/* Mock Tool Grid */}
                <div className="grid grid-cols-2 gap-2 my-auto">
                  <div className="p-2 rounded-xl bg-blue-50 text-center">
                    <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center mx-auto mb-1 text-[10px] font-bold">
                      M
                    </div>
                    <span className="text-[10px] font-bold text-gray-800">Merge PDF</span>
                  </div>

                  <div className="p-2 rounded-xl bg-indigo-50 text-center">
                    <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center mx-auto mb-1 text-[10px] font-bold">
                      OCR
                    </div>
                    <span className="text-[10px] font-bold text-gray-800">Scan Bill</span>
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-50 text-center">
                    <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1 text-[10px] font-bold">
                      S
                    </div>
                    <span className="text-[10px] font-bold text-gray-800">E-Sign</span>
                  </div>

                  <div className="p-2 rounded-xl bg-purple-50 text-center">
                    <div className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center mx-auto mb-1 text-[10px] font-bold">
                      AI
                    </div>
                    <span className="text-[10px] font-bold text-gray-800">Summarize</span>
                  </div>
                </div>

                {/* Bottom Mock Action */}
                <div className="bg-blue-600 text-white text-[11px] font-bold py-2 rounded-xl text-center shadow-xs">
                  Tap to Scan Document
                </div>

              </div>

              {/* Bottom Home Indicator */}
              <div className="w-24 h-1 bg-gray-600 rounded-full mx-auto mt-2" />
            </div>

            {/* QR Code Floating Card */}
            <div className="mt-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-3">
              <QrCode className="w-6 h-6 text-white" />
              <div className="text-left text-xs">
                <p className="font-bold leading-tight">Scan with Phone</p>
                <p className="text-[10px] text-blue-100">Instant download link</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
