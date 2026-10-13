/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product } from '../types';
import { Star, Eye, ShoppingBag, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onProductClick,
  onQuickAddToCart 
}) => {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'ednaa': return 'إدناء شرعي';
      case 'isdal': return 'إسدال';
      case 'niqab': return 'نقاب فاخر';
      case 'khimar': return 'خمار سابغ';
      case 'dress': return 'دريس وعباية';
      case 'accessories': return 'مستلزمات';
      default: return 'زي شرعي';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#E5DECF] overflow-hidden shadow-xs hover:shadow-gold transition-all duration-300 flex flex-col justify-between text-right hover:border-[#C5A059]/60">
      
      {/* Product Image & Badges */}
      <div 
        className="relative aspect-4/5 overflow-hidden bg-[#181A1F] cursor-pointer"
        onClick={() => onProductClick(product)}
      >
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121316]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product);
            }}
            className="w-full py-2.5 bg-[#FAF8F5] text-[#121316] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-white transition-colors"
          >
            <Eye className="w-4 h-4 text-[#997A2E]" />
            <span>عرض تفاصيل الموديل والمقاسات</span>
          </button>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {product.isOnSale && (
            <span className="bg-gradient-to-r from-[#B91C1C] to-[#DC2626] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FED7AA]" />
              <span>{product.saleTag || 'تخفيض خاص'}</span>
            </span>
          )}
          <span className="bg-[#121316]/90 backdrop-blur-xs text-[#F3E5AB] border border-[#C5A059]/40 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
            {getCategoryLabel(product.category)}
          </span>
        </div>

        {/* Stock status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-[#B91C1C] text-white font-bold text-xs px-4 py-2 rounded-xl">
              نفدت الكمية مؤقتاً
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex text-[#DFBD69]">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-[11px] text-[#787267] font-medium">
              ({product.reviewsCount} تقييم)
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onProductClick(product)}
            className="font-serif font-bold text-base sm:text-lg text-[#1F2D24] mb-1.5 group-hover:text-[#997A2E] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Fabric subtitle */}
          <p className="text-xs text-[#6A655A] mb-3 line-clamp-1 font-medium">
            الخامة: {product.fabric}
          </p>

          {/* Color previews */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-[11px] text-[#8C8578] ml-1">الألوان:</span>
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 5).map((color, idx) => (
                  <span 
                    key={idx}
                    title={color.name}
                    className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
                {product.colors.length > 5 && (
                  <span className="text-[10px] text-[#716B5E]">+{product.colors.length - 5}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Cart Button */}
        <div className="pt-3 border-t border-[#EFE9DD] flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg sm:text-xl text-[#121316]">
                {product.price} <span className="text-xs font-normal text-[#997A2E]">ج.م</span>
              </span>
              {product.isOnSale && product.originalPrice && (
                <span className="text-xs text-[#9C9484] line-through font-normal">
                  {product.originalPrice} ج.م
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onQuickAddToCart(product)}
            className="flex items-center gap-1.5 bg-[#FAF7F2] hover:bg-gradient-to-r hover:from-[#C5A059] hover:to-[#DFBD69] text-[#121316] px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-[#C5A059]/40 hover:border-transparent shadow-2xs hover:shadow active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>طلب</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
