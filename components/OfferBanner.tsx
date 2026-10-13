/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { StoreSettings } from '../types';
import { Sparkles, ArrowLeft, Tag } from 'lucide-react';

interface OfferBannerProps {
  settings: StoreSettings;
  onExploreOffers: () => void;
}

const OfferBanner: React.FC<OfferBannerProps> = ({ settings, onExploreOffers }) => {
  const bannerImage = settings.siteImages?.promoBannerUrl || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200';
  const badge = settings.siteImages?.promoBannerBadge || 'عرض موسمي مميز';
  const title = settings.siteImages?.promoBannerTitle || 'عروض حصرية على الإدناءات والخمارات الملكية';
  const subtitle = settings.siteImages?.promoBannerSubtitle || 'تخفيضات تصل إلى 25% مع شحن مجاني لكافة المحافظات للطلبات المؤهلة';
  const btnText = settings.siteImages?.promoBannerBtnText || 'تسوقي العروض الآن';

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-right">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C5A059]/40 group min-h-[260px] sm:min-h-[320px] flex items-center">
        
        {/* Banner Background Image */}
        <img 
          src={bannerImage} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.75]"
        />

        {/* Gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0D10]/95 via-[#0C0D10]/80 to-transparent sm:w-2/3" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D10]/90 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-12 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#C5A059]/25 text-[#F3E5AB] px-3.5 py-1 rounded-full text-xs font-bold border border-[#C5A059]/50 backdrop-blur-md">
            <Tag className="w-3.5 h-3.5 text-[#DFBD69]" />
            <span>{badge}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-tight">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
            {subtitle}
          </p>

          <div className="pt-2">
            <button
              onClick={onExploreOffers}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#DFBD69] hover:from-[#DFBD69] hover:to-[#F3E5AB] text-[#121316] rounded-xl font-bold text-xs sm:text-sm shadow-gold transition-all active:scale-95"
            >
              <span>{btnText}</span>
              <ArrowLeft className="w-4 h-4 text-[#121316]" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default OfferBanner;
