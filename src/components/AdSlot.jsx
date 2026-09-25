import React, { useEffect, useState } from 'react';
import { useSite } from '../cms/SiteContext';
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

export default function AdSlot({ slot = 'tool-sidebar', format = 'banner', className = '' }) {
  const { user } = useSite();
  const [ad, setAd] = useState(null);

  // Pro & Enterprise users have completely ad-free experience
  if (user && user.planId !== 'free') {
    return null;
  }

  useEffect(() => {
    let isMounted = true;
    const fetchActiveAd = async () => {
      try {
        const res = await fetch(`/api/popup-ads/active?page=tool&device=all`);
        if (res.ok) {
          const data = await res.json();
          if (data.ads && data.ads.length > 0 && isMounted) {
            // Pick first or matching ad
            const chosen = data.ads[0];
            setAd(chosen);
            // Record impression
            fetch(`/api/popup-ads/${chosen.id}/impression`, { method: 'POST' }).catch(() => {});
          }
        }
      } catch {
        // Fallback banner
      }
    };
    fetchActiveAd();
    return () => { isMounted = false; };
  }, [slot]);

  const handleAdClick = () => {
    if (ad) {
      fetch(`/api/popup-ads/${ad.id}/click`, { method: 'POST' }).catch(() => {});
      const targetUrl = ad?.content?.bannerTargetUrl || ad?.targetUrl || '#/pricing';
      if (targetUrl) {
        if (targetUrl.startsWith('http')) {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        } else if (targetUrl.startsWith('#/pricing') || targetUrl.includes('pricing')) {
          window.location.hash = targetUrl;
        } else {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
      }
    }
  };

  // Safe extraction of text fields preventing Object as React child errors
  const adHeadline =
    (typeof ad?.content === 'object' && ad?.content?.bannerHeadline) ||
    ad?.title ||
    'Upgrade to Vansh PDF Pro';

  const adSubtext =
    typeof ad?.content === 'string'
      ? ad.content
      : typeof ad?.content === 'object' && ad?.content?.bannerSubtext
      ? ad.content.bannerSubtext
      : 'Remove all daily limits, enjoy unlimited neural OCR, and process documents 5x faster.';

  const adCtaText = ad?.ctaText || 'Get Unlimited Access';

  return (
    <div
      onClick={handleAdClick}
      className={`relative overflow-hidden rounded-2xl p-4 transition-all cursor-pointer select-none group border ${
        ad
          ? 'bg-gradient-to-br from-indigo-900/90 to-purple-950/90 text-white border-indigo-500/30 shadow-md'
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 border-blue-200/60 shadow-xs'
      } ${className}`}
    >
      <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider mb-2 opacity-70">
        <span>Sponsor • Pro Upgrade</span>
        <span className="px-1.5 py-0.5 rounded bg-black/20">Ad</span>
      </div>

      <div className="space-y-1.5">
        <h4 className="text-sm font-bold leading-tight group-hover:text-blue-300 transition-colors">
          {adHeadline}
        </h4>
        <p className="text-xs opacity-85 leading-relaxed line-clamp-2">
          {adSubtext}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10 text-xs font-semibold">
        <span className="text-blue-400 group-hover:underline flex items-center gap-1">
          <span>{adCtaText}</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
}
