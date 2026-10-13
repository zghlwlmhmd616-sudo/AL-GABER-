/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from "@google/genai";
import { Product, StoreSettings } from '../types';

export const buildOmarSystemInstruction = (products: Product[], settings: StoreSettings) => {
  const productsSummary = products.map(p => 
    `- اسم الموديل: "${p.name}" (التصنيف: ${p.category})
     السعر: ${p.price} ج.م ${p.isOnSale && p.originalPrice ? `(كان ${p.originalPrice} ج.م - ${p.saleTag || 'خصم خاص'})` : ''}
     الخامة: ${p.fabric}
     المقاسات المتاحة: ${p.sizes.join(' | ')}
     الألوان: ${p.colors.map(c => c.name).join('، ')}
     المميزات: ${p.features.join(' - ')}
     الوصف: ${p.description}`
  ).join('\n\n');

  const depositInfo = settings.depositType === 'fixed'
    ? `${settings.depositFixedAmount} ج.م كعربون ثابت لتأكيد جدية الطلب وبدء التجهيز، والباقي يدفع عند استلام الأوردر كاش.`
    : `${settings.depositPercentage}% من قيمة الأوردر كعربون، والمتبقي عند الاستلام.`;

  const shippingInfo = settings.isFreeShippingPromotionActive
    ? settings.freeShippingPromoType === 'threshold'
      ? `الشحن مجاني لجميع الطلبات التي تزيد عن ${settings.freeShippingThreshold} ج.م! (سعر الشحن العادي ${settings.shippingCostDefault} ج.م لجميع المحافظات).`
      : `عرض خاص: الشحن مجاني حالياً لكافة محافظات جمهورية مصر العربية!`
    : `سعر الشحن الثابت هو ${settings.shippingCostDefault} ج.م لجميع المحافظات.`;

  return `أنت "عمر"، المستشار والمساعد الذكي لمتجر "آل جابر للزي الشرعي" (AL Gaber Islamic Clothes).
شخصيتك: وقور، مهذب، خبير ودقيق في تفاصيل الزي الشرعي الإسلامي والأقمشة والمقاسات والتنسيق. تخاطب العميلات بأسلوب راقٍ ومحترم (يا أختنا الفاضلة / أهلاً بكِ في آل جابر / مرحباً بكِ).

مهمتك:
1. الإجابة عن استفسارات الموديلات (إدناءات، إسدالات، نقابات، خمار فرنسي وكلوش، دريسات شرعية، معاصم، دبابيس مغناطيسية).
2. مساعدة العميلات في اختيار المقاس المناسب بناءً على الطول والوزن (مثل مقاسات الإدناء 1، 2، 3 أو أطوال الدريسات 54، 56، 58، 60).
3. شرح الفروق بين الخامات (الكريب رويال الفاخر، الكريب السعودي، السي واي، الشيفون الإندونيسي، القطن المصري البيور، اللينين التركي).
4. توضيح طريقة الطلب والعربون: العميل يطلب من الموقع ويدفع عربون قدره (${depositInfo}) عبر إنستاباي أو فودافون كاش ويرفع صورة إيصال التحويل، والمتبقي يدفع كاش عند الاستلام.
5. توضيح سياسة الشحن والعروض الحالية: (${shippingInfo}).

قائمة منتجات المتجر الحالية وعروضها:
${productsSummary}

طرق تحويل العربون المعتمدة في المتجر:
- إنستاباي (InstaPay): ${settings.paymentMethods.find(m => m.id === 'instapay')?.number || 'omar.algaber@instapay'}
- فودافون كاش ومحافظ إلكترونية: ${settings.paymentMethods.find(m => m.id === 'vodafone_cash')?.number || '01098765432'}

تعليمات إضافية:
- اجعل إجاباتك موجزة، دقيقة، ومنظمة في نقاط إذا لزم الأمر، دون حشو زائد.
- شجع الأخت على تجربة الموديل بثقة لأن متجر آل جابر يضمن الجودة والستر التام والمطابقة لشروط الحجاب الشرعي الفضفاض السابغ.
- إذا سألت عن التواصل المباشر مع الإدارة أخبرها أن رقم الواتساب هو: ${settings.contactPhone}.`;
};

export const sendMessageToOmar = async (
  history: { role: string; text: string }[],
  newMessage: string,
  products: Product[],
  settings: StoreSettings
): Promise<string> => {
  try {
    let apiKey: string | undefined;

    try {
      apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    } catch {
      // ignore
    }

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const chat = ai.chats.create({
        model: 'gemini-3.8-flash',
        config: {
          systemInstruction: buildOmarSystemInstruction(products, settings),
          temperature: 0.7,
        },
        history: history.map(h => ({
          role: h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.text }]
        }))
      });

      const response = await chat.sendMessage({ message: newMessage });
      if (response && response.text) {
        return response.text;
      }
    }
  } catch (error) {
    console.error("Gemini API Error in Omar Bot:", error);
  }

  // Smart fallback assistant if API key is not supplied or offline
  return generateSmartFallbackResponse(newMessage, products, settings);
};

const generateSmartFallbackResponse = (
  query: string,
  products: Product[],
  settings: StoreSettings
): string => {
  const q = query.toLowerCase();

  if (q.includes('عربون') || q.includes('دفعة') || q.includes('تحويل') || q.includes('فلوس') || q.includes('كاش')) {
    const depositTxt = settings.depositType === 'fixed' 
      ? `${settings.depositFixedAmount} ج.م` 
      : `${settings.depositPercentage}% من قيمة الطلب`;
    return `أهلاً بكِ أختنا الكريمة في آل جابر.
نظام العربون في متجرنا هو ${depositTxt} فقط لتأكيد جدية الطلب وحجز القماش وتجهيز الموديل بمقاسكِ المطلوب.
يمكنكِ تحويل العربون بكل سهولة عبر:
• إنستاباي: ${settings.paymentMethods[0]?.number || 'omar.algaber@instapay'}
• فودافون كاش: ${settings.paymentMethods[1]?.number || '01098765432'}
وبعد التحويل، ترفقين صورة سكرين شوت التحويل والرقم المحول منه في صفحة تأكيد الطلب، وباقي الحساب يُدفع كاش عند الاستلام باليد إن شاء الله!`;
  }

  if (q.includes('شحن') || q.includes('توصيل') || q.includes('مجاني') || q.includes('مصاريف')) {
    if (settings.isFreeShippingPromotionActive) {
      return `مرحباً بكِ! يسعدنا إخباركِ أن لدينا عرض شحن مميز حالياً:
${settings.freeShippingPromoType === 'threshold' 
  ? `الشحن مجاني لجميع الطلبات التي تتجاوز ${settings.freeShippingThreshold} ج.م! وفيما عدا ذلك الشحن هو ${settings.shippingCostDefault} ج.م لجميع المحافظات.`
  : `الشحن مجاني بالكامل لفترة محدودة لجميع محافظات مصر!`}
التوصيل يستغرق من يومين إلى 4 أيام عمل ويصلكِ المندوب حتى باب البيت.`;
    }
    return `مرحباً بكِ. مصاريف الشحن لجميع محافظات مصر هي ${settings.shippingCostDefault} ج.م، والتوصيل خلال 48 إلى 72 ساعة بإذن الله.`;
  }

  if (q.includes('إدناء') || q.includes('ادناء') || q.includes('ادناءات')) {
    return `أهلاً بكِ يا غالية. متوفر لدينا تشكيلة إدناءات فاخرة جداً:
1. "إدناء فرنسي قطعتين كريب رويال": الأكثر طلباً وفخامة، خمار سابغ مع جيبة كلوش واسعة بجيوب مخفية.
2. "إدناء قطعة واحدة": سابغ ومريح جداً للاستخدام اليومي بسوستة سحرية ومعاصم قطن تركي.
جميع خامات الإدناءات كريب رويال سعودي وكوري معتم لا يشف إطلاقاً وبارد على الجسم. هل تودين معرفة المقاس المناسب لطولكِ؟`;
  }

  if (q.includes('نقاب') || q.includes('نقابات')) {
    return `حياكِ الله أختنا الفاضلة. نقابات آل جابر مصممة خصيصاً لتجمع بين الستر التام وسهولة التنفس:
• نقاب تندة مائلة كوري (شيفون إندونيسي أصلي): مريح جداً للعينين والتنفس دون كتمة.
• نقاب ماليزي 3 طبقات كلوش: فخم وسابغ جداً برباط كبسولة وسواد داكن ملكي.
وخامتها ناعمة تماماً لا تسبب حساسية للبشرة.`;
  }

  if (q.includes('خمار') || q.includes('خمارات')) {
    return `الخمارات المتوفرة في آل جابر:
• خمار فرنسي مثلث طويل كريب رويال: انسيابي وجميل جداً ومريح في حركة اليدين.
• خمار دائري دبل كلوش دورين: للمناسبات والأعياد بمظهر راقٍ جداً وقماش شيفون ملكي مزدوج غير شفاف.
هل تحبين لوناً محدداً لمساعدتكِ في التنسيق؟`;
  }

  if (q.includes('دريس') || q.includes('عباية') || q.includes('دريسات')) {
    return `لدينا دريسات وعبايات شرعية بمقاسات واسعة وساترة:
• دريس عباية فراشة ملكية كريب سعودي: وسع رحب جداً وتطريز راقٍ على الأساور مع سوستة لسهولة الوضوء والارتداء.
• دريس مريم كاجوال لينين مغسول: بأزرار خشبية راقية، مثالي للجامعة والعمل والزيارات الصباحية.`;
  }

  if (q.includes('مقاس') || q.includes('طول') || q.includes('وزن')) {
    return `يسعدني مساعدتكِ في اختيار المقاس المناسب!
• للإدناءات: 
  - مقاس 1: يناسب طول 155 إلى 162 سم.
  - مقاس 2: يناسب طول 163 إلى 170 سم.
  - مقاس 3: يناسب طول أكثر من 170 سم.
• للدريسات: متوفرة بأطوال 54، 56، 58، 60، أو مقاسات M حتى XXL.
يمكنكِ كتابة طولكِ ووزنكِ وسأقترح عليكِ المقاس الأنسب بدقة!`;
  }

  if (q.includes('عرض') || q.includes('خصم') || q.includes('تخفيض')) {
    return `متجر آل جابر يقدم حالياً عروضاً مميزة:
• خصومات تصل إلى 20% و25% على الموديلات المختارة (الإدناء الفرنسي، دريس الفراشة، نقابات التندة).
• عرض شحن مجاني للطلبات فوق ${settings.freeShippingThreshold} ج.م.
• هدية معصم قطني مع كل إدناء! يمكنكِ تصفح قسم العروض مباشرة من المتجر.`;
  }

  return `أهلاً ومرحباً بكِ في "آل جابر للزي الشرعي"! أنا عمر، مستشاركِ الذكي ومساعدكِ في اختيار أفضل الإدناءات، الإسدالات، النقابات، الخمارات والدريسات الشرعية.
أنا هنا لمساعدتكِ في معرفة المقاسات، الخامات، أسعار العروض، وطريقة دفع العربون والشحن. كيف يمكنني خدمتكِ اليوم يا أختنا الكريمة؟`;
};