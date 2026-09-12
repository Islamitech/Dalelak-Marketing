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
            : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-amber-500/20 active:scale-95'
        }`}
      >
        {isAlreadyPromoted ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>محفوظ في سيرفر المنظومة (جاهز للمرحلة 3)</span>
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            <span>حفظ لسيرفر المساعدين (جاهز للمرحلة 3)</span>
          </>
        )}
      </button>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl text-right space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    حفظ ومزامنة مخرجات التسويق للمنظومة
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ecosystem Sync • جاهز لاستوديو العروض (المرحلة 3)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              سيتم حفظ وتحديث الخطة التسويقية للنشاط داخل جدول <code className="text-amber-800 bg-amber-50 px-1 py-0.5 rounded font-mono font-bold">marketing_activities</code> في سيرفر المساعدين (<span className="font-mono text-slate-800">hzlbbzxccqfdeyumtxph</span>).
            </p>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-950">
              <strong>تنبيه مسار العمل:</strong> المرحلة 3 (استوديو العينات المحمية والعروض) هي المحطة الوحيدة المخولة بنقل وتأكيد واعتماد البيانات رسمياً للسيرفر الأساسي لدليلك بعد موافقة العميل.
            </div>

            {/* Assets Checklist */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-800 mb-1">
                الأصول الجاهزة للمزامنة:
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

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handlePromote}
                disabled={isPromoting}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                {isPromoting ? (
                  <span>جاري المزامنة والحفظ...</span>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>تأكيد المزامنة مع المنظومة</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
