import React from 'react';
import { Sparkles, Shield, Zap, Layers, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { useSite } from '../cms/SiteContext';

export default function Hero3D({ onExploreTools, onExplorePricing }) {
  const { t } = useSite();

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-blue-50/60 via-white to-white select-none">
      {/* 3D Atmospheric Background Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-400/15 via-indigo-300/15 to-purple-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-40 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Top Security & Architecture Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200/80 shadow-xs text-xs font-semibold text-blue-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{t('hero_badge', 'Next-Gen PDF SaaS Platform • Automated Gateway Security')}</span>
            </div>

            {/* Main Punchy Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Every PDF Tool <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                You’ll Ever Need.
              </span>
            </h1>

            {/* Clear, Professional Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {t(
                'hero_subtitle',
                'Merge, split, compress, convert, OCR, and protect your PDF documents with enterprise-grade encryption and blazing-fast client/server hybrid technology.'
              )}
            </p>

            {/* Value Propositions Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-gray-700">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs p-2 rounded-xl border border-gray-100 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>All 78 Tools Live</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs p-2 rounded-xl border border-gray-100 shadow-xs">
                <Lock className="w-4 h-4 text-blue-500 shrink-0" />
                <span>AES-256 Bit Encrypted</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs p-2 rounded-xl border border-gray-100 shadow-xs">
                <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Neural AI OCR</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onExploreTools}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{t('hero_cta', 'Explore All Tools')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExplorePricing}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:border-gray-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('hero_pricing_cta', 'View Unlimited Plans')}</span>
              </button>
            </div>
          </div>

          {/* Right 3D Visual Isometric Stage */}
          <div className="lg:col-span-5 flex items-center justify-center perspective-1000">
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center preserve-3d">
              
              {/* Floating 3D Backing Plane */}
              <div className="absolute inset-4 rounded-3xl bg-gradient-to-tr from-blue-600/10 via-indigo-600/5 to-purple-600/10 transform rotate-6 scale-95 border border-white/60 shadow-2xl backdrop-blur-xs" />

              {/* Main 3D Card Stack */}
              <div className="card-3d relative w-full p-6 bg-white/95 rounded-3xl border border-gray-100/80 shadow-2xl space-y-4 animate-float-3d">
                
                {/* Simulated Real Processing Pipeline */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-500/30">
                      PDF
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-none">Vansh Engine v2.4</h4>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">High-Speed Parallel Processing</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase border border-blue-100">
                    Live Status
                  </span>
                </div>

                {/* 3D Tiered Tool Cards in Stage */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                        1
                      </div>
                      <span className="font-semibold text-gray-800">Organize & Merge</span>
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">15 Tools</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">
                        2
                      </div>
                      <span className="font-bold text-blue-900">Neural OCR & AI Engine</span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-700">Gemini 3.8</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                        3
                      </div>
                      <span className="font-semibold text-gray-800">AES-256 Sign & Protect</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold">100% Valid</span>
                  </div>
                </div>

                {/* Real-time Server Performance Gauge */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                    <span>Server Cluster Latency</span>
                    <span className="font-mono font-bold text-emerald-600">18ms (Optimal)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 w-[96%]" />
                  </div>
                </div>

              </div>

              {/* Orbiting 3D Accent Badges */}
              <div className="absolute -top-4 -left-4 px-3.5 py-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-800 animate-float-delay z-20">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Zero Data Retention</span>
              </div>

              <div className="absolute -bottom-4 -right-4 px-3.5 py-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 text-xs font-bold text-blue-600 animate-float-3d z-20">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>78 Real Tools</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
