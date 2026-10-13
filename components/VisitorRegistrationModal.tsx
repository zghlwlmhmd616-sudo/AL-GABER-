/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, User, Check, X, Shield, Heart } from 'lucide-react';
import { SiteVisitor, StoreSettings } from '../types';

interface VisitorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (visitor: SiteVisitor) => void;
  currentVisitorName?: string;
  settings: StoreSettings;
}

export const detectDeviceType = (): string => {
  if (typeof window === 'undefined') return 'جهاز كمبيوتر';
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'هاتف محمول (Android)';
  if (/iPad|iPhone|iPod/.test(ua)) return 'هاتف آيفون / آيباد (iOS)';
  if (/tablet/i.test(ua)) return 'جهاز لوحي (Tablet)';
  if (/Macintosh|Mac OS/i.test(ua)) return 'جهاز ماك (macOS)';
  if (/Windows/i.test(ua)) return 'كمبيوتر مكتبي (Windows)';
  return 'متصفح ويب';
};

const VisitorRegistrationModal: React.FC<VisitorRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  currentVisitorName = '',
  settings
}) => {
  const [name, setName] = useState(currentVisitorName);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentVisitorName) {
      setName(currentVisitorName);
    }
  }, [currentVisitorName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      setError('يرجى إدخال اسمكِ الكريم للمتابعة (حرفين على الأقل).');
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const visitorId = localStorage.getItem('algaber_visitor_id') || `vis-${Date.now()}`;
    const storedCount = parseInt(localStorage.getItem('algaber_visitor_count') || '1', 10);

    const newVisitor: SiteVisitor = {
      id: visitorId,
      name: trimmed,
      firstVisitAt: localStorage.getItem('algaber_visitor_first_at') || formattedDate,
      lastVisitAt: formattedDate,
      visitCount: storedCount,
      deviceInfo: detectDeviceType(),
      status: 'active',
      notes: 'تم تسجيل الاسم عبر نافذة الترحيب بالزوار'
    };

    localStorage.setItem('algaber_visitor_id', visitorId);
    localStorage.setItem('algaber_visitor_name', trimmed);
    if (!localStorage.getItem('algaber_visitor_first_at')) {
      localStorage.setItem('algaber_visitor_first_at', formattedDate);
    }

    onRegister(newVisitor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#E8E1D3] relative text-right overflow-hidden"
        style={{ direction: 'rtl' }}
      >
        {/* Top Islamic Accent Decoration */}
        <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-[#DFBD69] via-[#C5A059] to-[#997A2E]" />

        {/* Close button if user already had a name and is just updating */}
        {currentVisitorName && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#FAF8F5] text-[#716B5E] hover:text-[#121316] hover:bg-[#F0ECE1] flex items-center justify-center transition-colors"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="text-center pt-2 pb-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#121316] border border-[#C5A059] flex items-center justify-center shadow-gold">
            <Sparkles className="w-8 h-8 text-[#DFBD69]" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF6ED] text-[#997A2E] border border-[#E9DECA] mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#DFBD69] text-[#DFBD69]" />
            <span>أهلاً وسهلاً بكِ في {settings.brandName}</span>
          </span>

          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#18231C]">
            تسجيل اسم الزائر
          </h3>

          <p className="text-xs sm:text-sm text-[#716B5E] mt-2 leading-relaxed px-2">
            يسعدنا ويشرفنا تسجيل اسمكِ الكريم للترحيب بكِ وتقديم تجربة تسوق راقية مخصصة ومتابعة تفاصيل أوردراتكِ بكل عناية.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#1F2D24] block mb-1.5">
              الاسم الكريم أو اللقب <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="مثال: أم عبد الرحمن / فاطمة أحمد / خديجة..."
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-sm text-[#1F2D24] focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all font-medium"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#997A2E]">
                <User className="w-4 h-4" />
              </div>
            </div>
            {error && (
              <p className="text-xs text-red-600 mt-1 font-semibold">{error}</p>
            )}
          </div>

          <div className="bg-[#FAF6ED] p-3 rounded-xl border border-[#E9DECA] text-[11px] text-[#716B5E] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#997A2E] shrink-0" />
            <span>يتم تسجيل اسمكِ تلقائياً في قسم زوار المتجر بلوحة الإدارة لضمان أفضل خدمة.</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-[#C5A059] via-[#DFBD69] to-[#C5A059] hover:brightness-105 text-[#121316] font-bold text-sm rounded-xl shadow-gold hover:shadow-gold-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>تأكيد الاسم ودخول المتجر</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default VisitorRegistrationModal;
