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

  // Initialize: Load default or recent business
  useEffect(() => {
    async function init() {
      const config = getServerConfig();
      setIsAiLive(Boolean(config.geminiKey && config.geminiKey.length > 10));

      const res = await fetchDalilakBusinesses({ limit: 1 });
      setIsCoreLive(res.isLive);

      const initialBusiness = res.data[0] || getOfflineDemoBusinesses()[0];
      handleSelectBusiness(initialBusiness);
    }
    init();
  }, []);

  // Handle business selection
  const handleSelectBusiness = async (business: DalilakBusiness) => {
    setCurrentBusiness(business);

    // Try loading saved progress from Ecosystem Storage
    const saved = await loadActivityProgress(business.id);
    if (saved && saved.calendar.length > 0) {
      setProgress(saved);
    } else {
      // Auto-generate initial strategic baseline for instant delight
      await handleGeneratePlan(business, 'friendly_baladi');
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
        onResetBusiness={() => setCurrentBusiness(null)}
        isAiLive={isAiLive}
        isCoreLive={isCoreLive}
      />

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
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
              hasExistingPlan={Boolean(progress && progress.calendar.length > 0)}
            />

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
                  <ReadyPostsTabs readyPosts={progress.readyPosts} />
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
