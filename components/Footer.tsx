/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { StoreSettings, ProductCategory } from '../types';
import { Phone, MessageSquare, ShieldCheck, Lock, Heart } from 'lucide-react';

interface FooterProps {
  settings: StoreSettings;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  onCategoryClick: (category: ProductCategory) => void;
  onOpenAdmin: () => void;
}

const Footer: React.FC<FooterProps> = ({ 
  settings, 
  onLinkClick, 
  onCategoryClick,
  onOpenAdmin 
}) => {
  return (
    <footer className="bg-[#0F1014] text-[#FAF8F5] pt-16 pb-12 border-t border-[#C5A059]/30 text-right font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#C5A059] shadow-gold bg-[#14161A] shrink-0">
                <img 
                  src={settings.siteImages?.logoUrl || '/logo.jpg'} 
                  alt={settings.brandName} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-[#F3E5AB] block">
                  {settings.brandName}
                </span>
                <span className="text-xs text-[#C5A059] font-medium">
                  {settings.brandSlogan || 'أناقة الالتزام.. وجمال التراث'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm">
              متجر متخصص في توفير كافة مستلزمات الحجاب والزي الشرعي السابغ من إدناءات وإسدالات ونقابات وخمارات ودريسات بأرقى خامات الكريب والقطن المعالج.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700/80 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>واتساب خدمة العملاء</span>
              </a>

              <div className="flex items-center gap-1.5 text-xs text-gray-300">
                <Phone className="w-3.5 h-3.5 text-[#DFBD69]" />
                <span>{settings.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Quick Categories (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#DFBD69] mb-3">
              أقسام الموديلات
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <button 
                  onClick={() => onCategoryClick('ednaa')}
                  className="hover:text-[#F3E5AB] transition-colors"
                >
                  إدناءات شرعية فرنسية
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onCategoryClick('isdal')}
                  className="hover:text-[#F3E5AB] transition-colors"
                >
                  إسدالات صلاة وخروج كريب
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onCategoryClick('niqab')}
                  className="hover:text-[#F3E5AB] transition-colors"
                >
                  نقابات كورية وماليزية تندة
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onCategoryClick('khimar')}
                  className="hover:text-[#F3E5AB] transition-colors"
                >
                  خمار فرنسي وكلوش دورين
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onCategoryClick('dress')}
                  className="hover:text-[#F3E5AB] transition-colors"
                >
                  دريسات وعبايات فراشة
                </button>
              </li>
            </ul>
          </div>

          {/* Policies & Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#DFBD69] mb-3">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <a href="#products" onClick={(e) => onLinkClick(e, 'products')} className="hover:text-[#F3E5AB] transition-colors">
                  تصفح الموديلات
                </a>
              </li>
              <li>
                <a href="#reviews" onClick={(e) => onLinkClick(e, 'reviews')} className="hover:text-[#F3E5AB] transition-colors">
                  تقييمات العميلات
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => onLinkClick(e, 'about')} className="hover:text-[#F3E5AB] transition-colors">
                  عن آل جابر
                </a>
              </li>
              <li>
                <span className="text-[11px] text-[#C5A059] block pt-1">
                  عربون رمزي: {settings.depositType === 'fixed' ? `${settings.depositFixedAmount} ج.م` : `${settings.depositPercentage}%`}
                </span>
              </li>
            </ul>
          </div>

          {/* Admin Portal (2 cols) - Strictly confidential, no password shown */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#DFBD69] mb-3">
              إدارة المتجر
            </h4>
            <p className="text-[11px] text-gray-400">
              لوحة التحكم الخاصة بالإدارة لمتابعة الطلبات وتأكيد العرابين ونشر الموديلات والبانرات.
            </p>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-[#F3E5AB] rounded-xl text-xs font-bold transition-all border border-[#C5A059]/40"
            >
              <Lock className="w-3.5 h-3.5 text-[#DFBD69]" />
              <span>لوحة الإدارة</span>
            </button>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {settings.brandName}. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1">
            <span>صُنع بحب وعناية لخدمة المرأة المسلمة</span>
            <Heart className="w-3.5 h-3.5 text-[#DFBD69] fill-current" />
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
