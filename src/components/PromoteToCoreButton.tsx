import React, { useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  X,
  FileCheck,
  ArrowUpRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DalilakBusiness, EcosystemActivityProgress } from '../types';
import { promoteActivityToCoreProduction } from '../services/dalilakService';

interface PromoteToCoreButtonProps {
  business: DalilakBusiness;
  progress: EcosystemActivityProgress;
  onPromoted: () => void;
}

export const PromoteToCoreButton: React.FC<PromoteToCoreButtonProps> = ({
  business,
  progress,
  onPromoted,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isPromoting, setIsPromoting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePromote = async () => {
    setIsPromoting(true);
    try {
      const res = await promoteActivityToCoreProduction(business, progress);
      if (res.success) {
        setSuccessMessage(res.message);
        triggerCelebration();
        onPromoted();
        setTimeout(() => {
          setShowConfirmModal(false);
          setSuccessMessage(null);
        }, 2200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPromoting(false);
    }
  };

  const isAlreadyPromoted = progress.isPromotedToCore;

  return (
    <>
      <button
        onClick={() => setShowConfirmModal(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs ${
          isAlreadyPromoted
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
        }`}
      >
        {isAlreadyPromoted ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>معتمد في السيرفر الأساسي</span>
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            <span>ترقية واعتماد النشاط للسيرفر الأساسي</span>
          </>
        )}
      </button>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl text-right space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    ترقية واعتماد النشاط في السيرفر الأساسي
                  </h3>
                  <p className="text-xs text-slate-500">
                    Core Production Server Promotion
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              عند اعتماد النشاط، سيتم نقل الخطة التسويقية وهوية المنشأة إلى قاعدة بيانات دليلك الأساسية ليصبح النشاط موثقاً رسمياً ويتابعه فريق العمل والمناديب الميدانيين.
            </p>

            {/* Assets Checklist */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-800 mb-1">
                الأصول والبيانات الجاهزة للنقل:
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>خطة محتوى متكاملة لـ 30 يوماً ({progress.calendar.length} منشور)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>الهوية الإعلانية ونبرة الصوت والشعار المقترح</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>حملات ورسائل الواتساب الإقناعية المخصصة</span>
              </div>
            </div>

            {successMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handlePromote}
                disabled={isPromoting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isPromoting ? 'جاري الاعتماد والترقية...' : 'تأكيد الترقية والاعتماد'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
