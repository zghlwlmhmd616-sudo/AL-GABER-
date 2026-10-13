/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { CartItem, StoreSettings, Order } from '../types';
import { DETAILED_EGYPT_REGIONS, getGovernorateRate } from '../constants';
import { 
  ArrowRight, 
  ShieldCheck, 
  Copy, 
  Check, 
  Upload, 
  Image as ImageIcon, 
  AlertCircle, 
  Truck, 
  Phone, 
  User, 
  MapPin, 
  FileText,
  Clock,
  Sparkles,
  Info,
  X
} from 'lucide-react';

interface CheckoutProps {
  items: CartItem[];
  settings: StoreSettings;
  onBack: () => void;
  onOrderSuccess: (order: Order) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ 
  items, 
  settings, 
  onBack, 
  onOrderSuccess 
}) => {
  // Customer info form state
  const [customerName, setCustomerName] = useState(() => {
    try {
      return localStorage.getItem('algaber_visitor_name') || '';
    } catch {
      return '';
    }
  });
  const [phone, setPhone] = useState('');
  const [phoneSecondary, setPhoneSecondary] = useState('');
  const [governorate, setGovernorate] = useState(DETAILED_EGYPT_REGIONS[3].name); // القاهرة
  const [cityAndArea, setCityAndArea] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Shipping rates table modal
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);

  // Deposit info form state
  const [selectedMethodId, setSelectedMethodId] = useState(settings.paymentMethods[0]?.id || 'vodafone_cash');
  const [depositSenderNumber, setDepositSenderNumber] = useState('');
  const [depositScreenshotUrl, setDepositScreenshotUrl] = useState('');
  const [depositScreenshotName, setDepositScreenshotName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Status & Validation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Regional rate based on selected governorate
  const regionRate = getGovernorateRate(governorate, settings);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const isFreeShipping = settings.isFreeShippingPromotionActive && (
    settings.freeShippingPromoType === 'all' || subtotal >= settings.freeShippingThreshold
  );

  const shippingCost = items.length === 0 ? 0 : (isFreeShipping ? 0 : regionRate.price);
  const total = subtotal + shippingCost;

  // Deposit Calculation: In 'shipping_fee' mode, the deposit is precisely the shipping cost according to the province!
  const depositRequired = items.length === 0 ? 0 : (
    settings.depositCalculationMode === 'shipping_fee'
      ? regionRate.price
      : settings.depositType === 'fixed'
        ? Math.min(settings.depositFixedAmount, total)
        : Math.round((total * settings.depositPercentage) / 100)
  );

  const remainingCash = Math.max(0, total - depositRequired);

  // Copy helper
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 8 ميجابايت.');
      return;
    }

    setDepositScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setDepositScreenshotUrl(reader.result as string);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!customerName.trim() || customerName.trim().split(' ').length < 2) {
      setErrorMessage('يرجى كتابة الاسم ثنائياً أو ثلاثياً على الأقل.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage('يرجى إدخال رقم هاتف صحيح مكوّن من 11 رقم.');
      return;
    }

    if (!cityAndArea.trim()) {
      setErrorMessage('يرجى إدخال المركز أو المدينة أو الحي.');
      return;
    }

    if (!detailedAddress.trim()) {
      setErrorMessage('يرجى كتابة العنوان بالتفصيل مع اسم الشارع ورقم العمارة وعلامة مميزة.');
      return;
    }

    if (!depositSenderNumber.trim()) {
      setErrorMessage('يرجى كتابة رقم محفظة فودافون كاش المحول منه العربون لمطابقة التحويل.');
      return;
    }

    if (!depositScreenshotUrl) {
      setErrorMessage('يرجى إرفاق صورة إشعار أو سكرين شوت تحويل فودافون كاش لتأكيد استلام العربون.');
      return;
    }

    setIsSubmitting(true);

    const selectedMethod = settings.paymentMethods.find(m => m.id === selectedMethodId);
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderNumber,
      orderNumber,
      createdAt: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customerName: customerName.trim(),
      phone: phone.trim(),
      phoneSecondary: phoneSecondary.trim() || undefined,
      governorate,
      cityAndArea: cityAndArea.trim(),
      detailedAddress: detailedAddress.trim(),
      notes: notes.trim() || undefined,
      items,
      subtotal,
      shippingCost,
      deliveryTimeEstimate: regionRate.deliveryTime,
      isShippingFree,
      total,
      depositRequired,
      depositPaidReported: depositRequired,
      remainingAmount: remainingCash,
      depositMethod: selectedMethod ? selectedMethod.name : 'تحويل محفظة',
      depositSenderNumber: depositSenderNumber.trim(),
      depositScreenshotUrl,
      status: 'pending'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 600);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-right">
      
      {/* Header & Back */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#18231C]">
            تأكيد الطلب وتحويل العربون
          </h1>
          <p className="text-xs sm:text-sm text-[#716B5E] mt-1">
            يرجى إدخال بيانات التوصيل بدقة وتحويل العربون لبدء تجهيز طلبكِ فوراً
          </p>
        </div>

        <button 
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#524E46] hover:text-[#121316] bg-white px-3.5 py-2 rounded-xl border border-[#E8E1D3] shadow-2xs transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع للمتجر</span>
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left/Middle Column: Customer Form & Deposit Upload */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Customer Info Box */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E1D3] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#121316] text-[#F3E5AB] border border-[#C5A059] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h2 className="font-bold text-base text-[#18231C]">
                  بيانات العميلة وعنوان التوصيل
                </h2>
              </div>

              {/* View rates list button */}
              <button
                type="button"
                onClick={() => setIsRatesModalOpen(true)}
                className="text-xs font-bold text-[#997A2E] hover:underline flex items-center gap-1"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>لائحة أسعار الشحن لكافة المحافظات</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#1F2D24] block mb-1">
                  الاسم بالكامل (ثلاثي) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: مريم أحمد عبد الله"
                    className="w-full pr-9 pl-3 py-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs sm:text-sm text-[#1F2D24] focus:outline-none focus:border-[#C5A059]"
                  />
                  <User className="w-4 h-4 text-[#9C9484] absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F2D24] block mb-1">
                  رقم الهاتف الأساسي (11 رقم) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full pr-9 pl-3 py-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs sm:text-sm text-[#1F2D24] focus:outline-none focus:border-[#C5A059]"
                  />
                  <Phone className="w-4 h-4 text-[#9C9484] absolute right-3 top-3" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#1F2D24] block mb-1">
                  رقم هاتف بديل أو واتساب (اختياري)
                </label>
                <input
                  type="tel"
                  value={phoneSecondary}
                  onChange={(e) => setPhoneSecondary(e.target.value)}
                  placeholder="011xxxxxxxx"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs sm:text-sm text-[#1F2D24] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F2D24] block mb-1">
                  المحافظة والمنطقة <span className="text-red-500">*</span>
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs sm:text-sm text-[#1F2D24] font-bold focus:outline-none focus:border-[#C5A059]"
                >
                  {DETAILED_EGYPT_REGIONS.map((reg) => (
                    <option key={reg.name} value={reg.name}>
                      {reg.name} — ({reg.price} ج.م | {reg.time})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Regional shipping & deposit alert badge */}
            <div className="bg-[#FAF6ED] p-3 rounded-xl border border-[#E9DECA] text-xs text-[#524E46] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#997A2E] shrink-0" />
                <span>
                  تكلفة الشحن والتوصيل لـ <strong className="text-[#18231C]">{governorate}</strong>: 
                  <span className="font-bold text-[#997A2E] mx-1">{regionRate.price} ج.م</span>
                  ({regionRate.deliveryTime})
                </span>
              </div>
              <span className="text-[10px] bg-white border border-[#DDD3BF] px-2 py-0.5 rounded-md font-semibold text-[#8A7955]">
                وهو العربون المطلوب
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#1F2D24] block mb-1">
                المركز أو المدينة / الحي <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={cityAndArea}
                onChange={(e) => setCityAndArea(e.target.value)}
                placeholder="مثال: محطة الرمل، مدينة نصر، المعادي، المنصورة، طنطا..."
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs sm:text-sm text-[#1F2D24] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1F2D24] block mb-1">
                العنوان بالتفصيل والعلامة المميزة <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
                placeholder="اسم الشارع، رقم العمارة، رقم الشقة أو الطابق، أقرب علامة مميزة (مسجد، صيدلية)..."
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs sm:text-sm text-[#1F2D24] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1F2D24] block mb-1">
                ملاحظات خاصة (الطول، مواعيد الاستلام، إلخ)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: طولي 162 سم وأحب الموديل يكون فضفاض جداً، أو التسليم بعد الظهر..."
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs sm:text-sm text-[#1F2D24] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* Step 2: Deposit Instructions & Screenshot Upload */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E1D3] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#121316] text-[#F3E5AB] border border-[#C5A059] flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="font-bold text-base text-[#18231C]">
                  تحويل العربون وتأكيد الأوردر
                </h2>
              </div>
              <span className="text-xs font-extrabold text-[#997A2E] bg-[#FAF6ED] px-3 py-1 rounded-lg border border-[#E9DECA]">
                العربون المطلوب: {depositRequired} ج.م فقط
              </span>
            </div>

            {/* Explanation box */}
            <div className="bg-[#FAF6ED] p-3.5 rounded-xl border border-[#E9DECA] text-xs text-[#524E46] leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#997A2E] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1F2D24] mb-1">لماذا ندفع عربون؟</p>
                <p>
                  العربون قيمته <strong>({depositRequired} ج.م)</strong> فقط (تكلفة شحن محافظتكِ)، وهو عربون تأكيد جدية الطلب وبدء تجهيز وتفصيل الموديل. 
                  المبلغ المتبقي <strong>({remainingCash} ج.م)</strong> يُدفع باليد كاش للمندوب عند استلام الشحنة أمام باب البيت.
                </p>
              </div>
            </div>

            {/* Payment Method Details (Vodafone Cash Only) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1F2D24] block">
                  طريقة دفع العربون (مصاريف الشحن):
                </label>
                <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                  فودافون كاش حصراً
                </span>
              </div>

              {/* Dedicated Vodafone Cash Payment Box */}
              <div className="bg-gradient-to-br from-[#FAF6ED] to-white p-4 sm:p-5 rounded-2xl border-2 border-[#C5A059] shadow-gold/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                      VF
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1F2D24] block">
                        فودافون كاش خدمة العملاء الرسمية
                      </span>
                      <span className="text-lg font-bold text-[#121316] font-mono tracking-wider dir-ltr inline-block">
                        {settings.contactPhone || '01033277866'}
                      </span>
                      <span className="text-[11px] text-[#8A7955] block">
                        (خدمة عملاء آل جابر للزي الشرعي)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(settings.contactPhone || '01033277866', 'vodafone')}
                    className="self-start sm:self-center flex items-center gap-1.5 px-4 py-2 bg-[#121316] hover:bg-black text-[#F3E5AB] border border-[#C5A059] rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    {copiedId === 'vodafone' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>تم نسخ الرقم!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#DFBD69]" />
                        <span>نسخ رقم فودافون كاش</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-3 border-t border-[#EAE3D5] text-xs text-[#524E46] leading-relaxed space-y-1">
                  <p className="font-semibold text-[#1F2D24]">
                    📱 كود التحويل السريع من خط فودافون:
                  </p>
                  <p className="font-mono bg-white p-2 rounded-lg border border-[#E0D7C4] text-[#121316] text-xs dir-ltr inline-block font-bold">
                    *9*7*{settings.contactPhone || '01033277866'}*{depositRequired}#
                  </p>
                  <p className="text-[11px] text-[#716B5E] pt-1">
                    أو عبر تطبيق «أنا فودافون» (Ana Vodafone) - خدمات فودافون كاش - تحويل أموال إلى رقم خدمة العملاء {settings.contactPhone || '01033277866'}.
                  </p>
                </div>
              </div>
            </div>

            {/* Input: Depositor Phone/Account Number */}
            <div>
              <label className="text-xs font-bold text-[#1F2D24] block mb-1">
                رقم محفظة فودافون كاش المحول منه العربون <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={depositSenderNumber}
                onChange={(e) => setDepositSenderNumber(e.target.value)}
                placeholder="مثال: رقم محفظتك 010xxxxxxxx"
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl text-xs sm:text-sm text-[#1F2D24] focus:outline-none focus:border-[#C5A059]"
              />
              <span className="text-[11px] text-[#8C8578] block mt-1">
                إلزامي لمطابقة إشعار التحويل وتأكيد استلام العربون فوراً
              </span>
            </div>

            {/* Mandatory Screenshot Upload */}
            <div>
              <label className="text-xs font-bold text-[#1F2D24] block mb-1">
                إرفاق صورة إشعار التحويل (سكرين شوت التحويل) <span className="text-red-500">*</span>
              </label>

              {depositScreenshotUrl ? (
                <div className="relative border-2 border-emerald-500 rounded-2xl p-3 bg-emerald-50/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={depositScreenshotUrl} 
                      alt="إشعار التحويل" 
                      className="w-16 h-16 object-cover rounded-xl border border-emerald-300"
                    />
                    <div>
                      <p className="text-xs font-bold text-emerald-900 truncate max-w-xs">
                        {depositScreenshotName || 'تم رفع سكرين شوت التحويل بنجاح'}
                      </p>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        جاهز للمراجعة من إدارة آل جابر
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDepositScreenshotUrl('');
                      setDepositScreenshotName('');
                    }}
                    className="text-xs text-red-600 hover:underline font-bold px-2 py-1"
                  >
                    تغيير الصورة
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[#C5A059]/60 hover:border-[#997A2E] rounded-2xl p-6 text-center cursor-pointer bg-[#FAF8F5] hover:bg-[#FAF6ED] transition-all block">
                  <Upload className="w-8 h-8 text-[#997A2E] mx-auto mb-2" />
                  <span className="text-xs font-bold text-[#1F2D24] block">
                    انقري هنا لرفع صورة سكرين شوت بنجاح التحويل
                  </span>
                  <span className="text-[11px] text-[#787267] block mt-1">
                    يدعم صور JPG أو PNG أو لقطة شاشة الهاتف
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#C5A059] to-[#DFBD69] hover:from-[#DFBD69] hover:to-[#F3E5AB] text-[#121316] rounded-2xl font-bold text-base shadow-gold hover:shadow-gold-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>جاري تسجيل طلبكِ...</span>
            ) : (
              <>
                <Check className="w-5 h-5 text-[#121316]" />
                <span>تأكيد الأوردر وإرسال إشعار العربون</span>
              </>
            )}
          </button>

        </div>

        {/* Right Column: Order Summary Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E1D3] shadow-xs sticky top-28 space-y-4">
            <h3 className="font-serif font-bold text-base text-[#18231C] pb-3 border-b border-[#F0ECE1]">
              ملخص المشتريات ({items.length} قطع)
            </h3>

            {/* Items mini list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center justify-between py-1 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={item.product.imageUrl} 
                      alt="" 
                      className="w-10 h-12 rounded-lg object-cover bg-[#F0ECE1] shrink-0" 
                    />
                    <div className="truncate">
                      <p className="font-bold text-[#1F2D24] truncate">{item.product.name}</p>
                      <p className="text-[11px] text-[#716B5E]">
                        {item.selectedColor.name} | {item.selectedSize} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-[#997A2E] shrink-0">
                    {item.product.price * item.quantity} ج.م
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="pt-3 border-t border-[#F0ECE1] space-y-2 text-xs text-[#615C52]">
              <div className="flex justify-between">
                <span>إجمالي المنتجات:</span>
                <span className="font-bold text-[#1F2D24]">{subtotal} ج.م</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#997A2E]" />
                  <span>الشحن إلى {governorate}:</span>
                </span>
                <span>
                  {shippingCost === 0 ? (
                    <strong className="text-emerald-700 font-bold">مجاني (عرض خاص ✨)</strong>
                  ) : (
                    <strong className="text-[#1F2D24]">{shippingCost} ج.م</strong>
                  )}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-[#F0ECE1] text-sm font-bold text-[#1F2D24]">
                <span>إجمالي الطلب الكلي:</span>
                <span className="text-base text-[#121316]">{total} ج.م</span>
              </div>
            </div>

            {/* Deposit Highlighting */}
            <div className="bg-[#FAF6ED] p-4 rounded-xl border border-[#E9DECA] space-y-2 text-xs">
              <div className="flex justify-between items-center font-bold">
                <span className="text-[#121316]">العربون المحول الآن:</span>
                <span className="text-base font-extrabold text-[#997A2E]">{depositRequired} ج.م</span>
              </div>
              <div className="flex justify-between items-center text-[#787267] pt-1 border-t border-[#E9DECA]/60">
                <span>المتبقي عند الاستلام:</span>
                <span className="font-bold text-[#1F2D24]">{remainingCash} ج.م كاش</span>
              </div>
            </div>

            {/* Trust badge */}
            <div className="pt-2 text-[11px] text-[#787267] text-center leading-relaxed">
              🔒 يضمن متجر آل جابر سلامة الأقمشة ودقة المقاسات، ويتم فحص ومراجعة سكرين شوت التحويل وتأكيد شحن طلبكِ عبر رسالة واتساب خلال دقائق.
            </div>

          </div>
        </div>

      </form>

      {/* Official Shipping & Deposit Rates Modal */}
      {isRatesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto text-right space-y-5 border border-[#E8E1D3] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#997A2E]" />
                <h3 className="font-serif font-bold text-lg text-[#18231C]">
                  قائمة أسعار الشحن والعربون ومواعيد التسليم
                </h3>
              </div>
              <button
                onClick={() => setIsRatesModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#FAF6ED] p-3.5 rounded-2xl border border-[#E9DECA] text-xs text-[#524E46] leading-relaxed">
              💡 <strong>تنبيه للأخوات:</strong> قيمة الشحن المحددة لمحافظتكِ هي ذاتها قيمة العربون المطلوب تحويله لتأكيد الأوردر، وباقي الحساب يُدفع كاش باليد للمندوب عند الاستلام.
            </div>

            <div className="divide-y divide-[#F0ECE1] border border-[#E8E1D3] rounded-2xl overflow-hidden">
              {settings.provinceRates.map((rate) => (
                <div key={rate.id} className="p-4 bg-white hover:bg-[#FAF8F5] transition-colors space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#18231C]">{rate.regionName}</span>
                    <span className="font-bold text-sm text-[#997A2E] font-mono">
                      {rate.price} ج.م
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#716B5E]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#997A2E]" />
                      <span>{rate.deliveryTime}</span>
                    </span>
                    {rate.maxWeightAllowedKg && (
                      <span>حتى {rate.maxWeightAllowedKg} كجم (إضافي {rate.extraKgPrice} ج.م/كجم)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsRatesModalOpen(false)}
                className="px-6 py-2.5 bg-[#121316] text-[#F3E5AB] border border-[#C5A059] rounded-xl text-xs font-bold shadow-gold"
              >
                إغلاق القائمة
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;