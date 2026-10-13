/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import { CATEGORIES_LIST } from '../constants';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  selectedCategory, 
  onSelectCategory,
  onProductClick,
  onAddToCart 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'sale'>('featured');
  const [onlySales, setOnlySales] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Sales only filter
      if (onlySales && !product.isOnSale) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesFabric = product.fabric.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesFabric && !matchesDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'sale') return (b.isOnSale ? 1 : 0) - (a.isOnSale ? 1 : 0);
      return 0; // default featured
    });
  }, [products, selectedCategory, onlySales, searchQuery, sortBy]);

  return (
    <section id="products" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-[#8A7955] uppercase tracking-wider block mb-2">
          تشكيلة فاخرة
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F2D24] mb-3">
          موديلات آل جابر للزي الشرعي
        </h2>
        <p className="text-sm sm:text-base text-[#615C52]">
          اختاري ما يناسبكِ من أحدث تصميمات الإدناءات والإسدالات والنقابات والخمارات المصنوعة بأرقى الأقمشة
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4 mb-8">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start lg:justify-center">
          {CATEGORIES_LIST.map((tab) => {
            const isActive = selectedCategory === tab.id && !onlySales;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setOnlySales(false);
                  onSelectCategory(tab.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive 
                    ? 'bg-[#121316] text-[#F3E5AB] border border-[#C5A059] shadow-gold' 
                    : 'bg-white text-[#524E46] hover:bg-[#EFE9DD] border border-[#E9E2D4]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          {/* Quick Sale Tab */}
          <button
            onClick={() => setOnlySales(!onlySales)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
              onlySales 
                ? 'bg-[#B91C1C] text-white shadow-sm' 
                : 'bg-red-50 text-[#B91C1C] hover:bg-red-100 border border-red-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>العروض والخصومات 🔥</span>
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحثي عن موديل، خامة، أو نوع..."
              className="w-full pr-10 pl-4 py-2.5 bg-white border border-[#DDD3C1] rounded-xl text-xs sm:text-sm text-[#1F2D24] placeholder-[#9C9484] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
            />
            <Search className="w-4 h-4 text-[#9C9484] absolute right-3.5 top-3 pointer-events-none" />
          </div>

          {/* Sort & Count */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <span className="text-xs text-[#716B5E] font-medium">
              عرض {filteredProducts.length} موديل
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#716B5E]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#DDD3C1] text-xs font-semibold text-[#1F2D24] py-2 px-3 rounded-xl focus:outline-none focus:border-[#C5A059]"
              >
                <option value="featured">المميزة أولاً</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="sale">العروض أولاً</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Grid of Products */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              onProductClick={onProductClick}
              onQuickAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E9E2D4] my-8 max-w-md mx-auto">
          <p className="text-base font-bold text-[#1F2D24] mb-2 font-serif">
            لم يتم العثور على موديلات مطابقة للبحث
          </p>
          <p className="text-xs text-[#716B5E] mb-6">
            جربي البحث بكلمات أخرى أو تصفح كافة الأقسام
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setOnlySales(false);
              onSelectCategory('all');
            }}
            className="px-6 py-2.5 bg-[#121316] text-[#F3E5AB] border border-[#C5A059] text-xs font-bold rounded-xl shadow-gold"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      )}

    </section>
  );
};

export default ProductGrid;
