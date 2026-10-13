/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { ShieldCheck, Truck, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import { StoreSettings } from '../types';

interface HeroProps {
  settings: StoreSettings;
  onExploreClick: () => void;
  onOffersClick: () => void;
  onAskOmarClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ 
  settings, 
  onExploreClick, 
  onOffersClick,
  onAskOmarClick 
}) => {
  const heroImage = settings.siteImages?.heroBannerUrl || '/banner.jpg';
  const logoImage = settings.siteImages?.logoUrl || '/logo.jpg';
  const bannerBadge = settings.siteImages?.heroBannerBadge || settings.brandSlogan || 'أناقة الالتزام.. وجمال التراث';
  const bannerTitle = settings.siteImages?.heroBannerTitle || settings.brandName;
  const bannerAccent = settings.siteImages?.heroBannerHeadlineAccent || 'للزِّيِّ الشَّرْعِيِّ الفَاخِر';
  const bannerSubtitle = settings.siteImages?.heroBannerSubtitle || 'تشكيلة الزي الشرعي الفاخر بنقاء الخامات وعفة التصميم. نوفر لكِ كل ما تحتاجينه للالتزام بالحجاب الشرعي الفضفاض: إدناءات قطعتين وقطعة واحدة، إسدالات صلاة وخروج، نقابات كورية مريحة للتنفس، خمارات فرنسية، ودريسات سابغة بأجود خامات الكريب والقطن.';
  const feature1 = settings.siteImages?.heroBannerFeature1 || 'كريب رويال نخب أول';
  const feature2 = settings.siteImages?.heroBannerFeature2 || (settings.isFreeShippingPromotionActive ? 'عروض شحن مجاني' : 'شحن لجميع المحافظات');
  const feature3 = settings.siteImages?.heroBannerFeature3 || 'عربون ميسر والباقي كاش';
  const primaryBtnText = settings.siteImages?.heroBannerPrimaryBtnText || 'تصفح أحدث الموديلات';
  const secondaryBtnText = settings.siteImages?.heroBannerSecondaryBtnText || 'عروض الموديلات والتخفيضات 🔥';
  const cardTag = settings.siteImages?.heroBannerCardTag || 'مجموعة 2026';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#14161A] via-[#1A1C22] to-[#121316] text-white py-12 md:py-20 border-b border-[#C5A059]/30">
      
      {/* Decorative Golden Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#997A2E]/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Headline & Information */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            {/* Slogan Pill */}
            <div className="inline-flex items-center gap-2 bg-[#C5A059]/15 text-[#F3E5AB] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-[#C5A059]/40 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#DFBD69]" />
              <span>{bannerBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.25] tracking-tight">
              {bannerTitle} <br />
              <span className="text-gold-gradient inline-block mt-2">
                {bannerAccent}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl font-normal">
              {bannerSubtitle}
            </p>

            {/* Quick Benefits Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 pb-2">
              <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-[#C5A059]/25 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#DFBD69] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-gray-200">{feature1}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-[#C5A059]/25 shadow-xs">
                <Truck className="w-5 h-5 text-[#DFBD69] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-gray-200">
                  {feature2}
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-[#C5A059]/25 shadow-xs col-span-2 sm:col-span-1">
                <ShieldCheck className="w-5 h-5 text-[#DFBD69] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-gray-200">
                  {feature3}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#C5A059] to-[#DFBD69] hover:from-[#DFBD69] hover:to-[#F3E5AB] text-[#121316] rounded-xl font-bold text-sm sm:text-base shadow-gold hover:shadow-gold-lg transition-all active:scale-95"
              >
                <span>{primaryBtnText}</span>
                <ArrowLeft className="w-4 h-4 text-[#121316]" />
              </button>

              <button
                onClick={onOffersClick}
                className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 text-[#F3E5AB] rounded-xl font-bold text-sm sm:text-base border border-[#C5A059]/40 transition-all"
              >
                <span>{secondaryBtnText}</span>
              </button>

              <button
                onClick={onAskOmarClick}
                className="flex items-center gap-2 px-5 py-3.5 bg-[#1B1D22] text-[#DFBD69] hover:bg-[#23262C] rounded-xl font-semibold text-xs sm:text-sm border border-[#C5A059]/30 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#DFBD69]" />
                <span>استشيري المستشار عمر للذكاء الاصطناعي</span>
              </button>
            </div>

          </div>

          {/* Hero Visual Banner (Can be updated from Admin) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Golden Outer Glow */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#C5A059]/40 to-[#DFBD69]/20 rounded-3xl filter blur-xl opacity-80" />

              {/* Main Banner Card */}
              <div className="relative bg-[#181A1F] rounded-3xl p-3 shadow-2xl border-2 border-[#C5A059]/50 overflow-hidden group">
                <img 
                  src={heroImage} 
                  alt={bannerTitle}
                  className="w-full h-80 sm:h-[420px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Logo Badge on Banner */}
                <div className="absolute top-6 left-6 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#DFBD69] shadow-gold bg-[#0C0D0F]">
                  <img src={logoImage} alt="اللوجو" className="w-full h-full object-cover" />
                </div>

                {/* Bottom Overlay on Banner */}
                <div className="absolute bottom-5 right-5 left-5 bg-[#0F1014]/90 backdrop-blur-md text-[#FAF8F5] p-4 rounded-2xl border border-[#C5A059]/40 flex items-center justify-between">
                  <div className="text-right">
                    <span className="block text-[11px] text-[#DFBD69] font-semibold">
                      {bannerTitle}
                    </span>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-white">
                      {bannerBadge}
                    </h3>
                  </div>
                  <span className="bg-gradient-to-r from-[#C5A059] to-[#DFBD69] text-[#121316] font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shrink-0 shadow-xs">
                    {cardTag}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
