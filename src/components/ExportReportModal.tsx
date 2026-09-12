import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  FileText,
  Sparkles,
  CheckCircle2,
  Calendar,
  Store,
  MapPin,
  Phone,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { DalilakBusiness, EcosystemActivityProgress } from '../types';
import { downloadMarketingPdfReport } from '../utils/pdfReportGenerator';
import { CONTENT_PILLARS_METADATA } from '../utils/egyptianDialectPrompts';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: DalilakBusiness;
  progress: EcosystemActivityProgress;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  business,
  progress,
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportStatus, setExportStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setExportStatus('جاري تجهيز صفحات التقرير...');
    try {
      await downloadMarketingPdfReport({
        business,
        progress,
        elementId: 'marketing-report-printable',
        onProgress: (msg) => setExportStatus(msg),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
      setExportStatus('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const persona = progress.persona;
  const calendar = progress.calendar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden text-right">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                معاينة وتصدير التقرير التسويقي الفاخر
              </h3>
              <p className="text-xs text-slate-500">
                تقرير شامل جاهز للتقديم للعميل باسم ونشاط محله
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
              title="طباعة مباشرة"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">طباعة</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
            >
              {isExporting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isExporting ? 'جاري التصدير...' : 'تنزيل PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {exportStatus && (
          <div className="bg-sky-50 px-6 py-2 text-xs text-sky-700 font-bold border-b border-sky-100 flex items-center gap-2">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>{exportStatus}</span>
          </div>
        )}

        {/* Scrollable Printable Report Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/70">
          
          <div
            id="marketing-report-printable"
            className="bg-white max-w-[800px] mx-auto p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 text-slate-900"
            dir="rtl"
          >
            {/* Report Header */}
            <div className="flex items-start justify-between border-b-2 border-sky-600 pb-5">
              <div className="space-y-1">
                <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                  منظومة دليلك الذكية • تقرير استراتيجية التسويق
                </span>
                <h1 className="text-2xl font-black text-slate-900">
                  {business.name_ar || business.name_en}
                </h1>
                <p className="text-xs text-slate-500">
                  {business.category} • {business.governorate} {business.city ? `- ${business.city}` : ''}
                </p>
              </div>

              <div className="text-left space-y-1">
                <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                  <span>دليلك معتمد</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  تاريخ التقرير: {new Date().toLocaleDateString('ar-EG')}
                </div>
              </div>
            </div>

            {/* Slogan & Persona Box */}
            {persona && (
              <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100 space-y-3">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-bold text-sky-800">
                    الشعار الإعلاني الرسمي للحملة
                  </span>
                  <h3 className="text-lg font-black text-sky-900">
                    "{persona.slogan}"
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-sky-200/50">
                  <div>
                    <span className="font-bold text-slate-700 block">نبرة الخطاب:</span>
                    <span className="text-slate-600">{persona.brandVoice}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">الميزة التنافسية (USP):</span>
                    <span className="text-slate-600">{persona.uniqueSellingProposition}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Content Calendar Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-base text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span>تقويم خطة الـ 30 يوماً (أبرز المنشورات)</span>
                </h4>
                <span className="text-xs text-slate-500 font-semibold">
                  إجمالي 30 منشور مقسمة على 4 ركائز
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs divide-y divide-slate-100">
                {calendar.slice(0, 10).map((day) => {
                  const meta = CONTENT_PILLARS_METADATA[day.pillar];
                  return (
                    <div key={day.day} className="p-3 flex items-start gap-3 bg-white hover:bg-slate-50">
                      <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0">
                        {day.day}
                      </span>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${meta.bg} ${meta.color}`}>
                            {meta.title}
                          </span>
                          <span className="font-bold text-slate-900 truncate">
                            {day.headline}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          "{day.hookText}" - {day.callToAction}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {calendar.length > 10 && (
                <p className="text-center text-[11px] text-slate-400 font-semibold">
                  ... ويتضمن الملف الرقمي الكامل بقية الأيام حتى اليوم الـ 30.
                </p>
              )}
            </div>

            {/* Ready WhatsApp Campaign Sample */}
            {progress.whatsappCampaigns && progress.whatsappCampaigns.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">
                  نموذج رسالة واتساب الإغلاق البيعي للنشاط:
                </span>
                <p className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 whitespace-pre-line leading-relaxed">
                  {progress.whatsappCampaigns[0].messageText}
                </p>
              </div>
            )}

            {/* Official Report Footer */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div>
                <p className="font-bold text-slate-800">
                  منصة دليلك الرقمية المعتمدة
                </p>
                <p className="text-[11px] text-slate-400">
                  شبكة تسويق وتوثيق الأنشطة التجارية في جمهورية مصر العربية
                </p>
              </div>

              <div className="text-left font-mono text-[11px] text-slate-400">
                www.dalilak.online
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
