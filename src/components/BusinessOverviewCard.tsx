import React from 'react';
import {
  Store,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { DalilakBusiness } from '../types';

interface BusinessOverviewCardProps {
  business: DalilakBusiness;
  onChangeBusiness: () => void;
  onGeneratePlan: () => void;
  isGenerating: boolean;
  hasExistingPlan: boolean;
  source?: 'gemini-ai' | 'smart-egyptian-engine';
  errorDetails?: string;
  modelUsed?: string;
}

export const BusinessOverviewCard: React.FC<BusinessOverviewCardProps> = ({
  business,
  onChangeBusiness,
  onGeneratePlan,
  isGenerating,
  hasExistingPlan,
  source,
  errorDetails,
  modelUsed,
}) => {
  const locationString = [business.governorate, business.city, business.street, business.landmark]
    .filter(Boolean)
    .join(' • ');

  const handleOpenWhatsApp = (phone: string) => {
    const cleanNumber = phone.replace(/\D/g, '');
    const intlNumber = cleanNumber.startsWith('0') ? `20${cleanNumber.slice(1)}` : cleanNumber;
    window.open(`https://wa.me/${intlNumber}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Main Details */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/10">
            <Store className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-slate-900">
                {business.name_ar || business.name_en}
              </h2>
              {business.name_en && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase font-mono">
                  {business.name_en}
                </span>
              )}
              {business.verification_status === 'verified' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  نشاط موثق رسمياً
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              {business.category && (
                <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                  {business.category}
                </span>
              )}

              {locationString && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {locationString}
                </span>
              )}

              {business.working_hours && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {business.working_hours}
                </span>
              )}
            </div>

            {/* Phones and Google Maps */}
            <div className="flex items-center gap-3 text-xs pt-1 flex-wrap">
              {business.phone && (
                <button
                  onClick={() => handleOpenWhatsApp(business.phone)}
                  className="inline-flex items-center gap-1 text-slate-700 hover:text-emerald-600 font-mono font-medium transition-colors"
                  title="مراسلة عبر واتساب"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span dir="ltr">{business.phone}</span>
                </button>
              )}

              {business.secondary_phone && (
                <span className="text-slate-400 font-mono" dir="ltr">
                  / {business.secondary_phone}
                </span>
              )}

              {business.google_maps_url && (
                <a
                  href={business.google_maps_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-medium"
                >
                  <ExternalLink className="w-3 h-3" />
                  موقع خرائط جوجل
                </a>
              )}
            </div>

            {/* AI Source & Generation Status Badge */}
            {hasExistingPlan && (
              <div className="flex items-center gap-2 pt-1.5 flex-wrap">
                {source === 'gemini-ai' ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>توليد ذكاء اصطناعي مباشر ({modelUsed || 'Google Gemini'})</span>
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
                    title={errorDetails}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>النمط المحلي التخصصي الاحتياطي {errorDetails ? `(${errorDetails})` : ''}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            onClick={onChangeBusiness}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            تغيير النشاط
          </button>

          <button
            onClick={onGeneratePlan}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 disabled:opacity-50 transition-all active:scale-95"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'جاري التوليد الذكي...' : hasExistingPlan ? 'إعادة التوليد وتحديث الخطة' : 'توليد الخطة التسويقية (30 يوماً)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
