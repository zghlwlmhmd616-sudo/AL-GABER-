/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Lock, Menu, X, Sparkles, MessageSquare, Phone } from 'lucide-react';
import { ProductCategory, StoreSettings } from '../types';

interface NavbarProps {
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onCategorySelect?: (category: ProductCategory) => void;
  settings: StoreSettings;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onNavClick, 
  cartCount, 
  cartTotal, 
  onOpenCart, 
  onOpenAdmin,
  onCategorySelect,
  settings 
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMobileMenuOpen(false);
    onNavClick(e, targetId);
  };

  const handleCategoryClick = (cat: ProductCategory) => {
    setMobileMenuOpen(false);
    if (onCategorySelect) {
      onCategorySelect(cat);
    }
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header 
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#121316]/95 backdrop-blur-md shadow-lg py-2.5 border-b border-[#C5A059]/30 text-white' 
            : 'bg-[#14161A] py-3.5 border-b border-[#C5A059]/20 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 text-[#E5C378] hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavClick(e, '');
              }}
              className="flex items-center gap-3 group text-right"
            >
              {/* Logo Image */}
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 border-[#C5A059] shadow-gold shrink-0 group-hover:scale-105 transition-transform bg-[#0B0C0E]">
                <img 
                  src={settings.siteImages?.logoUrl || '/logo.jpg'} 
                  alt={settings.brandName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to stylized initial if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-serif font-bold text-[#F3E5AB] tracking-tight group-hover:text-[#DFBD69] transition-colors leading-tight">
                  {settings.brandName}
                </span>
                <span className="text-[11px] text-[#C5A059] font-medium tracking-normal hidden sm:block">
                  {settings.brandSlogan || 'أناقة الالتزام.. وجمال التراث'}
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-200">
            <a 
              href="#products" 
              onClick={(e) => handleLinkClick(e, 'products')} 
              className="hover:text-[#F3E5AB] transition-colors py-1 hover:border-b-2 hover:border-[#C5A059]"
            >
              كافة الموديلات
            </a>
            <button 
              onClick={() => handleCategoryClick('ednaa')}
              className="hover:text-[#F3E5AB] transition-colors py-1 hover:border-b-2 hover:border-[#C5A059]"
            >
              إدناءات
            </button>
            <button 
              onClick={() => handleCategoryClick('isdal')}
              className="hover:text-[#F3E5AB] transition-colors py-1 hover:border-b-2 hover:border-[#C5A059]"
            >
              إسدالات
            </button>
            <button 
              onClick={() => handleCategoryClick('niqab')}
              className="hover:text-[#F3E5AB] transition-colors py-1 hover:border-b-2 hover:border-[#C5A059]"
            >
              نقابات
            </button>
            <button 
              onClick={() => handleCategoryClick('khimar')}
              className="hover:text-[#F3E5AB] transition-colors py-1 hover:border-b-2 hover:border-[#C5A059]"
            >
              خمار
            </button>
            <button 
              onClick={() => handleCategoryClick('dress')}
              className="hover:text-[#F3E5AB] transition-colors py-1 hover:border-b-2 hover:border-[#C5A059]"
            >
              دريسات
            </button>
            <a 
              href="#reviews" 
              onClick={(e) => handleLinkClick(e, 'reviews')} 
              className="hover:text-[#F3E5AB] transition-colors py-1 hover:border-b-2 hover:border-[#C5A059]"
            >
              آراء العميلات
            </a>
            <a 
              href="#about" 
              onClick={(e) => handleLinkClick(e, 'about')} 
              className="hover:text-[#F3E5AB] transition-colors py-1 hover:border-b-2 hover:border-[#C5A059]"
            >
              عن آل جابر
            </a>
          </nav>

          {/* Action Buttons (Cart & Admin) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Customer Service Contact */}
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#DFBD69] hover:text-[#F3E5AB] bg-white/5 hover:bg-white/10 border border-[#C5A059]/40 rounded-xl transition-all"
              title="تواصل مع خدمة العملاء"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden xl:inline">خدمة العملاء:</span>
              <span className="font-mono text-xs">{settings.contactPhone}</span>
            </a>

            {/* Confidential Admin Button (No password displayed!) */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-[#DFBD69] hover:text-[#F3E5AB] bg-white/5 hover:bg-white/10 border border-[#C5A059]/40 rounded-xl transition-all"
              title="لوحة الإدارة"
            >
              <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">لوحة الإدارة</span>
            </button>

            {/* Shopping Cart Button */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                onOpenCart();
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-[#C5A059] to-[#DFBD69] hover:from-[#DFBD69] hover:to-[#F3E5AB] text-[#121316] rounded-xl font-bold text-xs sm:text-sm transition-all shadow-gold hover:shadow-gold-lg active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[#121316]" />
              <span>السلة</span>
              {cartCount > 0 && (
                <span className="bg-[#121316] text-[#F3E5AB] font-bold text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
              {cartTotal > 0 && (
                <span className="hidden md:inline text-xs text-[#121316] mr-1 border-r border-[#121316]/30 pr-1.5 font-bold">
                  {cartTotal} ج.م
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#14161A] border-l border-[#C5A059]/30 text-white shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#C5A059]/30 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#C5A059]">
                    <img 
                      src={settings.siteImages?.logoUrl || '/logo.jpg'} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="font-serif font-bold text-base text-[#F3E5AB]">
                    {settings.brandName}
                  </span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#C5A059] hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col space-y-3 font-semibold text-sm text-gray-200">
                <button 
                  onClick={() => handleCategoryClick('all')} 
                  className="text-right py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  كافة الموديلات
                </button>
                <button 
                  onClick={() => handleCategoryClick('ednaa')} 
                  className="text-right py-2 px-3 rounded-xl hover:bg-white/5 text-[#F3E5AB] font-bold transition-colors"
                >
                  إدناءات شرعية
                </button>
                <button 
                  onClick={() => handleCategoryClick('isdal')} 
                  className="text-right py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  إسدالات صلاة وخروج
                </button>
                <button 
                  onClick={() => handleCategoryClick('niqab')} 
                  className="text-right py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  نقابات فاخرة
                </button>
                <button 
                  onClick={() => handleCategoryClick('khimar')} 
                  className="text-right py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  خمار فرنسي وكلوش
                </button>
                <button 
                  onClick={() => handleCategoryClick('dress')} 
                  className="text-right py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  دريسات وعبايات
                </button>
                <a 
                  href="#reviews" 
                  onClick={(e) => handleLinkClick(e, 'reviews')} 
                  className="text-right py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  آراء العميلات
                </a>
                <a 
                  href="#about" 
                  onClick={(e) => handleLinkClick(e, 'about')} 
                  className="text-right py-2 px-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  عن آل جابر
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-[#C5A059]/30 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-[#F3E5AB] rounded-xl font-semibold text-xs border border-[#C5A059]/40"
              >
                <Lock className="w-4 h-4 text-[#C5A059]" />
                <span>لوحة الإدارة</span>
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-[#C5A059] pt-1">
                <Phone className="w-3.5 h-3.5" />
                <span>خدمة العملاء: {settings.contactPhone}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
