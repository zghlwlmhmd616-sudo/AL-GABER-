/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Product, StoreSettings, Review, ProductCategory, SiteVisitor } from './types';

export const BRAND_NAME = 'آل جابر للزي الشرعي';
export const BRAND_TAGLINE = 'أناقة الالتزام.. وجمال التراث';

export const DEFAULT_PROVINCE_RATES = [
  {
    id: 'alex-center',
    regionName: 'الاسكندرية وسط البلد',
    governorates: ['الإسكندرية (وسط البلد ومحطة الرمل وسيدي جابر)'],
    price: 55,
    deliveryTime: 'خلال 36 ساعة',
    maxWeightAllowedKg: 3,
    extraKgPrice: 5
  },
  {
    id: 'alex-west-east',
    regionName: 'العجمي - العامريه - ابو قير',
    governorates: ['الإسكندرية (العجمي / العامرية / أبو قير)'],
    price: 70,
    deliveryTime: 'خلال 36 ساعة',
    maxWeightAllowedKg: 1,
    extraKgPrice: 5
  },
  {
    id: 'alex-borg',
    regionName: 'البرج الاسكندرية',
    governorates: ['الإسكندرية (برج العرب)'],
    price: 80,
    deliveryTime: 'خلال 36 ساعة',
    maxWeightAllowedKg: 1,
    extraKgPrice: 5
  },
  {
    id: 'cairo-giza',
    regionName: 'القاهره - الجيزة',
    governorates: ['القاهرة', 'الجيزة'],
    price: 90,
    deliveryTime: 'خلال 36 ساعة',
    maxWeightAllowedKg: 1,
    extraKgPrice: 5
  },
  {
    id: 'delta-canal',
    regionName: 'البحيره - الدلتا - وجه بحري - القنال',
    governorates: [
      'البحيرة',
      'الدقهلية (المنصورة)',
      'الغربية (طنطا والمحلة)',
      'الشرقية (الزقازيق)',
      'المنوفية',
      'القليوبية',
      'كفر الشيخ',
      'دمياط',
      'بورسعيد',
      'الإسماعيلية',
      'السويس'
    ],
    price: 100,
    deliveryTime: 'خلال 36 ساعة',
    maxWeightAllowedKg: 1,
    extraKgPrice: 8
  },
  {
    id: 'upper-egypt',
    regionName: 'الفيوم - بني سويف - اسيوط - المنيا - سوهاج - قنا - الاقصر - اسوان- البحر الاحمر',
    governorates: [
      'الفيوم',
      'بني سويف',
      'المنيا',
      'أسيوط',
      'سوهاج',
      'قنا',
      'الأقصر',
      'أسوان',
      'البحر الأحمر (الغردقة)'
    ],
    price: 120,
    deliveryTime: 'خلال 48 ساعة',
    maxWeightAllowedKg: 1,
    extraKgPrice: 10
  },
  {
    id: 'border-zones',
    regionName: 'جنوب سيناء - الوادي الجديد- مطروح',
    governorates: [
      'مطروح والساحل الشمالي',
      'جنوب سيناء (شرم الشيخ)',
      'شمال سيناء',
      'الوادي الجديد'
    ],
    price: 170,
    deliveryTime: 'خلال 48 ساعة',
    maxWeightAllowedKg: 1,
    extraKgPrice: 14
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  brandName: 'آل جابر للزي الشرعي',
  brandSlogan: 'أناقة الالتزام.. وجمال التراث',
  adminPassword: 'omar777',
  contactPhone: '01033277866',
  whatsappNumber: '201033277866',
  
  siteImages: {
    logoUrl: '/logo.jpg',
    heroBannerUrl: '/banner.jpg',
    heroBannerBadge: 'أناقة الالتزام.. وجمال التراث',
    heroBannerTitle: 'آل جابر للزي الشرعي',
    heroBannerHeadlineAccent: 'للزِّيِّ الشَّرْعِيِّ الفَاخِر',
    heroBannerSubtitle: 'تشكيلة الزي الشرعي الفاخر بنقاء الخامات وعفة التصميم. نوفر لكِ كل ما تحتاجينه للالتزام بالحجاب الشرعي الفضفاض: إدناءات قطعتين وقطعة واحدة، إسدالات صلاة وخروج، نقابات كورية مريحة للتنفس، خمارات فرنسية، ودريسات سابغة بأجود خامات الكريب والقطن.',
    heroBannerCardTag: 'مجموعة 2026',
    heroBannerPrimaryBtnText: 'تصفح أحدث الموديلات',
    heroBannerSecondaryBtnText: 'عروض الموديلات والتخفيضات 🔥',
    heroBannerFeature1: 'كريب رويال نخب أول',
    heroBannerFeature2: 'عروض شحن مجاني',
    heroBannerFeature3: 'عربون ميسر والباقي كاش',
    
    // بانر العروض
    promoBannerUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200',
    promoBannerBadge: 'عرض موسمي مميز',
    promoBannerTitle: 'عروض حصرية على الإدناءات والخمارات الملكية',
    promoBannerSubtitle: 'خصومات تصل إلى 25% مع شحن مجاني لكافة المحافظات للطلبات المؤهلة',
    promoBannerBtnText: 'تسوقي العروض الآن',
    
    // إعلان الشريط العلوي
    topBarAnnouncementText: '✨ عرض حصري من آل جابر: شحن مجاني للطلبات بقيمة 750 ج.م فأكثر + هدية معصم قطني مع كل إدناء!',

    aboutImageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=900'
  },

  // نظام حساب العربون: مصاريف الشحن حسب المحافظة تمثل قيمة العربون الإلزامي
  depositCalculationMode: 'shipping_fee',
  depositType: 'fixed',
  depositFixedAmount: 90,
  depositPercentage: 20,
  minDepositAmount: 55,
  
  shippingCostDefault: 90,
  isFreeShippingPromotionActive: true,
  freeShippingPromoType: 'threshold',
  freeShippingThreshold: 750,
  shippingPromotionBannerText: '✨ عرض حصري من آل جابر: شحن مجاني للطلبات بقيمة 750 ج.م فأكثر + هدية معصم قطني مع كل إدناء!',
  
  provinceRates: DEFAULT_PROVINCE_RATES,

  paymentMethods: [
    {
      id: 'vodafone_cash',
      name: 'فودافون كاش (Vodafone Cash) حصراً',
      number: '01033277866',
      accountName: 'خدمة عملاء آل جابر (فودافون كاش)',
      iconType: 'vodafone',
      instructions: 'حول قيمة العربون (مصاريف الشحن) مباشرة عبر محفظة فودافون كاش إلى رقم خدمة العملاء 01033277866 (عبر كود *9*7*01033277866*المبلغ# أو تطبيق أنا فودافون)، ثم أدخل رقم محفظتك التي حولت منها وارفع صورة إشعار التحويل (سكرين شوت).'
    }
  ]
};

export const INITIAL_VISITORS: SiteVisitor[] = [
  {
    id: 'vis-101',
    name: 'أم عبد الرحمن الشافعي',
    firstVisitAt: 'اليوم، 11:20 ص',
    lastVisitAt: 'اليوم، 01:45 م',
    visitCount: 3,
    deviceInfo: 'هاتف محمول (Android)',
    status: 'active',
    notes: 'تصفحت تشكيلة الإدناءات الفرنسية وأضافت إلى السلة'
  },
  {
    id: 'vis-102',
    name: 'فاطمة الزهراء أحمد',
    firstVisitAt: 'اليوم، 10:05 ص',
    lastVisitAt: 'اليوم، 12:30 م',
    visitCount: 2,
    deviceInfo: 'هاتف آيفون (iOS)',
    status: 'registered',
    notes: 'قامت بإتمام أوردر رقم ORD-1092 ودفع العربون فودافون كاش'
  },
  {
    id: 'vis-103',
    name: 'أسماء محمود حسني',
    firstVisitAt: 'أمس، 08:15 م',
    lastVisitAt: 'أمس، 09:10 م',
    visitCount: 1,
    deviceInfo: 'كمبيوتر مكتبي (Windows)',
    status: 'registered',
    notes: 'استفسرت عبر بوت عمر عن تفاصيل خامة الكريب الرويال'
  },
  {
    id: 'vis-104',
    name: 'أم حبيبة السعيد',
    firstVisitAt: 'أمس، 04:30 م',
    lastVisitAt: 'أمس، 05:15 م',
    visitCount: 4,
    deviceInfo: 'هاتف محمول (Android)',
    status: 'registered',
    notes: 'زائرة متكررة تتابع أحدث عروض الشحن المجاني'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'ednaa-french-royal',
    name: 'إدناء فرنسي قطعتين كريب رويال فاخر',
    tagline: 'الأكثر طلباً ووقاراً بخامة ملكية سابغة',
    category: 'ednaa',
    price: 680,
    originalPrice: 850,
    isOnSale: true,
    saleTag: 'عرض خاص - خصم 20%',
    fabric: 'كريب رويال سعودي كوري نخب أول (غير شفاف، انسيابي، مريح)',
    description: 'إدناء فرنسي قطعتين راقي جداً يتكون من خمار سابغ بكاب وأزرار للأكمام، مع جيبة كلوش واسعة ومريحة بحزام مطاطي ناعم لا يشف ولا يصف.',
    features: [
      'قماش كريب رويال ملكي فائق السقوط',
      'خمار فرنسي طويل ساتر جداً مع فتحة وجه مريحة',
      'أكمام مزودة بأزرار كبسولة أنيقة لسهولة الوضوء',
      'جيبة واسعة كلوش بجيوب جانبية مخفية',
      'مناسب لجميع فصول السنة ولا يتجعد بسهولة'
    ],
    colors: [
      { name: 'أسود فحمي ملكي', hex: '#111111' },
      { name: 'كحلي ليلي', hex: '#1E293B' },
      { name: 'زيتي غامق وقور', hex: '#2D3A2F' },
      { name: 'كشمير ترابي هادئ', hex: '#7A6263' },
      { name: 'بني شوكولاتة داكن', hex: '#3E2723' }
    ],
    sizes: ['مقاس 1 (طول 155-162 سم)', 'مقاس 2 (طول 163-170 سم)', 'مقاس 3 (طول 170+ سم)'],
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=900'
    ],
    inStock: true,
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: 'ednaa-one-piece-salma',
    name: 'إدناء قطعة واحدة سابغ بمعاصم ليكرا',
    tagline: 'راحة فائقة وسرعة في الارتداء لكل يوم',
    category: 'ednaa',
    price: 590,
    originalPrice: 690,
    isOnSale: true,
    saleTag: 'الأكثر مبيعاً',
    fabric: 'كريب كوري بارد مع معاصم قطنية تركية',
    description: 'موديل إدناء قطعة واحدة واسع جداً من أعلى الرأس حتى القدم، مزود بسحاب سحري للرضاعة ومعاصم ليكرا قطنية ناعمة تثبت على اليدين بدون شد.',
    features: [
      'قطعة واحدة واسعة تغنيك عن أي طبقات إضافية',
      'سوستة سحرية مخفية تسهل الرضاعة',
      'معاصم قطن ليكرا ناعمة لا تتمدد مع الغسيل',
      'رباط داخلي لتثبيت الخمار بدقة دون انزلاق',
      'خامة صيفية باردة تسمح بمرور الهواء'
    ],
    colors: [
      { name: 'أسود فاحم', hex: '#141414' },
      { name: 'رمادي غامق أنيق', hex: '#4B5563' },
      { name: 'كافيه دافئ', hex: '#6B5748' },
      { name: 'أخضر زمردي داكن', hex: '#133E33' }
    ],
    sizes: ['فري سايز (طول 155-165 سم)', 'فري سايز طويل (طول 165-175 سم)'],
    imageUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=900'
    ],
    inStock: true,
    rating: 4.8,
    reviewsCount: 24
  },
  {
    id: 'isdal-salat-cotton-pure',
    name: 'إسدال صلاة قطن بيور مع طرحة متصلة وسوستة',
    tagline: 'نعومة القطن الطبيعي لخشوع وراحة تامة',
    category: 'isdal',
    price: 380,
    originalPrice: 450,
    isOnSale: false,
    saleTag: 'خامة قطنية 100%',
    fabric: 'قطن مصري ممتاز ممشوق معالج ضد الانكماش',
    description: 'إسدال صلاة وخروج منزلي واستقبال مريح وبارد، بطرحة طويلة متصلة تلف مرتين لتغطية كاملة، وسوستة أمامية عملية مع أكمام مطاطية ناعمة.',
    features: [
      'خامة قطن صافي باردة جداً في الصيف ودافئة في الشتاء',
      'طرحة عريضة وطويلة متصلة لا تسقط أثناء السجود',
      'سوستة أمامية طويلة لسهولة اللبس والخلع',
      'ألوان ونقوش هادئة مريحة للعين',
      'غسيل آلي دون وبر أو بهتان في اللون'
    ],
    colors: [
      { name: 'أبيض عاجي هادئ', hex: '#F3EFE6' },
      { name: 'وردي بودري ناعم', hex: '#DDB7AB' },
      { name: 'أزرق سماوي باهت', hex: '#8FA9BA' },
      { name: 'لافندر هادئ', hex: '#A399B2' },
      { name: 'أسود سادة', hex: '#1C1917' }
    ],
    sizes: ['مقاس قياسي مريح (حتى وزن 85 كجم)', 'مقاس جامبو واسع (حتى وزن 120 كجم)'],
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=900'
    ],
    inStock: true,
    rating: 5.0,
    reviewsCount: 42
  },
  {
    id: 'isdal-khurooj-soiree-cy',
    name: 'إسدال خروج ملكي كريب سي واي مطرز ناعم',
    tagline: 'شياكة الخروج بوقار الزي الشرعي التام',
    category: 'isdal',
    price: 520,
    originalPrice: 650,
    isOnSale: true,
    saleTag: 'تخفيض 20%',
    fabric: 'كريب سي واي هندي فخم برعشة حريرية',
    description: 'إسدال خروج فائق الأناقة مناسب للمشاوير والزيارات العائلية، بتطريز كمبيوتر دقيق جداً على الأساور مع قصة كلوش ملكية تمنحك فخامة وحشمة كاملة.',
    features: [
      'خامة كريب سي واي ممتازة لا تلتصق بالجسم',
      'تطريز إسلامي راقي بدرجة لون القماش',
      'طرحة واسعة متناسقة مع الإسدال',
      'سحاب أمامي مخفي وجيوب جانبية',
      'لا يحتاج لكوي متكرر بعد الغسيل'
    ],
    colors: [
      { name: 'أسود مطرز', hex: '#18181B' },
      { name: 'كحلي ملكي', hex: '#1E3A5F' },
      { name: 'بترولي داكن', hex: '#164E63' },
      { name: 'مارون نبيتي هادئ', hex: '#4A1525' }
    ],
    sizes: ['مقاس 1 (طول 150-160 سم)', 'مقاس 2 (طول 160-170 سم)'],
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900'
    ],
    inStock: true,
    rating: 4.7,
    reviewsCount: 19
  },
  {
    id: 'niqab-korean-tenda-luxury',
    name: 'نقاب تندة مائلة كوري شيفون إندونيسي أصلي',
    tagline: 'تنفس سهل ورؤية واضحة بدون خنقة أو ضيق',
    category: 'niqab',
    price: 130,
    originalPrice: 160,
    isOnSale: true,
    saleTag: 'عرض نقابين بسعر مميز',
    fabric: 'شيفون حرير إندونيسي كوري معالج فائق النعومة',
    description: 'نقاب تندة مقواة مائلة مريحة للعينين، بطبقة مزدوجة لحجب الملامح تماماً مع نفاذية هواء ممتازة تمنحك تنفساً طبيعياً طوال اليوم ومطاط جانبي مرن.',
    features: [
      'تندة مقواة خفيفة تحجب العينين من الأعلى بدون ضغط',
      'فتحة عين دقيقة ومدروسة بدون حواف خشنة',
      'شيفون إندونيسي أصلي ناعم جداً على البشرة',
      'أربطة قوية لا تنفك مع الحركة',
      'متوفر بطول متوسط أو طويل حسب الرغبة'
    ],
    colors: [
      { name: 'أسود سواد الليل', hex: '#0B0B0B' },
      { name: 'كحلي داكن', hex: '#0F172A' },
      { name: 'بني شوكولاتي سادة', hex: '#2E1A11' }
    ],
    sizes: ['طول متوسط (45 سم)', 'طول سابغ طويل (55 سم)'],
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=900'
    ],
    inStock: true,
    rating: 4.95,
    reviewsCount: 65
  },
  {
    id: 'niqab-malaysian-layers',
    name: 'نقاب ماليزي كلوش 3 طبقات بشريط كبسولة',
    tagline: 'خفة وسواد داكن مع تغطية خلفية وأمامية كاملة',
    category: 'niqab',
    price: 190,
    originalPrice: 240,
    isOnSale: true,
    saleTag: 'موديل فاخر',
    fabric: 'شيفون جورجيت ملكي مع كريب رقيق',
    description: 'نقاب ماليزي ثلاث طبقات سابغ يمكن إسدال الطبقات للخلف أو للأمام، مع شريط كبسولة معدنية لتعديل المقاس بسهولة، وثبات فائق في أوقات الرياح.',
    features: [
      '3 طبقات متدرجة الطول فخمة وجمالية',
      'ثبات عالي بفضل الأربطة المبطنة والكبسولة',
      'سواد فاحم يطابق درجات كريب العبايات والإدناءات',
      'خفيف الوزن لا يثقل على الرأس أو الرقبة',
      'تشطيب خياطة يدوي متقن'
    ],
    colors: [
      { name: 'أسود غامق', hex: '#0A0A0A' }
    ],
    sizes: ['مقاس موحد سابغ'],
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=900'
    ],
    inStock: true,
    rating: 4.9,
    reviewsCount: 29
  },
  {
    id: 'khimar-french-pointed-royal',
    name: 'خمار فرنسي مثلث طويل كريب رويال',
    tagline: 'القصة الفرنسية الشهيرة بالانسيابية التامة',
    category: 'khimar',
    price: 360,
    originalPrice: 420,
    isOnSale: false,
    saleTag: 'كريب رويال أصلي',
    fabric: 'كريب رويال كوري ناعم وساقط',
    description: 'خمار فرنسي سابغ بقصة مثلثة من الخلف ومستديرة من الأمام، يعطي ستراً كاملاً للكتفين والصدر والظهر مع رباط داخلي وكاب رأس مريح جداً.',
    features: [
      'قصة مثلثة فرنسية تمنح حرية حركة لليدين',
      'كاب أمامي لا يحتاج لبندانة إضافية',
      'ربطة داخلية تمنع انزلاق الخمار نهائياً',
      'قماش معتم ساتر لا يشف ولا يلمع في الشمس',
      'طول يصل لمنتصف الساق من الخلف'
    ],
    colors: [
      { name: 'أسود ملكي', hex: '#111111' },
      { name: 'زيتي غامق', hex: '#263428' },
      { name: 'كحلي ناعم', hex: '#182436' },
      { name: 'كشمير كلاسيك', hex: '#87696B' },
      { name: 'بيج رملي دافئ', hex: '#C2B69D' },
      { name: 'خمري داكن', hex: '#4B1824' }
    ],
    sizes: ['طول 125 سم (أمامي) / 145 سم (خلفي)', 'طول 135 سم (أمامي) / 160 سم (خلفي)'],
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=900'
    ],
    inStock: true,
    rating: 4.88,
    reviewsCount: 51
  },
  {
    id: 'khimar-round-double-layer',
    name: 'خمار دائري دبل كلوش دورين شيفون ملكي',
    tagline: 'رقة وأنوثة محتشمة للمناسبات والأعياد',
    category: 'khimar',
    price: 395,
    originalPrice: 480,
    isOnSale: true,
    saleTag: 'عرض الأعياد',
    fabric: 'شيفون كريب تركي عالي الكثافة دورين',
    description: 'خمار دورين متدرجين بقصة دائرية واسعة وسابغة، غير شفاف بفضل الطبقتين المتقاطعتين، يعطي مظهراً غاية في الرقي للمناسبات والأفراح الشرعية.',
    features: [
      'طبقتان بتدرج أنيق وحواف مبرومة بعناية',
      'غير شفاف إطلاقاً بفضل كثافة النسيج',
      'ثابت على الرأس ولا يحتاج لدبابيس كثيرة',
      'ألوان باستيل وزاهية للمناسبات',
      'خفيف ومهفهف في الحركة'
    ],
    colors: [
      { name: 'أوف وايت عاجي', hex: '#F7F4EB' },
      { name: 'وردي هادئ (بودرة)', hex: '#E2BABA' },
      { name: 'موف رمادي باستيل', hex: '#9E94A8' },
      { name: 'أسود سادة', hex: '#121212' }
    ],
    sizes: ['مقاس موحد سابغ'],
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=900'
    ],
    inStock: true,
    rating: 4.85,
    reviewsCount: 33
  },
  {
    id: 'dress-modest-abaya-butterfly',
    name: 'دريس شرعي عباية فراشة فضفاضة بياقة ملكية',
    tagline: 'وسع رحب وستر متناهي يلائم كل الأوقات',
    category: 'dress',
    price: 740,
    originalPrice: 920,
    isOnSale: true,
    saleTag: 'خصم 20% لفترة محدودة',
    fabric: 'كريب سعودي ثقيل لا يشف ومقاوم للحرارة',
    description: 'دريس عباية فراشة فضفاض جداً بتطريز خفيف على ياقة الرقبة والأساور، مزود بسحاب أمامي طويل وجيوب جانبية خفية وحزام داخلي اختياري لتعديل الوسع الداخلي.',
    features: [
      'قصة الفراشة الساترة جداً التي تخفي تفاصيل الجسم تماماً',
      'سوستة أمامية لسهولة الارتداء والرضاعة',
      'جيوب جانبية عميقة للموبايل والمتعلقات',
      'أكمام بأزرار صدفية راقية لسهولة الوضوء',
      'خامة كريب سعودي شتوية وصيفية ممتازة'
    ],
    colors: [
      { name: 'أسود ملكي فاخر', hex: '#0F0F0F' },
      { name: 'زيتي عسكري وقور', hex: '#2A362C' },
      { name: 'كحلي نيفي أنيق', hex: '#172554' },
      { name: 'رصاصي داكن', hex: '#374151' },
      { name: 'عنابي خمري', hex: '#451A24' }
    ],
    sizes: ['مقاس 54 (طول 150-156 سم)', 'مقاس 56 (طول 157-164 سم)', 'مقاس 58 (طول 165-172 سم)', 'مقاس 60 (طول 173+ سم)'],
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=900'
    ],
    inStock: true,
    rating: 4.92,
    reviewsCount: 47
  },
  {
    id: 'dress-linen-casual-maryam',
    name: 'دريس مريم كاجوال لينين مغسول بأزرار خشبية',
    tagline: 'طبيعي ومريح للجامعة والعمل والمشاوير الصباحية',
    category: 'dress',
    price: 630,
    originalPrice: 750,
    isOnSale: true,
    saleTag: 'جديد الموسم',
    fabric: 'لينين قطن تركي طبيعي مغسول ومريح',
    description: 'دريس كاجوال فضفاض بقصة كلوش ناعمة وأزرار خشبية بيئية راقية على الصدر، واسع جداً ومحتشم ومزود بجيوب جانبية واسعة، مناسب جداً مع الخمار أو الطرحة.',
    features: [
      'خامة لينين تركي ممتازة تسمح بتنفس الجسم',
      'أزرار خشبية أصلية تضفي لمسة كلاسيكية دافئة',
      'أكمام مزمومة باستك ناعم لا يترك علامات على المعصم',
      'واسع وفضفاض ومطابق لشروط الزي الشرعي التام',
      'ألوان صيفية وطبيعية هادئة'
    ],
    colors: [
      { name: 'بيج رملي طبيعي', hex: '#CBBFA8' },
      { name: 'أخضر مريمي (سيج)', hex: '#879782' },
      { name: 'أزرق داكن جينز', hex: '#2C4365' },
      { name: 'أسود كلاسيك', hex: '#1A1A1A' }
    ],
    sizes: ['M (يلبس حتى 70 كجم)', 'L (يلبس حتى 85 كجم)', 'XL (يلبس حتى 100 كجم)', 'XXL (يلبس حتى 120 كجم)'],
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=900'
    ],
    inStock: true,
    rating: 4.78,
    reviewsCount: 22
  },
  {
    id: 'acc-wrist-cuffs-pack',
    name: 'باكدج معاصم يد قطنية ليكرا (3 أزواج)',
    tagline: 'لستر الذراعين وضمان عدم انكشاف المعصم',
    category: 'accessories',
    price: 75,
    originalPrice: 100,
    isOnSale: true,
    saleTag: 'عرض 3 قطع',
    fabric: 'قطن مصري ممشوق 95% + 5% ليكرا مرنة',
    description: 'باكدج 3 أزواج معاصم قطنية متينة وطويلة تثبت بإحكام وتغطي منتصف الذراع، ضرورية لكل أخت لضمان تمام الستر والراحة عند رفع اليدين.',
    features: [
      'طول سابغ يصل حتى قرب الكوع (25 سم)',
      'قطن ناعم ممتص للعرق ولا يسبب أي حكة',
      'ألوان أساسية تناسب جميع العبايات والإدناءات',
      'استك مريح في النهايات لا يضغط بقوة',
      'تغليف أنيق ومحكم'
    ],
    colors: [
      { name: 'مشكل (أسود + أبيض + كحلي)', hex: '#1F2937' },
      { name: '3 أسود', hex: '#0A0A0A' },
      { name: '3 بيج وكافيه', hex: '#C8B29B' }
    ],
    sizes: ['مقاس موحد مطاطي'],
    imageUrl: 'https://images.unsplash.com/photo-1520006403909-838d6b89c284?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1520006403909-838d6b89c284?auto=format&fit=crop&q=80&w=900'
    ],
    inStock: true,
    rating: 4.96,
    reviewsCount: 88
  },
  {
    id: 'acc-magnetic-pins-luxury',
    name: 'دبابيس مغناطيسية تركية فاخرة (طقم 4 ألوان)',
    tagline: 'تثبيت قوي بدون إتلاف أو تخريم قماش الخمار والنقاب',
    category: 'accessories',
    price: 110,
    originalPrice: 140,
    isOnSale: true,
    saleTag: 'مغناطيس نيوديميوم فائق القوة',
    fabric: 'سبيكة معدنية مقاومة للصدأ مع مغناطيس نيوديميوم',
    description: 'وداعاً للدبابيس الإبرية التي تتلف خامة الحرير والكريب، دبابيس مغناطيسية أنيقة جداً بألوان مطفية تثبت طبقات الخمار والنقاب بثبات فائق طوال اليوم.',
    features: [
      'مغناطيس فائق القوة لا ينفصل مع الرياح أو الحركة السريعة',
      'يحافظ على أقمشة الشيفون والكريب والحرير بدون أي ثقوب',
      'طقم يحتوي على 4 ألوان: ذهبي، فضي، أسود، برونزي',
      'خفيف على الحجاب ولا يشد القماش للأسفل',
      'علبة مخملية أنيقة للحفظ'
    ],
    colors: [
      { name: 'طقم ميتاليك كلاسيك (4 قطع)', hex: '#D4AF37' }
    ],
    sizes: ['طقم 4 حبات'],
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=900'
    ],
    inStock: true,
    rating: 4.93,
    reviewsCount: 54
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'ednaa-french-royal',
    productName: 'إدناء فرنسي قطعتين كريب رويال فاخر',
    authorName: 'أم عائشة (القاهرة)',
    rating: 5,
    comment: 'ما شاء الله تبارك الله، الخامات فوق الممتازة وسواد الكريب رويال داكن جداً وساتر وواسع للغاية. التوصيل كان سريعاً والتعامل قمة في الذوق.',
    date: 'منذ يومين',
    verified: true
  },
  {
    id: 'rev-2',
    productId: 'niqab-korean-tenda-luxury',
    productName: 'نقاب تندة مائلة كوري شيفون إندونيسي أصلي',
    authorName: 'فاطمة الزهراء (الإسكندرية)',
    rating: 5,
    comment: 'أول مرة ألبس نقاب ومحسش بخنقة في التنفس! التندة ثابتة وجميلة جداً والفتحة مريحة، طلبت 3 نقابات بعد ما جربت الأولاني.',
    date: 'منذ 4 أيام',
    verified: true
  },
  {
    id: 'rev-3',
    productId: 'dress-modest-abaya-butterfly',
    productName: 'دريس شرعي عباية فراشة فضفاضة بياقة ملكية',
    authorName: 'سارة عبد الرحمن (المنصورة)',
    rating: 5,
    comment: 'دريس الفراشة تحفة ومحتشم جداً، ما شاء الله وسع محترم وسهل في الحركة والوضوء بالأزرار. ربنا يبارك لآل جابر على هذا الاتقان.',
    date: 'منذ أسبوع',
    verified: true
  },
  {
    id: 'rev-4',
    productId: 'isdal-salat-cotton-pure',
    productName: 'إسدال صلاة قطن بيور مع طرحة متصلة وسوستة',
    authorName: 'مريم الأحمد (طنطا)',
    rating: 5,
    comment: 'القطن ناعم وبارد جداً وريحته جميلة، وطرحة الإسدال طويلة وبتغطي كويس جداً. العربون سهل التحويل والموقع منظم ما شاء الله.',
    date: 'منذ أسبوعين',
    verified: true
  }
];

export const CATEGORIES_LIST: { id: ProductCategory; label: string; count?: number }[] = [
  { id: 'all', label: 'كافة الموديلات' },
  { id: 'ednaa', label: 'إدناءات شرعية' },
  { id: 'isdal', label: 'إسدالات صلاة وخروج' },
  { id: 'niqab', label: 'نقابات فاخرة' },
  { id: 'khimar', label: 'خمار فرنسي وكلوش' },
  { id: 'dress', label: 'دريسات وعبايات' },
  { id: 'accessories', label: 'معاصم ومستلزمات' }
];

export const EGYPT_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'القليوبية',
  'الدقهلية',
  'الشرقية',
  'المنوفية',
  'الغربية',
  'البحيرة',
  'كفر الشيخ',
  'دمياط',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'شمال سيناء',
  'جنوب سيناء',
  'مطروح',
  'الوادي الجديد'
];

export const DETAILED_EGYPT_REGIONS = [
  { name: 'الإسكندرية (وسط البلد ومحطة الرمل وسيدي جابر)', rateId: 'alex-center', price: 55, time: 'خلال 36 ساعة' },
  { name: 'الإسكندرية (العجمي - العامرية - أبو قير)', rateId: 'alex-west-east', price: 70, time: 'خلال 36 ساعة' },
  { name: 'الإسكندرية (برج العرب والساحل)', rateId: 'alex-borg', price: 80, time: 'خلال 36 ساعة' },
  { name: 'القاهرة', rateId: 'cairo-giza', price: 90, time: 'خلال 36 ساعة' },
  { name: 'الجيزة', rateId: 'cairo-giza', price: 90, time: 'خلال 36 ساعة' },
  { name: 'القليوبية (شبرا الخيمة وبنها)', rateId: 'delta-canal', price: 100, time: 'خلال 36 ساعة' },
  { name: 'البحيرة (دمنهور وكفر الدوار)', rateId: 'delta-canal', price: 100, time: 'خلال 36 ساعة' },
  { name: 'الدقهلية (المنصورة وميت غمر)', rateId: 'delta-canal', price: 100, time: 'خلال 36 ساعة' },
  { name: 'الغربية (طنطا والمحلة الكبرى)', rateId: 'delta-canal', price: 100, time: 'خلال 36 ساعة' },
  { name: 'الشرقية (الزقازيق والعاشر من رمضان)', rateId: 'delta-canal', price: 100, time: 'خلال 36 ساعة' },
  { name: 'المنوفية (شبين الكوم وقويسنا)', rateId: 'delta-canal', price: 100, time: 'خلال 36 ساعة' },
  { name: 'كفر الشيخ', rateId: 'delta-canal', price: 100, time: 'خلال 36 ساعة' },
  { name: 'دمياط ورأس البر', rateId: 'delta-canal', price: 100, time: 'خلال 36 ساعة' },
  { name: 'بورسعيد', rateId: 'delta-canal', price: 100, time: 'خلال 36 ساعة' },
  { name: 'الإسماعيلية', rateId: 'delta-canal', price: 100, time: 'خلال 36 ساعة' },
  { name: 'السويس', rateId: 'delta-canal', price: 100, time: 'خلال 36 ساعة' },
  { name: 'الفيوم', rateId: 'upper-egypt', price: 120, time: 'خلال 48 ساعة' },
  { name: 'بني سويف', rateId: 'upper-egypt', price: 120, time: 'خلال 48 ساعة' },
  { name: 'المنيا', rateId: 'upper-egypt', price: 120, time: 'خلال 48 ساعة' },
  { name: 'أسيوط', rateId: 'upper-egypt', price: 120, time: 'خلال 48 ساعة' },
  { name: 'سوهاج', rateId: 'upper-egypt', price: 120, time: 'خلال 48 ساعة' },
  { name: 'قنا', rateId: 'upper-egypt', price: 120, time: 'خلال 48 ساعة' },
  { name: 'الأقصر', rateId: 'upper-egypt', price: 120, time: 'خلال 48 ساعة' },
  { name: 'أسوان', rateId: 'upper-egypt', price: 120, time: 'خلال 48 ساعة' },
  { name: 'البحر الأحمر (الغردقة وسفاجا)', rateId: 'upper-egypt', price: 120, time: 'خلال 48 ساعة' },
  { name: 'مطروح والساحل الشمالي والعلمين', rateId: 'border-zones', price: 170, time: 'خلال 48 ساعة' },
  { name: 'جنوب سيناء (شرم الشيخ ودهب ورأس سدر)', rateId: 'border-zones', price: 170, time: 'خلال 48 ساعة' },
  { name: 'شمال سيناء (العريش)', rateId: 'border-zones', price: 170, time: 'خلال 48 ساعة' },
  { name: 'الوادي الجديد (الخارجة والداخلة)', rateId: 'border-zones', price: 170, time: 'خلال 48 ساعة' }
];

export const getGovernorateRate = (govName: string, settings: StoreSettings) => {
  const match = DETAILED_EGYPT_REGIONS.find(r => r.name === govName || govName.includes(r.name) || r.name.includes(govName));
  const rateId = match ? match.rateId : 'cairo-giza';
  const found = (settings.provinceRates || DEFAULT_PROVINCE_RATES).find(r => r.id === rateId);
  return found || (settings.provinceRates || DEFAULT_PROVINCE_RATES)[3];
};