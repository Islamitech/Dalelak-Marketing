import React, { useState } from 'react';
import {
  Sparkles,
  Megaphone,
  Volume2,
  Users,
  Target,
  Clock,
  Palette,
  Copy,
  Check,
  Edit3,
  Sliders,
} from 'lucide-react';
import { MarketingPersona, MarketingTone } from '../types';
import { MARKETING_TONES } from '../utils/egyptianDialectPrompts';

interface PersonaStrategyPanelProps {
  persona: MarketingPersona;
  onUpdatePersona: (updated: MarketingPersona) => void;
  onRegenerateWithTone: (tone: MarketingTone) => void;
  isGenerating: boolean;
}

export const PersonaStrategyPanel: React.FC<PersonaStrategyPanelProps> = ({
  persona,
  onUpdatePersona,
  onRegenerateWithTone,
  isGenerating,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedSlogan, setEditedSlogan] = useState<string>(persona.slogan);
  const [editedUsp, setEditedUsp] = useState<string>(persona.uniqueSellingProposition);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleSaveEdits = () => {
    onUpdatePersona({
      ...persona,
      slogan: editedSlogan,
      uniqueSellingProposition: editedUsp,
    });
    setIsEditing(false);
  };

  const currentToneInfo =
    MARKETING_TONES.find((t) => t.id === persona.toneOfVoice) || MARKETING_TONES[0];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
      
      {/* Section Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              استراتيجية الهوية التسويقية ونبرة الصوت
            </h3>
            <p className="text-xs text-slate-500">
              تمت هندسة هذه الاستراتيجية باللهجة والأسلوب الأنسب للجمهور المستهدف
            </p>
          </div>
        </div>

        {/* Tone Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" />
            نبرة الصوت:
          </span>
          <div className="flex gap-1 flex-wrap">
            {MARKETING_TONES.map((tone) => (
              <button
                key={tone.id}
                onClick={() => onRegenerateWithTone(tone.id)}
                disabled={isGenerating}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  persona.toneOfVoice === tone.id
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={tone.description}
              >
                {tone.badge}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slogan Banner */}
      <div className="relative p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border border-sky-100">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">
              الشعار الإعلاني المقترح (Campaign Slogan)
            </span>
            {isEditing ? (
              <input
                type="text"
                value={editedSlogan}
                onChange={(e) => setEditedSlogan(e.target.value)}
                className="w-full text-base sm:text-lg font-black text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-sky-300 focus:outline-hidden"
              />
            ) : (
              <p className="text-base sm:text-xl font-black text-slate-900 leading-relaxed">
                "{persona.slogan}"
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isEditing ? (
              <button
                onClick={handleSaveEdits}
                className="px-3 py-1 rounded-lg bg-sky-600 text-white text-xs font-bold"
              >
                حفظ
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
                title="تعديل الشعار"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => handleCopy(persona.slogan, 'slogan')}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
              title="نسخ الشعار"
            >
              {copiedKey === 'slogan' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3 Grid Pillars: Tone, Audience, USP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Pillar 1: Tone & Brand Voice */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Volume2 className="w-4 h-4 text-sky-600" />
            <span>نبرة الخطاب والتواصل</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {persona.brandVoice}
          </p>
          <div className="pt-2 border-t border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">
              مفردات مقترحة للتكرار:
            </span>
            <div className="flex gap-1 flex-wrap">
              {currentToneInfo.keywords.map((kw, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-700">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pillar 2: Target Audience */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>الفئة المستهدفة واحتياجاتها</span>
          </div>
          <p className="text-xs text-slate-600">
            {persona.targetAudience.demographics}
          </p>
          
          <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
            <div>
              <span className="text-[11px] font-bold text-rose-600 block">
                مخاوف العميل (Pain Points):
              </span>
              <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 pr-1">
                {persona.targetAudience.painPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Pillar 3: USP & Advantage */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>الميزة التنافسية (USP)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {persona.uniqueSellingProposition}
          </p>

          <div className="pt-2 border-t border-slate-200/60 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>مواعيد النشر المفضلة:</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {persona.recommendedPostingSchedule}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
