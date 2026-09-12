import React, { useState } from 'react';
import {
  MessageSquare,
  Copy,
  Check,
  Send,
  Users,
  Target,
  Phone,
  Sparkles,
} from 'lucide-react';
import { DalilakBusiness, WhatsAppCampaign } from '../types';

interface WhatsAppCampaignsTabProps {
  campaigns: WhatsAppCampaign[];
  business: DalilakBusiness;
}

export const WhatsAppCampaignsTab: React.FC<WhatsAppCampaignsTabProps> = ({
  campaigns,
  business,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customPhone, setCustomPhone] = useState<string>('');
  const [activeSendId, setActiveSendId] = useState<string | null>(null);

  if (!campaigns || campaigns.length === 0) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDirectSend = (message: string, targetPhone?: string) => {
    const target = targetPhone || customPhone || business.owner_phone || business.phone || '';
    const cleanNumber = target.replace(/\D/g, '');
    const intlNumber = cleanNumber.startsWith('0') ? `20${cleanNumber.slice(1)}` : cleanNumber;
    const encoded = encodeURIComponent(message);
    const url = intlNumber ? `https://wa.me/${intlNumber}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
    setActiveSendId(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              قوالب حملات الواتساب المباشرة والإغلاق البيعي
            </h3>
            <p className="text-xs text-slate-500">
              رسائل مصممة بمبادئ علم النفس الإقناعي لتحفيز العميل على الزيارة وطلب التقييم
            </p>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {camp.categoryTag}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  الهدف: {camp.intendedGoal}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">
                {camp.title}
              </h4>

              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>الجمهور: {camp.targetAudience}</span>
              </div>
            </div>

            {/* WhatsApp Bubble Preview */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100/80 text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-line relative shadow-2xs">
              <div className="absolute top-2 left-2 opacity-10">
                <MessageSquare className="w-8 h-8 text-emerald-600" />
              </div>
              {camp.messageText}
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopy(camp.messageText, camp.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-white text-xs font-bold transition-colors"
              >
                {copiedId === camp.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ النص</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (camp.categoryTag.includes('B2B') && business.owner_phone) {
                    handleDirectSend(camp.messageText, business.owner_phone);
                  } else {
                    setActiveSendId(activeSendId === camp.id ? null : camp.id);
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال واتساب مباشر</span>
              </button>
            </div>

            {/* Phone Input Dropdown */}
            {activeSendId === camp.id && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2 mt-2 animate-in fade-in">
                <label className="block text-[11px] font-bold text-slate-700">
                  أدخل رقم هاتف العميل (أو اتركه فارغاً لفتح الواتساب):
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="مثال: 01012345678"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden font-mono"
                    dir="ltr"
                  />
                  <button
                    onClick={() => handleDirectSend(camp.messageText)}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                  >
                    إرسال الآن
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
