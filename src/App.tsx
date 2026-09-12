import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Store,
  Calendar,
  Megaphone,
  Share2,
  MessageSquare,
  FileText,
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  ContentCalendarDay,
  DalilakBusiness,
  EcosystemActivityProgress,
  MarketingPersona,
  MarketingTone,
} from './types';
import {
  fetchDalilakBusinesses,
  loadActivityProgress,
  saveActivityProgress,
  getOfflineDemoBusinesses,
  getServerConfig,
} from './services/dalilakService';
import { generateComprehensiveMarketingPlan } from './services/geminiMarketingEngine';
import { Header } from './components/Header';
import { DalilakActivitiesModal } from './components/DalilakActivitiesModal';
import { BusinessOverviewCard } from './components/BusinessOverviewCard';
import { PersonaStrategyPanel } from './components/PersonaStrategyPanel';
import { ContentCalendarView } from './components/ContentCalendarView';
import { ReadyPostsTabs } from './components/ReadyPostsTabs';
import { WhatsAppCampaignsTab } from './components/WhatsAppCampaignsTab';
import { PromoteToCoreButton } from './components/PromoteToCoreButton';
import { ExportReportModal } from './components/ExportReportModal';

export function App() {
  const [currentBusiness, setCurrentBusiness] = useState<DalilakBusiness | null>(null);
  const [progress, setProgress] = useState<EcosystemActivityProgress | null>(null);
  const [isActivitiesModalOpen, setIsActivitiesModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeMainTab, setActiveMainTab] = useState<'calendar' | 'persona' | 'posts' | 'whatsapp'>('calendar');

  const [isCoreLive, setIsCoreLive] = useState<boolean>(true);
  const [isAiLive, setIsAiLive] = useState<boolean>(true);

  // Initialize: Check server connectivity only without auto-selecting or consuming AI
  useEffect(() => {
    async function init() {
      const config = getServerConfig();
      setIsAiLive(Boolean(config.geminiKey && config.geminiKey.length > 20));

      const res = await fetchDalilakBusinesses({ limit: 1 });
      setIsCoreLive(res.isLive);
    }
    init();
  }, []);

  // Handle business selection (loads saved cache only, no AI generation until user clicks button)
  const handleSelectBusiness = async (business: DalilakBusiness) => {
    setCurrentBusiness(business);

    // Load saved progress from Ecosystem Storage if already generated previously
    const saved = await loadActivityProgress(business.id);
    if (saved && saved.calendar && saved.calendar.length > 0) {
      setProgress(saved);
    } else {
      // Do NOT auto-generate; wait for user explicit click
      setProgress(null);
    }
  };

  // Generate marketing strategy and 30-day calendar
  const handleGeneratePlan = async (
    targetBusiness = currentBusiness,
    tone: MarketingTone = progress?.persona?.toneOfVoice || 'friendly_baladi'
  ) => {
    if (!targetBusiness) return;

    setIsGenerating(true);
    try {
      const result = await generateComprehensiveMarketingPlan({
        businessName: targetBusiness.name_ar || targetBusiness.name_en || 'النشاط',
        category: targetBusiness.category || 'عام',
        city: targetBusiness.city || targetBusiness.governorate || 'مصر',
        tone,
        description: targetBusiness.description,
      });

      const newProgress: EcosystemActivityProgress = {
        businessId: targetBusiness.id,
        businessName: targetBusiness.name_ar || targetBusiness.name_en || 'النشاط',
        lastUpdated: new Date().toISOString(),
        persona: result.persona,
        calendar: result.calendar,
        readyPosts: result.readyPosts,
        whatsappCampaigns: result.whatsappCampaigns,
        isPromotedToCore: progress?.isPromotedToCore || false,
      };

      setProgress(newProgress);
      await saveActivityProgress(newProgress);
      
      const config = getServerConfig();
      setIsAiLive(Boolean(config.geminiKey && config.geminiKey.startsWith('AIzaSy')));
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Update Persona
  const handleUpdatePersona = async (updatedPersona: MarketingPersona) => {
    if (!progress || !currentBusiness) return;
    const updated: EcosystemActivityProgress = {
      ...progress,
      persona: updatedPersona,
      lastUpdated: new Date().toISOString(),
    };
    setProgress(updated);
    await saveActivityProgress(updated);
  };

  // Update a specific day in calendar
  const handleUpdateDay = async (dayNumber: number, updatedDay: ContentCalendarDay) => {
    if (!progress || !currentBusiness) return;
    const updatedCalendar = progress.calendar.map((item) =>
      item.day === dayNumber ? updatedDay : item
    );
    const updated: EcosystemActivityProgress = {
      ...progress,
      calendar: updatedCalendar,
      lastUpdated: new Date().toISOString(),
    };
    setProgress(updated);
    await saveActivityProgress(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Tajawal',sans-serif]">
      
      {/* Top Daylight Header */}
      <Header
        currentBusiness={currentBusiness}
        onOpenActivitiesModal={() => setIsActivitiesModalOpen(true)}
        onResetBusiness={() => {
          setCurrentBusiness(null);
          setProgress(null);
        }}
        isAiLive={isAiLive}
        isCoreLive={isCoreLive}
      />

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Gemini API Key Banner if not connected to live Gemini */}
        {!isAiLive && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-amber-900">
                  تفعيل التوليد المباشر بالذكاء الاصطناعي (Google Gemini AI)
                </h4>
                <p className="text-xs text-amber-700">
                  للحصول على تحليل ذكي فوري ومخصص 100% لنشاطك (بدون أي قوالب مسبقة)، أدخل مفتاح Gemini API هنا:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="password"
                placeholder="أدخل مفتاح AIzaSy..."
                id="quick-gemini-key-input"
                className="px-3 py-2 text-xs rounded-xl border border-amber-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono flex-1 md:w-64"
              />
              <button
                onClick={async () => {
                  const input = document.getElementById('quick-gemini-key-input') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    const key = input.value.trim();
                    const { saveServerConfig } = await import('./services/dalilakService');
                    saveServerConfig({ geminiKey: key });
                    setIsAiLive(true);
                    if (currentBusiness) {
                      handleGeneratePlan(currentBusiness);
                    }
                  }
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs"
              >
                تفعيل وتوليد الآن
              </button>
            </div>
          </div>
        )}

        {/* If no business is selected */}
        {!currentBusiness ? (
          <div className="py-24 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto shadow-inner">
              <Store className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              مرحباً بك في استوديو التسويق واستراتيجية المحتوى • دليلك
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              اختر نشاطاً تجارياً مسجلاً في دليلك للبدء في توليد هوية تسويقية متكاملة، ونبرة صوت مصرية أصيلة، وخطة محتوى كاملة لـ 30 يوماً.
            </p>
            <button
              onClick={() => setIsActivitiesModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 active:scale-95 transition-all"
            >
              <Store className="w-5 h-5" />
              <span>اختيار نشاط تجاري للبدء</span>
            </button>
          </div>
        ) : (
          <>
            {/* Top Business Card */}
            <BusinessOverviewCard
              business={currentBusiness}
              onChangeBusiness={() => setIsActivitiesModalOpen(true)}
              onGeneratePlan={() => handleGeneratePlan()}
              isGenerating={isGenerating}
              hasExistingPlan={Boolean(progress && progress.calendar && progress.calendar.length > 0)}
            />

            {/* If no plan generated yet for this business and not currently generating */}
            {!progress && !isGenerating && (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 shadow-xs animate-in fade-in">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    جاهز لتحليل النشاط وتوليد الخطة التسويقية
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    اضغط على زر التوليد للبدء في تشغيل محرك الذكاء الاصطناعي وصناعة هوية المنشأة وخطة الـ 30 يوماً المخصصة.
                  </p>
                </div>
                <button
                  onClick={() => handleGeneratePlan()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>بدء التوليد بالذكاء الاصطناعي الآن</span>
                </button>
              </div>
            )}

            {/* If currently generating */}
            {isGenerating && !progress && (
              <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-4 shadow-xs animate-in fade-in">
                <RefreshCw className="w-10 h-10 text-sky-600 animate-spin mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    جاري دراسة النشاط وصياغة الخطة التسويقية بالذكاء الاصطناعي...
                  </h3>
                  <p className="text-xs text-slate-500">
                    يتم الآن تحليل التصنيف والخدمات وتوليد 30 منشوراً تخصصياً وهوية إعلانية متكاملة.
                  </p>
                </div>
              </div>
            )}

            {/* Sub-bar Actions & Navigation Tabs */}
            {progress && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
                
                {/* Main Navigation Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                  <button
                    onClick={() => setActiveMainTab('calendar')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                      activeMainTab === 'calendar'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>تقويم المحتوى (30 يوماً)</span>
                  </button>

                  <button
                    onClick={() => setActiveMainTab('persona')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                      activeMainTab === 'persona'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Megaphone className="w-4 h-4" />
                    <span>استراتيجية الهوية والشعار</span>
                  </button>

                  <button
                    onClick={() => setActiveMainTab('posts')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                      activeMainTab === 'posts'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Share2 className="w-4 h-4" />
                    <span>المنشورات الجاهزة</span>
                  </button>

                  <button
                    onClick={() => setActiveMainTab('whatsapp')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                      activeMainTab === 'whatsapp'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>حملات الواتساب</span>
                  </button>
                </div>

                {/* Promotion & Export Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
                  >
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>تصدير تقرير PDF</span>
                  </button>

                  <PromoteToCoreButton
                    business={currentBusiness}
                    progress={progress}
                    onPromoted={() => {
                      if (progress) {
                        setProgress({ ...progress, isPromotedToCore: true });
                      }
                    }}
                  />
                </div>

              </div>
            )}

            {/* Active Tab Panel */}
            {progress && (
              <div className="space-y-6">
                {activeMainTab === 'calendar' && (
                  <ContentCalendarView
                    calendar={progress.calendar}
                    onUpdateDay={handleUpdateDay}
                    business={currentBusiness}
                  />
                )}

                {activeMainTab === 'persona' && progress.persona && (
                  <PersonaStrategyPanel
                    persona={progress.persona}
                    onUpdatePersona={handleUpdatePersona}
                    onRegenerateWithTone={(newTone) => handleGeneratePlan(currentBusiness, newTone)}
                    isGenerating={isGenerating}
                  />
                )}

                {activeMainTab === 'posts' && (
                  <ReadyPostsTabs
                    readyPosts={progress.readyPosts}
                    business={currentBusiness}
                  />
                )}

                {activeMainTab === 'whatsapp' && (
                  <WhatsAppCampaignsTab
                    campaigns={progress.whatsappCampaigns}
                    business={currentBusiness}
                  />
                )}
              </div>
            )}
          </>
        )}

      </main>

      {/* Activity Selection Modal */}
      <DalilakActivitiesModal
        isOpen={isActivitiesModalOpen}
        onClose={() => setIsActivitiesModalOpen(false)}
        onSelectBusiness={handleSelectBusiness}
      />

      {/* Export Report Modal */}
      {currentBusiness && progress && (
        <ExportReportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          business={currentBusiness}
          progress={progress}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          منظومة تطبيقات دليلك المستقلة • المرحلة 1: Dalelak Marketing AI Studio
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          مستودع المشروع: github.com/Islamitech/Dalelak-Marketing • وضع نهاري ناصع 100%
        </p>
      </footer>

    </div>
  );
}
export default App;
