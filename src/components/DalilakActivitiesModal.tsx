import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  RefreshCw,
  Store,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { DalilakBusiness } from '../types';
import { fetchDalilakBusinesses } from '../services/dalilakService';

interface DalilakActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBusiness: (business: DalilakBusiness) => void;
}

const CATEGORIES = [
  { id: 'all', label: '🌟 كل الأنشطة' },
  { id: 'مطاعم ومشويات', label: '🍔 مطاعم ومشويات' },
  { id: 'مقاهي وكافيهات', label: '☕ كافيهات ومقاهي' },
  { id: 'غسيل وتلميع سيارات', label: '🚗 مغاسل وعناية سيارات' },
  { id: 'أطباء وعيادات ومراكز طبية', label: '🩺 عيادات ومراكز طبية' },
  { id: 'صالونات حلاقة وتجميل وسبا', label: '✂️ صالونات وسبا' },
  { id: 'سوبرماركت وبقالة وتموينات', label: '🛒 سوبرماركت وتجزئة' },
];

export const DalilakActivitiesModal: React.FC<DalilakActivitiesModalProps> = ({
  isOpen,
  onClose,
  onSelectBusiness,
}) => {
  const [businesses, setBusinesses] = useState<DalilakBusiness[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = async (query = searchQuery, cat = selectedCategory) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetchDalilakBusinesses({
        search: query,
        category: cat,
        limit: 80,
      });
      setBusinesses(res.data);
      if (res.error) setErrorMessage(res.error);
    } catch (err: any) {
      setErrorMessage('تعذر جلب الأنشطة حالياً');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden text-right">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                اختيار نشاط تجاري من منصة دليلك
              </h3>
              <p className="text-xs text-slate-500">
                اسحب بيانات النشاط وصوره للبدء في توليد استراتيجية التسويق وخطة الـ 30 يوماً
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                loadData(e.target.value, selectedCategory);
              }}
              placeholder="ابحث باسم المحل، رقم الهاتف، المدينة، أو التصنيف..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          {/* Categories Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  loadData(searchQuery, cat.id);
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium border ${
                  selectedCategory === cat.id
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notice if error/demo */}
        {errorMessage && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Business List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-50">
          {loading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-sky-600" />
              <span className="text-sm">جاري تحميل الأنشطة المتاحة...</span>
            </div>
          ) : businesses.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Store className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">لم يتم العثور على أي أنشطة تطابق بحثك</p>
              <p className="text-xs text-slate-400 mt-1">جرّب تغيير كلمات البحث أو التصنيف</p>
            </div>
          ) : (
            businesses.map((biz) => {
              const locationParts = [biz.governorate, biz.city, biz.street].filter(Boolean);
              return (
                <div
                  key={biz.id}
                  onClick={() => {
                    onSelectBusiness(biz);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-sky-300 hover:bg-sky-50/40 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 group-hover:text-sky-700 text-sm sm:text-base">
                        {biz.name_ar || biz.name_en}
                      </h4>
                      {biz.category && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {biz.category}
                        </span>
                      )}
                      {biz.verification_status === 'verified' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          معتمد بدليلك
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      {locationParts.length > 0 && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {locationParts.join(' - ')}
                        </span>
                      )}
                      {biz.phone && (
                        <span className="flex items-center gap-1 text-slate-600 font-mono" dir="ltr">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {biz.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="px-3.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white font-bold text-xs transition-colors shrink-0">
                    بدء التسويق
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>العدد المتاح: {businesses.length} نشاط</span>
          <button
            onClick={() => loadData()}
            className="flex items-center gap-1.5 text-sky-600 hover:text-sky-700 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            تحديث القائمة
          </button>
        </div>
      </div>
    </div>
  );
};
