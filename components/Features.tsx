/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { ShieldCheck, HeartHandshake, Scissors, Truck, Sparkles, Clock } from 'lucide-react';
import { StoreSettings } from '../types';

interface FeaturesProps {
  settings: StoreSettings;
}

const Features: React.FC<FeaturesProps> = ({ settings }) => {
  const depositText = settings.depositCalculationMode === 'shipping_fee'
    ? 'تكلفة الشحن فقط'
    : settings.depositType === 'fixed' 
      ? `${settings.depositFixedAmount} ج.م` 
      : `${settings.depositPercentage}%`;

  const featuresList = [
    {
      icon: <Scissors className="w-6 h-6 text-[#997A2E]" />,
      title: 'خامات كريب ملكية فاخرة',
      description: 'نختار أجود خامات الكريب رويال والسعودي والسي واي والقطن البيور، أقمشة غير شفافة ولا تصف ومريحة في كل الفصول.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#997A2E]" />,
      title: 'ستر ووقار كامل',
      description: 'جميع الموديلات مصممة بمقاسات وقصات فضفاضة سابغة تلتزم التزاماً كاملاً بضوابط الحجاب الشرعي دون أي تنازل.'
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#997A2E]" />,
      title: `عربون ميسر (${depositText})`,
      description: 'عربون رمزي بسيط لتأكيد الجدية وحجز القماش، وتدفعين باقي المبلغ كاش باليد عند استلام الشحنة أمام باب البيت.'
    },
    {
      icon: <Truck className="w-6 h-6 text-[#997A2E]" />,
      title: 'شحن لجميع المحافظات',
      description: settings.isFreeShippingPromotionActive
        ? `عروض شحن مميزة وشحن مجاني للطلبات فوق ${settings.freeShippingThreshold} ج.م مع تغليف فاخر ومحكم.`
        : `توصيل سريع خلال 48 إلى 72 ساعة لجميع محافظات ومدن وقرى مصر بسعر شحن رمزي.`
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#997A2E]" />,
      title: 'استشارة الذكاء الاصطناعي "عمر"',
      description: 'بوت ذكي متوفر على مدار الساعة لمساعدتكِ في معرفة المقاس الأنسب لطولكِ وتنسيق الألوان واختيار النقاب المريح.'
    },
    {
      icon: <Clock className="w-6 h-6 text-[#997A2E]" />,
      title: 'دقة وتفصيل متقن',
      description: 'خياطة نظيفة وتشطيب نخب أول بأزرار وسوست خفية مريحة للوضوء والرضاعة والحركة اليومية السلسة.'
    }
  ];

  return (
    <section className="py-14 bg-[#FAF7F2] border-b border-[#E5DECF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#997A2E] uppercase tracking-wider block mb-2">
            لماذا تختارين آل جابر؟
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#18231C]">
            معاييرنا في تقديم الزي الشرعي الراقي
          </h2>
          <p className="text-sm sm:text-base text-[#615C52] mt-2">
            {settings.brandSlogan || 'أناقة الالتزام.. وجمال التراث'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-2xl border border-[#E8E1D3] shadow-xs hover:shadow-gold transition-all text-right group hover:border-[#C5A059]/40"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF6ED] border border-[#C5A059]/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-[#18231C] mb-2 font-serif">
                {item.title}
              </h3>
              <p className="text-sm text-[#615C52] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
