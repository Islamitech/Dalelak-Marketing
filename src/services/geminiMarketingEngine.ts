import { GoogleGenAI } from '@google/genai';
import {
  ContentCalendarDay,
  MarketingPersona,
  MarketingTone,
  ReadySocialPost,
  WhatsAppCampaign,
} from '../types';
import { generateLocalEgyptianStrategy, MARKETING_TONES } from '../utils/egyptianDialectPrompts';
import { getServerConfig } from './dalilakService';

export interface GenerateMarketingPlanOptions {
  businessName: string;
  category: string;
  city?: string;
  tone: MarketingTone;
  focusKeywords?: string;
  customNotes?: string;
}

export interface GeneratedMarketingPlanResult {
  persona: MarketingPersona;
  calendar: ContentCalendarDay[];
  readyPosts: ReadySocialPost[];
  whatsappCampaigns: WhatsAppCampaign[];
  source: 'gemini-ai' | 'smart-egyptian-engine';
}

/**
 * Helper to call Gemini REST API with timeout
 */
async function callGeminiRestApi(
  apiKey: string,
  model: string,
  prompt: string,
  timeoutMs = 9000
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          responseMimeType: 'application/json',
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (e) {
    clearTimeout(timer);
    return null;
  }
}

/**
 * Generate full comprehensive marketing strategy via Google Gemini with seamless fallback
 */
export async function generateComprehensiveMarketingPlan(
  options: GenerateMarketingPlanOptions
): Promise<GeneratedMarketingPlanResult> {
  const { businessName, category, city = 'مصر', tone, focusKeywords, customNotes } = options;
  const config = getServerConfig();
  const apiKey = config.geminiKey;

  const selectedTone = MARKETING_TONES.find((t) => t.id === tone) || MARKETING_TONES[0];

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const prompt = `
أنت خبير استراتيجي أول في التسويق الرقمي وكبير كتاب الإعلانات (Chief Copywriter) في مصر لمنصة "دليلك".
مهمتك إعداد خطة تسويقية متكاملة واستراتيجية محتوى شهرية (30 يوماً) لنشاط تجاري بالسوق المصري.

بيانات المنشأة:
- اسم النشاط: "${businessName}"
- التصنيف والنشاط: "${category}"
- المحافظة أو المدينة: "${city}"
- نبرة الخطاب المطلوبة: "${selectedTone.name}" (${selectedTone.description})
${focusKeywords ? `- كلمات وخدمات تركيز: "${focusKeywords}"` : ''}
${customNotes ? `- ملاحظات إضافية من العميل: "${customNotes}"` : ''}

المطلوب بدقة:
1. توليد هوية تسويقية متكاملة (شعار رنان باللهجة المصرية، نبرة صوت، الجمهور المستهدف والمخاوف والرغبات، القيمة التنافسية).
2. جدول محتوى شهري كامل لـ 30 يوماً مقسمة بالتساوي على الركائز الأربع:
   - engagement (المحتوى التفاعلي والمسابقات)
   - showcase (استعراض المنتجات والجودة وكواليس العمل)
   - offers (العروض والخصومات الجبارة مع CTA حاسم)
   - social_proof (آراء العملاء والتقييمات وشهادات الثقة)
   لكل يوم: اليوم (1-30)، الركيزة، العنوان، الهوك (الجملة الافتتاحية الخاطفة)، نص البوست باللهجة المصرية الجميلة، نداء العمل (CTA)، فكرة الصورة أو الفيديو، وهاشتاجات.
3. 3 منشورات جاهزة للنشر الفوري (فيسبوك، إنستغرام، تيك توك ريلز).
4. 4 رسائل واتساب تسويقية متخصصة (عميل جديد، إعادة تنشيط، طلب تقييم جوجل، رسالة إغلاق بيعي موجهة لصاحب النشاط).

أجب بصيغة JSON فقط، بدون أي شروحات خارج الكود، بالهيكل التالي:
{
  "persona": {
    "businessName": "${businessName}",
    "category": "${category}",
    "slogan": "...",
    "brandVoice": "...",
    "toneOfVoice": "${tone}",
    "targetAudience": {
      "demographics": "...",
      "painPoints": ["...", "..."],
      "desires": ["...", "..."]
    },
    "uniqueSellingProposition": "...",
    "recommendedPostingSchedule": "...",
    "suggestedColors": {
      "primary": "#0284c7",
      "secondary": "#059669",
      "accent": "#f59e0b"
    }
  },
  "calendar": [
    {
      "day": 1,
      "pillar": "engagement",
      "pillarTitle": "تفاعلي ومسابقات وتوعية",
      "headline": "...",
      "hookText": "...",
      "bodyText": "...",
      "callToAction": "...",
      "visualDirection": "...",
      "hashtags": ["#...", "#..."],
      "bestTimeToPost": "7:00 مساءً"
    }
  ],
  "readyPosts": [
    {
      "id": "post-fb",
      "platform": "facebook",
      "title": "...",
      "badge": "📘 فيسبوك",
      "content": "...",
      "hashtags": ["#..."],
      "imageIdea": "..."
    }
  ],
  "whatsappCampaigns": [
    {
      "id": "wa-1",
      "title": "...",
      "categoryTag": "...",
      "targetAudience": "...",
      "messageText": "...",
      "intendedGoal": "..."
    }
  ]
}
`;

      let jsonText: string | null = null;

      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });
        jsonText = response.text || null;
      } catch (sdkErr) {
        // Fallback to fast REST cascade
        const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];
        for (const model of candidateModels) {
          jsonText = await callGeminiRestApi(apiKey, model, prompt, 8000);
          if (jsonText) break;
        }
      }

      if (jsonText) {
        const cleaned = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned);

        if (parsed?.persona && Array.isArray(parsed?.calendar) && parsed.calendar.length > 0) {
          return {
            persona: parsed.persona,
            calendar: parsed.calendar,
            readyPosts: parsed.readyPosts || [],
            whatsappCampaigns: parsed.whatsappCampaigns || [],
            source: 'gemini-ai',
          };
        }
      }
    } catch (err) {
      console.warn('Gemini generation encountered an issue, falling back to Egyptian engine:', err);
    }
  }

  // Instant offline fallback to authentic Egyptian strategic engine
  const localData = generateLocalEgyptianStrategy(businessName, category, city, tone);
  return {
    ...localData,
    source: 'smart-egyptian-engine',
  };
}
