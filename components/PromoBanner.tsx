/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { StoreSettings } from '../types';
import { Sparkles, Truck, Tag } from 'lucide-react';

interface PromoBannerProps {
  settings: StoreSettings;
  onViewOffersClick?: () => void;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ settings, onViewOffersClick }) => {
  if (!settings.isFreeShippingPromotionActive && !settings.shippingPromotionBannerText) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-[#0C0D0E] via-[#1B1A16] to-[#0C0D0E] text-[#F3E5AB] py-2 px-4 text-xs md:text-sm font-medium border-b border-[#C5A059]/30 shadow-xs relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 justify-center text-center">
          <Truck className="w-4 h-4 text-[#D4AF37] animate-bounce shrink-0" />
          <span className="font-semibold text-[#DFBD69]">
            {settings.siteImages?.topBarAnnouncementText || (
              settings.isFreeShippingPromotionActive && settings.freeShippingPromoType === 'threshold'
                ? `✨ عرض خاص من آل جابر: شحن مجاني لكافة محافظات مصر للطلبات من ${settings.freeShippingThreshold} ج.م فأكثر!`
                : settings.shippingPromotionBannerText || 'عروض مميزة على الزي الشرعي الراقي'
            )}
          </span>
          <span className="hidden sm:inline text-white/70 text-xs">
            | عربون رمزي بسيط ودفع الباقي كاش عند الاستلام
          </span>
        </div>

        {onViewOffersClick && (
          <button
            onClick={onViewOffersClick}
            className="hidden md:flex items-center gap-1.5 bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#F3E5AB] px-3 py-1 rounded-full text-xs font-semibold transition-all border border-[#C5A059]/50 shrink-0"
          >
            <Tag className="w-3 h-3 text-[#DFBD69]" />
            <span>تصفح العروض</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PromoBanner;
