import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Shield, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    id: 'ai-ocr',
    badge: 'State of the Art',
    title: 'AI Neural OCR & Intelligent Document Parsing',
    description: 'Transform non-searchable scanned images and multi-page receipts into editable, indexed text with 99.8% precision.',
    gradient: 'from-blue-600 via-indigo-600 to-purple-600',
    stats: [
      { label: 'Accuracy Rate', value: '99.8%' },
      { label: 'Languages Supported', value: '50+' },
      { label: 'Processing Speed', value: '< 2.4s' }
    ],
    toolId: 'ocr-pdf'
  },
  {
    id: 'security-compliance',
    badge: 'Enterprise Trust',
    title: 'Zero-Knowledge Document Encryption & Purging',
    description: 'All document streams are processed in memory with military-grade AES-256 ciphering and automatically purged within 2 hours.',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    stats: [
      { label: 'Encryption Standard', value: 'AES-256' },
      { label: 'Auto-Purge Window', value: '120 min' },
      { label: 'ISO Compliance', value: '19005-2' }
    ],
    toolId: 'protect-pdf'
  },
  {
    id: 'e-sign',
    badge: 'Legally Binding',
    title: 'Cryptographic Digital Signatures & Audit Trail',
    description: 'Sign contracts, request multi-party signatory workflows, and verify X.509 digital certificates with tamper-proof hashing.',
    gradient: 'from-purple-600 via-pink-600 to-rose-600',
    stats: [
      { label: 'Legal Validity', value: 'ESIGN / eIDAS' },
      { label: 'Audit Trail', value: 'SHA-256' },
      { label: 'Delivery Time', value: 'Instant' }
    ],
    toolId: 'sign-pdf'
  }
];

export default function LandingSlider({ onSelectTool }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${slide.gradient} p-8 sm:p-12 text-white shadow-2xl transition-all duration-700`}>
        
        {/* Decorative 3D Ambient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{slide.badge}</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {slide.title}
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed max-w-2xl">
            {slide.description}
          </p>

          {/* Numerical KPI Cards inside Slider */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 max-w-lg">
            {slide.stats.map((st, i) => (
              <div key={i} className="bg-black/15 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                <div className="text-lg sm:text-2xl font-black">{st.value}</div>
                <div className="text-[11px] text-white/80 font-medium truncate">{st.label}</div>
              </div>
            ))}
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={() => onSelectTool && onSelectTool(slide.toolId)}
              className="px-6 py-3 rounded-xl text-sm font-bold text-gray-900 bg-white hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Tool Now</span>
              <ArrowRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-6 right-8 flex items-center gap-2 z-20">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex gap-1.5 px-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
}
