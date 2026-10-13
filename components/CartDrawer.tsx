/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { CartItem, StoreSettings } from '../types';
import { X, Trash2, ShoppingBag, ArrowLeft, Truck, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  settings: StoreSettings;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity,
  onRemoveItem, 
  onCheckout,
  settings 
}) => {
  if (!isOpen) return null;

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Check if eligible for free shipping
  const isFreeShipping = settings.isFreeShippingPromotionActive && (
    settings.freeShippingPromoType === 'all' || subtotal >= settings.freeShippingThreshold
  );

  const shippingCost = items.length === 0 ? 0 : (isFreeShipping ? 0 : settings.shippingCostDefault);
  const total = subtotal + shippingCost;

  // Deposit calculation
  const depositRequired = items.length === 0 ? 0 : (
    settings.depositType === 'fixed'
      ? Math.min(settings.depositFixedAmount, total)
      : Math.round((total * settings.depositPercentage) / 100)
  );

  const remainingCash = Math.max(0, total - depositRequired);

  // Free shipping progress calculation
  const neededForFreeShipping = Math.max(0, settings.freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / settings.freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FAF8F5] shadow-2xl flex flex-col justify-between z-10 text-right animate-slideInRight">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E8E1D3] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#997A2E]" />
            <h3 className="font-serif font-bold text-lg text-[#1F2D24]">
              سلة المشتريات ({items.length})
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#716B5E] hover:text-[#1F2D24] hover:bg-[#F2EDE2] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Notification */}
        {settings.isFreeShippingPromotionActive && settings.freeShippingPromoType === 'threshold' && items.length > 0 && (
          <div className="bg-[#FAF6ED] px-5 py-3 border-b border-[#E9DECA] text-xs">
            <div className="flex items-center justify-between mb-1.5 font-semibold text-[#1F2D24]">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#997A2E]" />
                {isFreeShipping ? (
                  <span className="text-[#997A2E] font-bold">🎉 مبارك! لقد حصلتِ على شحن مجاني لكافة المحافظات</span>
                ) : (
                  <span>أضيفي بقيمة <strong className="text-[#997A2E]">{neededForFreeShipping} ج.م</strong> للحصول على شحن مجاني!</span>
                )}
              </span>
              <span>{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-[#E5DECF] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#997A2E] h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-[#716B5E]">
              <div className="w-16 h-16 rounded-full bg-[#F0ECE1] flex items-center justify-center text-[#9C9484]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-base text-[#1F2D24]">سلتكِ فارغة حالياً</p>
              <p className="text-xs max-w-xs">
                تصفحي تشكيلة آل جابر للزي الشرعي واختاري ما يناسبكِ من أحدث الإدناءات والإسدالات والنقابات
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#997A2E] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#15463D] transition-colors"
              >
                تصفح الموديلات الآن
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-3.5 rounded-2xl border border-[#E8E1D3] shadow-2xs flex gap-3 items-center justify-between"
              >
                {/* Thumbnail */}
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#F0ECE1] shrink-0 border border-[#EAE3D5]">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pr-1">
                  <h4 className="font-bold text-xs sm:text-sm text-[#1F2D24] truncate">
                    {item.product.name}
                  </h4>
                  
                  <div className="flex items-center gap-2 text-[11px] text-[#716B5E] mt-1">
                    <span className="flex items-center gap-1">
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-black/20" 
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      <span>{item.selectedColor.name}</span>
                    </span>
                    <span>•</span>
                    <span className="bg-[#F5F2EB] px-1.5 py-0.5 rounded text-[#524E46] font-medium">
                      {item.selectedSize}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-[#997A2E]">
                      {item.product.price * item.quantity} ج.م
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#DDD3BF] rounded-lg overflow-hidden bg-[#FAF8F5]">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs text-[#524E46] hover:bg-[#EFE9DD]"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#1F2D24]">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs text-[#524E46] hover:bg-[#EFE9DD]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 text-[#9C9484] hover:text-red-600 transition-colors shrink-0"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-[#E8E1D3] space-y-3">
            <div className="space-y-1.5 text-xs text-[#615C52]">
              <div className="flex justify-between">
                <span>إجمالي الموديلات:</span>
                <span className="font-semibold text-[#1F2D24]">{subtotal} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>مصاريف الشحن:</span>
                <span>
                  {shippingCost === 0 ? (
                    <strong className="text-emerald-700 font-bold">مجاني ✨</strong>
                  ) : (
                    <strong className="text-[#1F2D24] font-semibold">{shippingCost} ج.م</strong>
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#F0ECE1] font-bold text-sm text-[#1F2D24]">
                <span>إجمالي الطلب:</span>
                <span className="text-base text-[#997A2E]">{total} ج.م</span>
              </div>
            </div>

            {/* Deposit Box Notice */}
            <div className="bg-[#FAF6ED] p-3 rounded-xl border border-[#E9DECA] text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#1F2D24]">العربون المطلوب تحويله:</span>
                <span className="font-extrabold text-[#997A2E] text-sm">{depositRequired} ج.م</span>
              </div>
              <p className="text-[11px] text-[#787267]">
                والمبلغ المتبقي <strong>({remainingCash} ج.م)</strong> يدفع عند استلام الأوردر كاش باليد.
              </p>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-[#C5A059] to-[#DFBD69] hover:from-[#DFBD69] hover:to-[#F3E5AB] text-[#121316] rounded-xl font-bold text-sm shadow-gold hover:shadow-gold-lg transition-all flex items-center justify-center gap-2"
            >
              <span>متابعة إتمام الطلب وتحويل العربون</span>
              <ArrowLeft className="w-4 h-4 text-[#121316]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;
