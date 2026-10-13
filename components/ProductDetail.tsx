/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Product, StoreSettings, Review } from '../types';
import { ArrowRight, Star, ShoppingBag, ShieldCheck, Truck, Check, Sparkles, MessageCircle, Ruler } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, selectedColor: { name: string; hex: string }, selectedSize: string, quantity: number) => void;
  onDirectCheckout: (product: Product, selectedColor: { name: string; hex: string }, selectedSize: string, quantity: number) => void;
  onAskOmar: (question?: string) => void;
  settings: StoreSettings;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'verified'>) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onBack, 
  onAddToCart,
  onDirectCheckout,
  onAskOmar,
  settings,
  reviews,
  onAddReview
}) => {
  const [selectedImage, setSelectedImage] = useState(product.imageUrl);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'أسود', hex: '#111111' });
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'فري سايز');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedAlert, setAddedAlert] = useState(false);

  // New review form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Calculate deposit for this single item
  const itemTotal = product.price * quantity;
  const depositAmount = settings.depositType === 'fixed'
    ? Math.min(settings.depositFixedAmount, itemTotal)
    : Math.round((itemTotal * settings.depositPercentage) / 100);
  const remainingAmount = itemTotal - depositAmount;

  // Filter reviews for this product
  const productReviews = reviews.filter(r => r.productId === product.id);

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
  };

  const handleBuyNowClick = () => {
    onDirectCheckout(product, selectedColor, selectedSize, quantity);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    onAddReview({
      productId: product.id,
      productName: product.name,
      authorName: reviewerName,
      rating: reviewRating,
      comment: reviewComment
    });

    setReviewSubmitted(true);
    setReviewerName('');
    setReviewComment('');
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-right">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#524E46] hover:text-[#121316] bg-white px-4 py-2 rounded-xl border border-[#E8E1D3] shadow-2xs mb-8 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة لكافة الموديلات</span>
      </button>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Images Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-[#F0ECE1] border border-[#E5DECF] shadow-sm">
            <img 
              src={selectedImage} 
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            {product.isOnSale && (
              <span className="absolute top-4 right-4 bg-[#B91C1C] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md">
                {product.saleTag || 'عرض خاص'}
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === imgUrl ? 'border-[#121316] shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions Column */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-[#D97706]">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-[#716B5E] font-medium">
                {product.rating} ({product.reviewsCount} تقييم من عميلاتنا)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#18231C] mb-2 leading-tight">
              {product.name}
            </h1>

            <p className="text-sm font-semibold text-[#8A7955] mb-4">
              {product.tagline}
            </p>

            {/* Price Box */}
            <div className="bg-[#FAF6ED] p-4 rounded-2xl border border-[#E9DECA] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#787267] block">السعر:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#121316]">
                    {product.price} <span className="text-sm font-normal">ج.م</span>
                  </span>
                  {product.isOnSale && product.originalPrice && (
                    <span className="text-sm text-[#9C9484] line-through font-normal">
                      {product.originalPrice} ج.م
                    </span>
                  )}
                </div>
              </div>

              {/* Deposit notice badge */}
              <div className="bg-white px-3 py-2 rounded-xl border border-[#DDD3BF] text-center shadow-2xs">
                <span className="text-[11px] text-[#787267] block font-medium">العربون المطلوب فقط</span>
                <span className="text-sm font-bold text-[#121316]">{depositAmount} ج.م</span>
                <span className="text-[10px] text-[#8A7955] block">والباقي ({remainingAmount} ج.م) كاش عند الاستلام</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-[#524E46] leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Fabric Specification */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E8E1D3] text-xs space-y-1">
            <span className="font-bold text-[#1F2D24] block">الخامة المعتمدة:</span>
            <span className="text-[#615C52]">{product.fabric}</span>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-[#1F2D24] flex items-center justify-between">
                <span>اختاري اللون: <span className="text-[#121316] font-semibold">{selectedColor.name}</span></span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((color, idx) => {
                  const isSelected = selectedColor.name === color.name;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected 
                          ? 'border-[#121316] bg-[#F2EDE2] text-[#121316] shadow-xs' 
                          : 'border-[#DDD3BF] bg-white text-[#524E46] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-[#1F2D24]">
                  <span>المقاس أو الطول:</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-xs text-[#121316] font-bold hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>دليل المقاسات والطول</span>
                </button>
              </div>

              {/* Sizing dropdown / buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.sizes.map((size, idx) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        isSelected 
                          ? 'border-[#121316] bg-[#121316] text-white shadow-xs' 
                          : 'border-[#DDD3BF] bg-white text-[#3C3A35] hover:bg-[#F2EDE2]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* Collapsible size guide */}
              {showSizeGuide && (
                <div className="bg-[#FAF6ED] p-3.5 rounded-xl border border-[#E9DECA] text-xs text-[#524E46] space-y-1.5 mt-2 animate-fadeIn">
                  <p className="font-bold text-[#1F2D24]">💡 إرشادات اختيار المقاس لموديلات آل جابر:</p>
                  <p>• <strong>مقاس 1:</strong> يناسب الأطوال من 155 إلى 162 سم (حتى وزن 80 كجم).</p>
                  <p>• <strong>مقاس 2:</strong> يناسب الأطوال من 163 إلى 170 سم (حتى وزن 95 كجم).</p>
                  <p>• <strong>مقاس 3:</strong> يناسب الأطوال من 170 سم فأكثر أو المقاسات الفضفاضة الخاصة.</p>
                  <p>• يمكنكِ كتابة طولكِ الدقيق في خانة الملاحظات عند إتمام الأوردر لنجهزه لكِ بدقة تامة.</p>
                </div>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-xs sm:text-sm font-bold text-[#1F2D24]">الكمية:</span>
            <div className="flex items-center bg-white border border-[#DDD3BF] rounded-xl overflow-hidden shadow-2xs">
              <button 
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center font-bold text-[#1F2D24] hover:bg-[#F0ECE1] transition-colors"
              >
                -
              </button>
              <span className="w-10 text-center font-bold text-sm text-[#121316]">{quantity}</span>
              <button 
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center font-bold text-[#1F2D24] hover:bg-[#F0ECE1] transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Alert of added item */}
          {addedAlert && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>تمت إضافة الموديل إلى سلة المشتريات بنجاح! يمكنكِ المتابعة أو إتمام الطلب الآن.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleBuyNowClick}
              className="flex-1 py-3.5 px-6 bg-gradient-to-r from-[#C5A059] to-[#DFBD69] hover:from-[#DFBD69] hover:to-[#F3E5AB] text-[#121316] rounded-xl font-bold text-sm sm:text-base shadow-gold transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5 text-[#121316]" />
              <span>شراء الآن وتأكيد العربون ({depositAmount} ج.م)</span>
            </button>

            <button
              onClick={handleAddToCartClick}
              className="py-3.5 px-6 bg-[#FAF6ED] hover:bg-[#F0EBE1] text-[#1F2D24] rounded-xl font-bold text-sm sm:text-base border border-[#DDD3BF] transition-all flex items-center justify-center gap-2"
            >
              <span>أضف للسلة</span>
            </button>
          </div>

          {/* Ask Omar Button for advice */}
          <div className="bg-gradient-to-r from-[#F0ECE1] to-[#FAF8F5] p-3.5 rounded-2xl border border-[#E5DECF] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#121316] text-[#E2D2A4] flex items-center justify-center font-bold text-xs shrink-0">
                عمر
              </div>
              <div>
                <p className="text-xs font-bold text-[#18231C]">محتارة في المقاس أو الخامة؟</p>
                <p className="text-[11px] text-[#716B5E]">اسألي بوت الذكاء الاصطناعي عمر عن هذا الموديل</p>
              </div>
            </div>

            <button
              onClick={() => onAskOmar(`ما رأيك في موديل "${product.name}"؟ وهل يناسب طولي واستخدامي؟`)}
              className="px-3.5 py-1.5 bg-white text-[#121316] rounded-xl text-xs font-bold border border-[#DDD3BF] hover:bg-[#FAF8F5] transition-all shrink-0"
            >
              استشيري عمر الآن
            </button>
          </div>

          {/* Features bullet list */}
          {product.features && product.features.length > 0 && (
            <div className="pt-4 border-t border-[#EFE9DD]">
              <h4 className="text-xs sm:text-sm font-bold text-[#1F2D24] mb-3">مميزات هذا الموديل:</h4>
              <ul className="grid grid-cols-1 gap-2">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#524E46]">
                    <Check className="w-4 h-4 text-[#121316] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>

      {/* Customer Reviews Section for this product */}
      <div className="mt-16 pt-10 border-t border-[#EAE3D5]">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#18231C]">
                تقييمات وآراء العميلات
              </h3>
              <p className="text-xs text-[#716B5E] mt-1">
                تجارب حقيقية لأخواتنا مع موديل "{product.name}"
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-[#E8E1D3]">
              <span className="text-2xl font-bold text-[#121316]">{product.rating}</span>
              <div className="flex flex-col">
                <div className="flex text-[#D97706]">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-[10px] text-[#787267]">تقييم ممتاز</span>
              </div>
            </div>
          </div>

          {/* Reviews list */}
          <div className="space-y-3">
            {productReviews.length > 0 ? (
              productReviews.map((rev) => (
                <div key={rev.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E9E2D4] shadow-2xs text-right">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1F2D24]">{rev.authorName}</span>
                      {rev.verified && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                          شراء مؤكد
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#8A7955]">{rev.date}</span>
                  </div>

                  <div className="flex text-[#D97706] mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[#524E46] leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-[#E9E2D4] text-center text-xs text-[#716B5E]">
                كوني أول من يشاركنا رأيها وتقييمها لهذا الموديل الراقي!
              </div>
            )}
          </div>

          {/* Add Review Form */}
          <div className="bg-white p-6 rounded-2xl border border-[#E9E2D4] shadow-xs">
            <h4 className="text-base font-bold text-[#18231C] mb-4 font-serif">
              شاركينا تجربتكِ مع هذا الموديل
            </h4>

            {reviewSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold">
                شكرًا جزيلاً لكِ يا أختنا الكريمة على مشاركة رأيكِ الطيب! تم تسجيل تقييمكِ بنجاح.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1F2D24] block mb-1">اسمكِ الكريم:</label>
                    <input 
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="مثال: أم عبد الرحمن"
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs text-[#1F2D24] focus:outline-none focus:border-[#121316]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1F2D24] block mb-1">التقييم:</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs text-[#1F2D24] focus:outline-none focus:border-[#121316]"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 نجوم (ممتاز جداً)</option>
                      <option value="4">⭐⭐⭐⭐ 4 نجوم (جيد جداً)</option>
                      <option value="3">⭐⭐⭐ 3 نجوم (جيد)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F2D24] block mb-1">رأيكِ في القماش والمقاس والتفصيل:</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="اكتبي رأيكِ بأمانة لمساعدة أخواتكِ في اختيار الموديل..."
                    className="w-full p-3 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs text-[#1F2D24] focus:outline-none focus:border-[#121316]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#DFBD69] text-[#121316] text-xs font-bold rounded-xl shadow-gold hover:from-[#DFBD69] hover:to-[#F3E5AB] transition-all"
                >
                  إرسال التقييم
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProductDetail;
