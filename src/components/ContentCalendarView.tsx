import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Hash,
  Eye,
  Edit2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ContentCalendarDay, ContentPillarType } from '../types';
import { CONTENT_PILLARS_METADATA } from '../utils/egyptianDialectPrompts';

interface ContentCalendarViewProps {
  calendar: ContentCalendarDay[];
  onUpdateDay: (dayNumber: number, updatedDay: ContentCalendarDay) => void;
}

export const ContentCalendarView: React.FC<ContentCalendarViewProps> = ({
  calendar,
  onUpdateDay,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [copiedDay, setCopiedDay] = useState<number | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [editingDay, setEditingDay] = useState<ContentCalendarDay | null>(null);

  const handleCopyPost = (day: ContentCalendarDay) => {
    const fullText = `${day.hookText}\n\n${day.bodyText}\n\n${day.callToAction}\n\n${day.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedDay(day.day);
    setTimeout(() => setCopiedDay(null), 1500);
  };

  const handleToggleComplete = (day: ContentCalendarDay) => {
    onUpdateDay(day.day, {
      ...day,
      isCompleted: !day.isCompleted,
    });
  };

  const handleSaveEdit = () => {
    if (editingDay) {
      onUpdateDay(editingDay.day, editingDay);
      setEditingDay(null);
    }
  };

  const filteredDays =
    selectedPillar === 'all'
      ? calendar
      : calendar.filter((item) => item.pillar === selectedPillar);

  const completedCount = calendar.filter((d) => d.isCompleted).length;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              تقويم خطة المحتوى الشهري (30 يوماً متكاملة)
            </h3>
            <p className="text-xs text-slate-500">
              موزعة بتوازن على 4 ركائز تسويقية لدفع خوارزميات السوشيال ميديا وتحقيق أعلى مبيعات
            </p>
          </div>
        </div>

        {/* Completed Progress */}
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>المنشورات المكتملة: {completedCount} من 30</span>
        </div>
      </div>

      {/* Pillar Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedPillar('all')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all border whitespace-nowrap ${
            selectedPillar === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
          }`}
        >
          كل الأيام (30 يوم)
        </button>

        {(Object.keys(CONTENT_PILLARS_METADATA) as ContentPillarType[]).map((pillarKey) => {
          const meta = CONTENT_PILLARS_METADATA[pillarKey];
          const count = calendar.filter((d) => d.pillar === pillarKey).length;
          return (
            <button
              key={pillarKey}
              onClick={() => setSelectedPillar(pillarKey)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all border whitespace-nowrap flex items-center gap-1.5 ${
                selectedPillar === pillarKey
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <span>{meta.title}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/30">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Days Grid / List */}
      <div className="space-y-3">
        {filteredDays.map((item) => {
          const meta = CONTENT_PILLARS_METADATA[item.pillar];
          const isExpanded = expandedDay === item.day;

          return (
            <div
              key={item.day}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                item.isCompleted
                  ? 'bg-slate-50/60 border-slate-200 opacity-90'
                  : isExpanded
                  ? 'bg-white border-sky-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Day Header Row */}
              <div
                onClick={() => setExpandedDay(isExpanded ? null : item.day)}
                className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      item.isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {item.isCompleted ? <Check className="w-4 h-4" /> : `يوم ${item.day}`}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${meta.bg} ${meta.color}`}>
                        {meta.title}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {item.headline}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 truncate max-w-lg">
                      "{item.hookText}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyPost(item);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                    title="نسخ نص البوست كاملاً"
                  >
                    {copiedDay === item.day ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(item);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      item.isCompleted
                        ? 'text-emerald-600 hover:bg-emerald-50'
                        : 'text-slate-300 hover:text-emerald-600 hover:bg-slate-100'
                    }`}
                    title={item.isCompleted ? 'إلغاء وضع التم' : 'تحديد كمنشور تم نشره'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4 text-xs">
                  
                  {/* Hook & Body Text */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div>
                      <span className="text-[11px] font-black text-purple-700 block mb-1">
                        🎯 الهوك (الجملة الافتتاحية الخاطفة):
                      </span>
                      <p className="font-bold text-slate-800 text-sm">
                        {item.hookText}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-black text-slate-600 block mb-1">
                        📝 نص المنشور الكامل (باللهجة المصرية):
                      </span>
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed text-xs">
                        {item.bodyText}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-black text-amber-700 block mb-1">
                        ⚡ نداء العمل الحاسم (CTA):
                      </span>
                      <p className="font-semibold text-slate-800">
                        {item.callToAction}
                      </p>
                    </div>
                  </div>

                  {/* Visual Direction & Hashtags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-sky-800">
                        <Eye className="w-3.5 h-3.5" />
                        <span>مقترح الصورة أو الفيديو (Visual Direction):</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {item.visualDirection}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-purple-800">
                        <Hash className="w-3.5 h-3.5" />
                        <span>الهاشتاجات المقترحة:</span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {item.hashtags.map((tag, idx) => (
                          <span key={idx} className="text-[11px] text-purple-700 font-mono bg-white px-1.5 py-0.5 rounded border border-purple-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>موعد النشر المقترح: {item.bestTimeToPost}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingDay(item)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>تعديل اليوم</span>
                      </button>

                      <button
                        onClick={() => handleCopyPost(item)}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>نسخ المنشور</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 border border-slate-200 shadow-xl text-right space-y-4">
            <h4 className="font-bold text-slate-900 text-base">
              تعديل محتوى اليوم رقم {editingDay.day}
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الهوك (الجملة الخاطفة):
              </label>
              <input
                type="text"
                value={editingDay.hookText}
                onChange={(e) => setEditingDay({ ...editingDay, hookText: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نص المنشور:
              </label>
              <textarea
                rows={4}
                value={editingDay.bodyText}
                onChange={(e) => setEditingDay({ ...editingDay, bodyText: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نداء العمل (CTA):
              </label>
              <input
                type="text"
                value={editingDay.callToAction}
                onChange={(e) => setEditingDay({ ...editingDay, callToAction: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingDay(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
              >
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
