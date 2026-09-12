import React, { useState } from 'react';
import {
  Sparkles,
  Store,
  Settings,
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Bot,
  Layers,
  KeyRound,
  X,
  ExternalLink,
} from 'lucide-react';
import { DalilakBusiness, ServerConfig } from '../types';
import { getServerConfig, saveServerConfig, resetServerConfig } from '../services/dalilakService';

interface HeaderProps {
  currentBusiness: DalilakBusiness | null;
  onOpenActivitiesModal: () => void;
  onResetBusiness: () => void;
  isAiLive: boolean;
  isCoreLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentBusiness,
  onOpenActivitiesModal,
  onResetBusiness,
  isAiLive,
  isCoreLive,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [config, setConfig] = useState<ServerConfig>(getServerConfig());
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveServerConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowSettingsModal(false);
    }, 1200);
  };

  const handleResetSettings = () => {
    resetServerConfig();
    setConfig(getServerConfig());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1200);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Right: Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  المرحلة 1
                </span>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  دليلك • استوديو التسويق الذكي
                </h1>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                صناعة الهوية ونصوص الإعلانات المصرية وخطط المحتوى الشهرية
              </p>
            </div>
          </div>

          {/* Left: Actions & Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Status Pills */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-medium">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                  isCoreLive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
                title="السيرفر الأساسي لدليلك (Core Supabase)"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{isCoreLive ? 'السيرفر الأساسي متصل' : 'سيرفر محلي/احتياطي'}</span>
              </span>

              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                  isAiLive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
                title={isAiLive ? 'توليد ذكاء اصطناعي مباشر عبر Google Gemini' : 'يعمل حالياً عبر المحرك التخصصي الاحتياطي'}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{isAiLive ? 'ذكاء Gemini مباشر' : 'المحرك التخصصي الاحتياطي'}</span>
              </span>
            </div>

            {/* Select Business Trigger */}
            <button
              onClick={onOpenActivitiesModal}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
            >
              <Store className="w-4 h-4" />
              <span className="max-w-[120px] sm:max-w-[180px] truncate">
                {currentBusiness ? (currentBusiness.name_ar || currentBusiness.name_en) : 'اختر نشاطاً تجارياً'}
              </span>
            </button>

            {/* Settings Trigger */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="إعدادات السيرفرات ومفاتيح الذكاء الاصطناعي"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Reset Activity */}
            {currentBusiness && (
              <button
                onClick={onResetBusiness}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                title="إلغاء تحديد النشاط والبدء من جديد"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl text-right animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Settings className="w-5 h-5 text-sky-600" />
                <h3>إعدادات السيرفرات ومفاتيح المنظومة</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 mt-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  1. رابط السيرفر الأساسي لدليلك (Core Supabase URL):
                </label>
                <input
                  type="text"
                  value={config.coreUrl}
                  onChange={(e) => setConfig({ ...config, coreUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-xs font-mono"
                  placeholder="https://xdqpbajymacpdccorjcj.supabase.co"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  مفتاح السيرفر الأساسي (Core Supabase Anon Key):
                </label>
                <input
                  type="password"
                  value={config.coreKey}
                  onChange={(e) => setConfig({ ...config, coreKey: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  2. رابط سيرفر المنظومة المخصص (Dedicated Ecosystem Staging):
                </label>
                <input
                  type="text"
                  value={config.ecosystemUrl}
                  onChange={(e) => setConfig({ ...config, ecosystemUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-xs font-mono"
                  placeholder="https://hzlbbzxccqfdeyumtxph.supabase.co"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  مفتاح سيرفر المنظومة المخصص (Ecosystem Supabase Anon Key):
                </label>
                <input
                  type="password"
                  value={config.ecosystemKey}
                  onChange={(e) => setConfig({ ...config, ecosystemKey: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-xs font-mono"
                  placeholder="أدخل مفتاح Supabase Anon Key الخاص بالمشروع hzlbbzxccqfdeyumtxph"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">
                  تجد المفتاح في: Supabase Dashboard &gt; Project Settings &gt; API &gt; anon public
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  3. مفتاح ذكاء Google Gemini API Key (اختياري، يوجد مفتاح مدمج):
                </label>
                <input
                  type="password"
                  value={config.geminiKey}
                  onChange={(e) => setConfig({ ...config, geminiKey: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-xs font-mono"
                  placeholder="AIzaSy... أو AQ..."
                />
                <p className="text-xs text-slate-400 mt-1">
                  المفتاح الافتراضي مدمج تلقائياً (gemini-3.6-flash)، ويمكنك إدخال مفتاحك الخاص في أي وقت.
                </p>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم حفظ الإعدادات بنجاح!</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetSettings}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold"
                >
                  استعادة الإعدادات الافتراضية
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm"
                  >
                    حفظ وتطبيق
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
