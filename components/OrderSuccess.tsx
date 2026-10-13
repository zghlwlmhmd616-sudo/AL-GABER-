/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Order, StoreSettings } from '../types';
import { CheckCircle2, MessageSquare, ArrowLeft, ShieldCheck, MapPin, Phone, Copy, Check } from 'lucide-react';

interface OrderSuccessProps {
  order: Order;
  settings: StoreSettings;
  onBackToHome: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ order, settings, onBackToHome }) => {
  const [copied, setCopied] = React.useState(false);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `السلام عليكم ورحمة الله وبركاته، قمت بعمل طلب جديد من متجر آل جابر للزي الشرعي.\n` +
      `رقم الطلب: #${order.orderNumber}\n` +
      `الاسم: ${order.customerName}\n` +
      `الهاتف: ${order.phone}\n` +
      `العربون المحول: ${order.depositPaidReported} ج.م من رقم (${order.depositSenderNumber})\n` +
      `المتبقي عند الاستلام: ${order.remainingAmount} ج.م\n` +
      `العنوان: ${order.governorate} - ${order.cityAndArea}\n` +
      `أرجو تأكيد استلام العربون وبدء التجهيز، جزاكم الله خيراً.`
    );
    return `https://wa.me/${settings.whatsappNumber}?text=${text}`;
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-right">
      
      <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-10 shadow-lg space-y-6 text-center">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-[#8A7955] uppercase tracking-wider block mb-1">
            تم استلام طلبكِ بنجاح
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#18231C]">
            مبارك! تم تسجيل أوردركِ في آل جابر
          </h1>
          <p className="text-xs sm:text-sm text-[#716B5E] mt-2">
            تم استلام بياناتكِ وإشعار تحويل العربون بنجاح، وجاري مراجعته وبدء تجهيز الموديل بمقاسكِ المطلوب.
          </p>
        </div>

        {/* Order Number Badge */}
        <div className="bg-[#FAF6ED] p-4 rounded-2xl border border-[#E9DECA] flex items-center justify-between">
          <div className="text-right">
            <span className="text-xs text-[#716B5E] block">رقم الطلب:</span>
            <span className="text-xl font-mono font-bold text-[#997A2E]">#{order.orderNumber}</span>
          </div>

          <button
            onClick={copyOrderNumber}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-xs font-bold text-[#997A2E] rounded-xl border border-[#DDD3BF] shadow-2xs hover:bg-[#FAF8F5] transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ رقم الطلب</span>
              </>
            )}
          </button>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E1D3] text-right text-xs space-y-3">
          <h3 className="font-bold text-sm text-[#18231C] pb-2 border-b border-[#EAE3D5]">
            تفاصيل الأوردر والعنوان:
          </h3>

          <div className="grid grid-cols-2 gap-3 text-[#524E46]">
            <div>
              <span className="text-[#8C8578] block">اسم العميلة:</span>
              <strong className="text-[#1F2D24]">{order.customerName}</strong>
            </div>
            <div>
              <span className="text-[#8C8578] block">رقم الهاتف:</span>
              <strong className="text-[#1F2D24]">{order.phone}</strong>
            </div>
            <div>
              <span className="text-[#8C8578] block">المحافظة والمنطقة:</span>
              <strong className="text-[#1F2D24]">{order.governorate} - {order.cityAndArea}</strong>
            </div>
            <div>
              <span className="text-[#8C8578] block">حالة الأوردر:</span>
              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">
                قيد مراجعة العربون
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#EAE3D5] flex justify-between items-center text-sm font-bold">
            <span className="text-[#1F2D24]">العربون المحول:</span>
            <span className="text-[#997A2E]">{order.depositPaidReported} ج.م (من {order.depositSenderNumber})</span>
          </div>

          <div className="flex justify-between items-center text-sm font-bold bg-white p-2.5 rounded-xl border border-[#DDD3BF]">
            <span className="text-[#787267]">المتبقي كاش عند الاستلام:</span>
            <span className="text-[#997A2E] text-base">{order.remainingAmount} ج.م</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            <span>متابعة الطلب وتأكيده عبر الواتساب فوراً</span>
          </a>

          <button
            onClick={onBackToHome}
            className="w-full py-3 bg-[#EFE9DD] hover:bg-[#E5DDCB] text-[#1F2D24] rounded-xl font-bold text-sm border border-[#DDD3BF] transition-all"
          >
            العودة لصفحة المتجر الرئيسية
          </button>
        </div>

      </div>

    </div>
  );
};

export default OrderSuccess;
