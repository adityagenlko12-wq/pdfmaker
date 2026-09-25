import React, { useState } from 'react';
import { Search, Sparkles, Filter, ChevronRight, CheckCircle2, Shield, Zap, Layers, ArrowRight, ScanText, PenTool, Receipt, Table, FileText, Globe } from 'lucide-react';
import { TOOLS_CONFIG } from '../data/toolsCatalog';
import Hero3D from '../components/Hero3D';
import LandingSlider from '../components/LandingSlider';
import AppDownloadSection from '../components/AppDownloadSection';
import AdSlot from '../components/AdSlot';
import { useSite } from '../cms/SiteContext';

export default function HomePage({ onSelectTool, onNavigatePricing }) {
  const { t, settings } = useSite();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStep, setSelectedStep] = useState(0); // 0 = all steps

  const categories = [
    { id: 'all', name: 'All Tools' },
    { id: 'ocr', name: 'AI Neural OCR (10)' },
    { id: 'organize', name: 'Organize & Structure' },
    { id: 'convert', name: 'Convert to & from PDF' },
    { id: 'edit', name: 'Edit & Annotate' },
    { id: 'security', name: 'Security & Sign' },
    { id: 'optimize', name: 'Optimize & AI' }
  ];

  const steps = [
    { step: 0, label: 'All Categories' },
    { step: 7, label: 'Step 7: Neural OCR' },
    { step: 1, label: 'Step 1: Organize' },
    { step: 2, label: 'Step 2: To PDF' },
    { step: 3, label: 'Step 3: From PDF' },
    { step: 4, label: 'Step 4: Edit' },
    { step: 5, label: 'Step 5: Security' },
    { step: 6, label: 'Step 6: AI & Optimize' }
  ];

  // Filter tools based on search and selected filters
  const filteredTools = TOOLS_CONFIG.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.stepName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      tool.category === selectedCategory ||
      (selectedCategory === 'ocr' && (tool.category === 'ocr' || tool.id.includes('ocr'))) ||
      (selectedCategory === 'convert' && (tool.step === 2 || tool.step === 3));

    const matchesStep = selectedStep === 0 || tool.step === selectedStep;

    return matchesSearch && matchesCategory && matchesStep;
  });

  return (
    <div className="min-w-0 bg-white">
      {/* 3D Hero Section */}
      <Hero3D
        onExploreTools={() => {
          const el = document.getElementById('tools-catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onExplorePricing={onNavigatePricing}
      />

      {/* Featured Capabilities Slider */}
      <LandingSlider onSelectTool={onSelectTool} />

      {/* Featured AI Neural OCR Intelligence Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-4 border border-purple-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Vision Engine</span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  High-Precision AI Neural OCR Suite
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                  Extract crystal-clear searchable text, tabular spreadsheets, and financial metrics from flat scans, photos, receipts, and handwritten notes with 99.7% character confidence across 100+ languages.
                </p>
              </div>
              <button
                onClick={() => setSelectedCategory('ocr')}
                className="px-5 py-2.5 bg-white text-gray-900 hover:bg-gray-100 rounded-2xl text-xs font-bold shadow-md flex items-center gap-2 shrink-0 transition-all cursor-pointer self-start lg:self-center"
              >
                <span>View All 10 OCR Tools</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Quick Launch OCR Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  id: 'ocr-searchable-pdf',
                  name: 'PDF to Searchable PDF',
                  desc: 'Overlay invisible vector text for 100% selectable words.',
                  icon: ScanText,
                  badge: 'Popular',
                  bg: 'from-violet-600/30 to-purple-600/30'
                },
                {
                  id: 'ocr-image-to-text',
                  name: 'Image to Text (OCR)',
                  desc: 'Extract clean typography from JPG, PNG, and TIFF images.',
                  icon: FileText,
                  badge: 'Ultra Fast',
                  bg: 'from-fuchsia-600/30 to-pink-600/30'
                },
                {
                  id: 'ocr-receipt-invoice',
                  name: 'Invoice & Receipt OCR',
                  desc: 'Parse merchant, GST/tax, and line items directly to JSON/Excel.',
                  icon: Receipt,
                  badge: 'Finance Pro',
                  bg: 'from-emerald-600/30 to-teal-600/30'
                },
                {
                  id: 'ocr-handwriting',
                  name: 'Handwriting to Text',
                  desc: 'Transcribe paper notes, doctor scripts, and meeting whiteboards.',
                  icon: PenTool,
                  badge: 'Cursive AI',
                  bg: 'from-amber-600/30 to-rose-600/30'
                }
              ].map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => onSelectTool && onSelectTool(tool.id)}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/15 text-white">
                          {tool.badge}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        {tool.name}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-purple-300 font-semibold">
                      <span>Launch OCR Tool</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Tools Catalog Section */}
      <section id="tools-catalog-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search & Filter Header Bar */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm mb-12 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                PDF Tools Directory
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Browse through all 78 specialized PDF utilities organized into 6 professional workflow steps.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder', 'Search PDF tools (e.g. merge, compress, ocr, sign)...')}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Workflow Step Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-gray-100 scrollbar-none text-xs font-medium">
            <span className="text-gray-400 shrink-0 mr-1 text-[11px] font-bold uppercase">Workflow:</span>
            {steps.map((st) => (
              <button
                key={st.step}
                onClick={() => setSelectedStep(st.step)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedStep === st.step
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-gray-100/70 hover:bg-gray-200/60 text-gray-600'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Functional Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
            <span className="ml-auto text-xs text-gray-400 font-semibold shrink-0">
              Showing {filteredTools.length} of {TOOLS_CONFIG.length}
            </span>
          </div>

        </div>

        {/* 78 Tools Interactive Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className="card-3d group relative p-5 bg-white rounded-3xl border border-gray-200/80 hover:border-blue-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Top Row: Icon & Step Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      {tool.badge ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 uppercase tracking-wide border border-blue-100">
                          {tool.badge}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-gray-400">
                          Step {tool.step}
                        </span>
                      )}
                    </div>

                    {/* Tool Name */}
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-100/80 flex items-center justify-between text-xs font-semibold text-gray-400 group-hover:text-blue-600 transition-colors">
                    <span className="text-[11px] font-medium text-gray-400 group-hover:text-gray-600">Launch Tool</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <Layers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-gray-800">No tools found</h4>
            <p className="text-xs text-gray-500 mt-1">Try refining your search terms or filter selection.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStep(0);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Dynamic Ad Placement for Free Users */}
        <div className="mt-12">
          <AdSlot slot="homepage-bottom" />
        </div>

      </section>

      {/* Cross-Platform Ecosystem / Mobile App Downloads */}
      <AppDownloadSection />

    </div>
  );
}
