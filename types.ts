/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

export type ProductCategory = 
  | 'all'
  | 'ednaa'       // إدناءات
  | 'isdal'       // إسدالات
  | 'niqab'       // نقابات
  | 'khimar'      // خمار
  | 'dress'       // دريسات شرعية
  | 'accessories'; // معاصم وإكسسوارات

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: 'ednaa' | 'isdal' | 'niqab' | 'khimar' | 'dress' | 'accessories';
  price: number;              // السعر بعد الخصم (أو السعر الحالي)
  originalPrice?: number;     // السعر الأصلي قبل الخصم (في حال وجود عرض)
  isOnSale?: boolean;         // هل عليه عرض حالياً؟
  saleTag?: string;           // مثل "عرض خاص", "خصم 25%", "الأكثر مبيعاً"
  description: string;
  fabric: string;             // نوع القماش: كريب رويال، كريب سعودي، سي واي، إلخ
  features: string[];         // مميزات الموديل (سحاب للرضاعة، فضفاض وساتر، أكمام مطاط، إلخ)
  colors: { name: string; hex: string }[];
  sizes: string[];            // مثل: ون سايز (One Size), M, L, XL, XXL, أو طول 155, 160, 165
  imageUrl: string;
  gallery: string[];
  inStock: boolean;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  id: string; // unique item instance id
  product: Product;
  quantity: number;
  selectedColor: { name: string; hex: string };
  selectedSize: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verified: boolean;
}

export type OrderStatus = 
  | 'pending'            // بانتظار مراجعة العربون
  | 'deposit_confirmed'  // تم تأكيد العربون
  | 'processing'         // جاري تفصيل وتجهيز الموديل
  | 'shipped'            // تم تسليم الشحنة للمندوب
  | 'delivered'          // تم الاستلام بنجاح
  | 'cancelled';         // ملغي

export interface Order {
  id: string;                  // مثل ORD-8472
  orderNumber: string;
  createdAt: string;
  
  // بيانات العميل
  customerName: string;
  phone: string;
  phoneSecondary?: string;
  governorate: string;         // المحافظة
  cityAndArea: string;         // المركز / المنطقة
  detailedAddress: string;     // العنوان بالتفصيل والعلامة المميزة
  notes?: string;              // مقاسات خاصة، طول العميل، أو ملاحظات
  
  // عناصر الطلب
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  deliveryTimeEstimate?: string; // مثلاً "خلال 36 ساعة"
  isShippingFree: boolean;
  total: number;
  
  // تفاصيل العربون
  depositRequired: number;     // قيمة العربون المحسوبة
  depositPaidReported: number; // العربون المحول
  remainingAmount: number;     // المبلغ المتبقي عند الاستلام كاش
  depositMethod: string;       // فودافون كاش، إنستاباي، محفظة إلكترونية
  depositSenderNumber: string; // الرقم أو الحساب المحول منه
  depositScreenshotUrl: string;// صورة إيصال التحويل
  
  // حالة الطلب
  status: OrderStatus;
  adminNotes?: string;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;               // إنستاباي، فودافون كاش، محفظة أورنج، اتصالات كاش
  number: string;             // رقم الهاتف أو معرف إنستاباي IPA
  accountName: string;        // اسم صاحب الحساب
  iconType: 'vodafone' | 'instapay' | 'wallet' | 'bank';
  instructions: string;       // تعليمات التحويل
}

export interface SiteImagesConfig {
  logoUrl: string;
  heroBannerUrl: string;
  heroBannerBadge?: string;           // الشارة العلوية، مثل: أناقة الالتزام.. وجمال التراث
  heroBannerTitle?: string;           // العنوان الرئيسي الأول، مثل: آل جابر للزي الشرعي
  heroBannerHeadlineAccent?: string;  // العنوان الثانوي الملون، مثل: للزِّيِّ الشَّرْعِيِّ الفَاخِر
  heroBannerSubtitle?: string;        // الوصف الترويجي والتفصيلي
  heroBannerCardTag?: string;         // الشارة على كارت الصورة، مثل: مجموعة 2026
  heroBannerPrimaryBtnText?: string;  // نص الزر الرئيسي، مثل: تصفح أحدث الموديلات
  heroBannerSecondaryBtnText?: string;// نص الزر الثانوي، مثل: عروض الموديلات والتخفيضات 🔥
  heroBannerFeature1?: string;        // ميزة 1، مثل: كريب رويال نخب أول
  heroBannerFeature2?: string;        // ميزة 2، مثل: شحن لجميع المحافظات
  heroBannerFeature3?: string;        // ميزة 3، مثل: عربون ميسر والباقي كاش
  
  // بانر العروض والتخفيضات (Offer Banner)
  promoBannerUrl: string;
  promoBannerBadge?: string;          // مثل: عرض موسمي مميز
  promoBannerTitle?: string;          // مثل: عروض حصرية على الإدناءات والخمارات الملكية
  promoBannerSubtitle?: string;       // مثل: تخفيضات تصل إلى 25% مع شحن مجاني لكافة المحافظات
  promoBannerBtnText?: string;        // مثل: تسوقي العروض الآن
  
  // شريط الإعلانات والشحن العلوي
  topBarAnnouncementText?: string;
  
  // صورة قسم عن آل جابر
  aboutImageUrl: string;
}

export interface ProvinceShippingRate {
  id: string;
  regionName: string;          // مثل: "الاسكندرية وسط البلد" أو "القاهره - الجيزة"
  governorates: string[];      // أسماء المحافظات والمناطق المرتبطة
  price: number;               // سعر الشحن (وهو العربون المطلوب)
  deliveryTime: string;        // ميعاد التسليم: 36 ساعة أو 48 ساعة
  maxWeightAllowedKg?: number; // الكيلو جرامات المسموح بها
  extraKgPrice?: number;       // سعر الكيلو جرام الإضافي
}

export interface StoreSettings {
  brandName: string;
  brandSlogan: string;
  adminPassword: string;       // omar777 (confidential)
  contactPhone: string;
  whatsappNumber: string;
  
  // صور وبانرات المتجر
  siteImages: SiteImagesConfig;

  // إعدادات العربون
  depositCalculationMode: 'shipping_fee' | 'fixed' | 'percentage'; // 'shipping_fee' = العربون هو نفسه قيمة مصاريف الشحن حسب المحافظة!
  depositType: 'fixed' | 'percentage';
  depositFixedAmount: number;    // مثلاً 100 ج.م
  depositPercentage: number;     // مثلاً 25%
  minDepositAmount: number;      // الحد الأدنى مثلاً 50 ج.م
  
  // إعدادات الشحن والعروض وقائمة أسعار المحافظات
  shippingCostDefault: number;   // سعر الشحن الافتراضي (مثلاً 55 ج.م)
  isFreeShippingPromotionActive: boolean; // هل يوجد عرض شحن مجاني مفعل؟
  freeShippingPromoType: 'all' | 'threshold'; // مجاني للكل أو فوق مبلغ معين
  freeShippingThreshold: number; // المبلغ المطلوب للشحن المجاني (مثلاً 750 ج.م)
  shippingPromotionBannerText: string; // النص التسويقي في الشريط العلوي
  
  // قائمة أسعار الشحن والعربون حسب المحافظات الرسمية
  provinceRates: ProvinceShippingRate[];

  // حسابات التحويل
  paymentMethods: PaymentMethodConfig[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface SiteVisitor {
  id: string;
  name: string;
  firstVisitAt: string;          // وقت وتاريخ التسجيل والزيارة
  lastVisitAt: string;           // آخر نشاط أو زيارة
  visitCount: number;            // عدد مرات دخول الموقع
  deviceInfo?: string;           // هاتف محمول / كمبيوتر مكتبي / جهاز لوحي
  status?: 'active' | 'registered';
  notes?: string;                // ملاحظات الإدارة
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'product'; product: Product }
  | { type: 'checkout' }
  | { type: 'order_success'; order: Order }
  | { type: 'admin' };
