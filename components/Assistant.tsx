/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Product, StoreSettings } from '../types';
import { sendMessageToOmar } from '../services/geminiService';
import { MessageSquare, X, Send, Sparkles, User, HelpCircle, RefreshCw } from 'lucide-react';

interface AssistantProps {
  products: Product[];
  settings: StoreSettings;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

const Assistant: React.FC<AssistantProps> = ({ 
  products, 
  settings, 
  externalPrompt, 
  onClearExternalPrompt 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: `أهلاً ومرحباً بكِ في "آل جابر للزي الشرعي"! 🌿
أنا عمر، مستشاركِ ومساعدكِ الذكي. يسعدني مساعدتكِ في:
• ترشيح المقاس الأنسب لطولكِ ووزنكِ
• الفرق بين أنواع الإدناءات والخمارات والنقابات
• معرفة عروض التخفيضات والشحن المجاني
• تفاصيل دفع العربون واستلام باقي المبلغ كاش

كيف يمكنني خدمتكِ اليوم يا أختنا الكريمة؟`, 
      timestamp: Date.now() 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Quick prompt chips
  const quickChips = [
    'المقاس المناسب لطولي؟',
    'ما هو نظام العربون؟',
    'عروض الشحن والتوصيل',
    'الفرق بين الإدناء الفرنسي والعادي؟',
    'ترشيح نقاب مريح للتنفس'
  ];

  // If an external prompt was triggered (e.g. from product page)
  useEffect(() => {
    if (externalPrompt) {
      setIsOpen(true);
      handleSendPrompt(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isThinking]);

  const handleSendPrompt = async (text: string) => {
    if (!text.trim() || isThinking) return;

    const userMsg: ChatMessage = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendMessageToOmar(history, text, products, settings);
      
      const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const text = inputValue;
    setInputValue('');
    handleSendPrompt(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages([
      { 
        role: 'model', 
        text: `أهلاً بكِ مجدداً في آل جابر! أنا عمر، جاهز للإجابة عن أي استفسار حول الموديلات أو المقاسات أو العربون.`, 
        timestamp: Date.now() 
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-[#FAF8F5] rounded-3xl shadow-2xl w-[92vw] sm:w-[400px] h-[580px] mb-4 flex flex-col overflow-hidden border border-[#DCD3C1] animate-fadeIn text-right">
          
          {/* Header */}
          <div className="bg-[#121316] text-[#FAF8F5] p-4 border-b border-[#C5A059]/40 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DFBD69] to-[#997A2E] text-[#121316] flex items-center justify-center font-bold text-sm shadow-gold font-serif">
                  عمر
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#121316]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-[#F3E5AB]">المستشار عمر الذكي</h3>
                  <span className="bg-[#C5A059]/20 text-[#DFBD69] text-[10px] px-2 py-0.5 rounded-full font-semibold border border-[#C5A059]/40">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-gray-300">
                  خبير ومستشار آل جابر للزي الشرعي
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="إعادة بدء المحادثة"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF7F2]" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div 
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-[#14161A] text-[#F3E5AB] border border-[#C5A059]/30 rounded-br-xs shadow-xs' 
                      : 'bg-white border border-[#E8E1D3] text-[#2C2924] rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-end">
                <div className="bg-white border border-[#E8E1D3] p-3 rounded-2xl flex items-center gap-2 shadow-2xs">
                  <span className="text-xs text-[#716B5E] font-medium">عمر يكتب الرد...</span>
                  <div className="flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-[#997A2E] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#997A2E] rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-[#997A2E] rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-[#F0ECE1] border-t border-[#E8E1D3] overflow-x-auto scrollbar-none flex gap-1.5">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                disabled={isThinking}
                onClick={() => handleSendPrompt(chip)}
                className="px-2.5 py-1 bg-white hover:bg-[#FAF6ED] text-[#997A2E] rounded-full text-[11px] font-semibold border border-[#DDD3BF] shrink-0 transition-colors disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-[#E8E1D3]">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="اسألي عمر عن المقاسات، الخامات، أو العربون..." 
                className="flex-1 bg-[#FAF8F5] border border-[#DDD3BF] focus:border-[#C5A059] px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none transition-colors text-[#1F2D24]"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isThinking}
                className="bg-gradient-to-r from-[#C5A059] to-[#DFBD69] text-[#121316] px-4 rounded-xl transition-all disabled:opacity-40 flex items-center justify-center shrink-0 shadow-xs"
              >
                <Send className="w-4 h-4 rotate-180 text-[#121316]" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Floating Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-[#121316] hover:bg-[#1C1E24] text-white px-4 py-3 rounded-full shadow-gold hover:shadow-gold-lg transition-all duration-300 hover:scale-105 border-2 border-[#C5A059]"
        aria-label="تحدثي مع المستشار عمر"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#DFBD69] to-[#997A2E] text-[#121316] flex items-center justify-center font-bold text-xs font-serif shrink-0">
          عمر
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs font-bold leading-tight flex items-center gap-1 text-[#F3E5AB]">
            <span>مستشاركِ عمر</span>
            <Sparkles className="w-3 h-3 text-[#DFBD69]" />
          </span>
          <span className="text-[10px] text-gray-300 font-normal">
            {isOpen ? 'إغلاق المحادثة' : 'اسألي عن المقاس والخامة'}
          </span>
        </div>
      </button>

    </div>
  );
};

export default Assistant;