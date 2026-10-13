/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { StoreSettings } from '../types';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface AboutProps {
  settings: StoreSettings;
}

const About: React.FC<AboutProps> = ({ settings }) => {
  const aboutImage = settings.siteImages?.aboutImageUrl || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=900';
  const logoImage = settings.siteImages?.logoUrl || '/logo.jpg';

  return (
    <section id="about" className="py-20 bg-[#14161A] text-white border-b border-[#C5A059]/20 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Column */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C5A059]/40 group">
              <img 
                src={aboutImage} 
                alt="عن آل جابر للزي الشرعي"
                className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#C5A059] shadow-gold shrink-0">
                    <img src={logoImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs text-[#DFBD69] font-bold block">{settings.brandName}</span>
                    <p className="font-serif text-base font-bold text-white">{settings.brandSlogan || 'أناقة الالتزام.. وجمال التراث'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div>
              <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider block mb-2">
                عن براند آل جابر للزي الشرعي
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-snug">
                نعتز بخدمة المرأة المسلمة <br />
                <span className="text-gold-gradient">بكل ما تحتاج إليه للالتزام بالحجاب الشرعي الكامل</span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              انطلق براند <strong className="text-[#F3E5AB] font-semibold">{settings.brandName}</strong> بشعارنا الراسخ <strong className="text-[#DFBD69]">«{settings.brandSlogan || 'أناقة الالتزام.. وجمال التراث'}»</strong> لتقديم أرقى تصاميم الإدناءات والإسدالات والنقابات والخمارات والدريسات.
            </p>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              نختار خاماتنا بأنفسنا بعناية فائقة من أجود أنواع الكريب رويال الكوري والسعودي والشيفون الإندونيسي والقطن البيور. نحرص في كل قطعة على أن تكون غير شفافة ولا تصف، لتكوني مطمئنة ومستريحة في كل خطوة ومناسبة.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white/5 rounded-2xl border border-[#C5A059]/25">
                <h3 className="font-bold text-sm text-[#DFBD69] mb-1 font-serif">شروط الزي الشرعي التام</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  قصات واسعة وفضفاضة تغطي سائر البدن بلا تضييق ولا زينة لافتة، مع مراعاة راحة التنفس والحركة.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-[#C5A059]/25">
                <h3 className="font-bold text-sm text-[#DFBD69] mb-1 font-serif">أمانة ويسر في التعامل</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  عربون بسيط وميسر لتأكيد الجدية، متابعة فورية عبر الواتساب، وتوصيل سريع مع الدفع كاش عند الباب.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default About;