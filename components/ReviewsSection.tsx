/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Review } from '../types';
import { Star, ShieldCheck, Heart } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: Review[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  return (
    <section id="reviews" className="py-16 bg-[#F3EDE2] border-b border-[#E5DCB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#8A7955] uppercase tracking-wider block mb-2">
            شهادات نعتز بها
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#18231C]">
            آراء وتجارب أخواتنا مع آل جابر
          </h2>
          <p className="text-xs sm:text-sm text-[#615C52] mt-2">
            ثقتكم هي غايتنا، ونسعى دائماً لتقديم أصدق تجربة في جودة الأقمشة وتمام الستر والوقار
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((rev) => (
            <div 
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-[#E8E1D3] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex text-[#D97706] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#48443D] leading-relaxed mb-4 italic font-serif">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                <div>
                  <strong className="text-xs font-bold text-[#1F2D24] block">
                    {rev.authorName}
                  </strong>
                  <span className="text-[10px] text-[#8C8578]">
                    {rev.productName}
                  </span>
                </div>

                {rev.verified && (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                    شراء مؤكد ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ReviewsSection;
