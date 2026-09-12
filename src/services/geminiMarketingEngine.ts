import {
  ContentCalendarDay,
  ContentPillarType,
  MarketingPersona,
  MarketingTone,
  ReadySocialPost,
  WhatsAppCampaign,
} from '../types';
import {
  generateCategoryAwareLocalStrategy,
  MARKETING_TONES,
  CONTENT_PILLARS_METADATA,
} from '../utils/egyptianDialectPrompts';
import { getAvailableGeminiKeys } from './dalilakService';

export interface GenerateMarketingPlanOptions {
  businessName: string;
  category: string;
  city?: string;
  tone: MarketingTone;
  description?: string;
  focusKeywords?: string;
  customNotes?: string;
}

export interface GeneratedMarketingPlanResult {
  persona: MarketingPersona;
  calendar: ContentCalendarDay[];
  readyPosts: ReadySocialPost[];
  whatsappCampaigns: WhatsAppCampaign[];
  source: 'gemini-ai' | 'smart-egyptian-engine';
  errorDetails?: string;
  modelUsed?: string;
}

/**
 * Active models priority list:
 * gemini-3.5-flash and gemini-flash-latest have full active quota,
 * while gemini-3.6-flash is in fallback if quota allows.
 */
export const ACTIVE_GEMINI_MODELS = [
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.6-flash',
  'gemini-flash-lite-latest',
];

/**
 * Call Gemini REST endpoint with timeout, thinking token suppression for speed, and candidate models
 */
async function callGeminiRestApi(
  apiKey: string,
  model: string,
  prompt: string,
  timeoutMs = 45000
): Promise<{ text: string | null; error?: string }> {
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
          temperature: 0.7,
          responseMimeType: 'application/json',
          maxOutputTokens: 8192,
          thinkingConfig: {
            thinkingBudget: 0, // Suppress hidden thinking tokens for maximum speed and to prevent token limit cuts
          },
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);
    if (!res.ok) {
      const errBody = await res.text();
      let errorMsg = `HTTP ${res.status}`;
      try {
        const parsed = JSON.parse(errBody);
        if (parsed?.error?.message) errorMsg = parsed.error.message;
      } catch (_) {}
      console.warn(`Gemini API error (${model} - ${res.status}):`, errorMsg);
      return { text: null, error: `[${model}]: ${errorMsg}` };
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    return { text, error: text ? undefined : 'لم يرجع النموذج أي محتوى نصي' };
  } catch (e: any) {
    clearTimeout(timer);
    const msg = e.name === 'AbortError' ? 'انتهت مهلة استجابة Gemini (45 ثانية)' : (e.message || String(e));
    return { text: null, error: msg };
  }
}

/**
 * Ensures the calendar contains exactly 30 days by building upon the AI generated days
 */
function completeFullMonthCalendar(
  days: ContentCalendarDay[],
  businessName: string
): ContentCalendarDay[] {
  if (!Array.isArray(days) || days.length === 0) return [];
  if (days.length >= 30) return days.slice(0, 30);

  const pillarsOrder: ContentPillarType[] = ['engagement', 'showcase', 'offers', 'social_proof'];
  const fullCalendar: ContentCalendarDay[] = [...days];

  for (let d = days.length + 1; d <= 30; d++) {
    const sourceIndex = (d - 1) % days.length;
    const sourceDay = days[sourceIndex];
    const targetPillar = pillarsOrder[(d - 1) % pillarsOrder.length];

    let headline = sourceDay.headline;
    let hookText = sourceDay.hookText;
    let bodyText = sourceDay.bodyText;
    let cta = sourceDay.callToAction;

    // Add weekly evolution touches for the second half of the month
    if (d > 15) {
      if (targetPillar === 'engagement') {
        headline = `سؤال وتفاعل الأسبوع: ${sourceDay.headline}`;
        hookText = `شاركونا رأيكم وتجاربكم مع ${businessName}: ${sourceDay.hookText}`;
      } else if (targetPillar === 'showcase') {
        headline = `كواليس الجودة والتميز: ${sourceDay.headline}`;
      } else if (targetPillar === 'offers') {
        headline = `فرصة حجز مميزة: ${sourceDay.headline}`;
        cta = `بادر بالتواصل مع ${businessName} الآن واحجز موعدك!`;
      } else {
        headline = `قصة نجاح وثقة متبادلة: ${sourceDay.headline}`;
      }
    }

    fullCalendar.push({
      day: d,
      pillar: targetPillar,
      pillarTitle: CONTENT_PILLARS_METADATA[targetPillar]?.title || sourceDay.pillarTitle,
      headline,
      hookText,
      bodyText,
      callToAction: cta,
      visualDirection: sourceDay.visualDirection,
      hashtags: sourceDay.hashtags || [`#${businessName.replace(/\s+/g, '_')}`],
      bestTimeToPost: d % 2 === 0 ? '7:00 مساءً' : '8:30 مساءً',
      isCompleted: false,
    });
  }

  return fullCalendar;
}

/**
 * Generate full comprehensive marketing strategy via Google Gemini with deep domain awareness
 */
export async function generateComprehensiveMarketingPlan(
  options: GenerateMarketingPlanOptions
): Promise<GeneratedMarketingPlanResult> {
  const { businessName, category, city = 'مصر', tone, description, focusKeywords, customNotes } = options;
  const availableKeys = getAvailableGeminiKeys();
  const selectedTone = MARKETING_TONES.find((t) => t.id === tone) || MARKETING_TONES[0];

  if (availableKeys.length > 0) {
    const prompt = `
أنت كبير مديري التسويق الرقمي وكتاب الإعلانات (Senior Marketing Director & Lead Copywriter) في مصر.
مهمتك: دراسة هذا النشاط التجاري بدقة شديدة وتوليد هوية تسويقية متكاملة وخطة محتوى ذكية شهرية ونصوص جاهزة للنشر مخصصة له 100% دون أي قوالب مسبقة أو عبارات عامة.

📌 بيانات المنشأة الحقيقية:
- اسم المنشأة: "${businessName}"
- التصنيف الرسمي: "${category}"
- وصف النشاط والخدمات: "${description || 'نشاط تجاري معتمد يقدم خدمات متخصصة في مجاله'}"
- النطاق الجغرافي / المدينة: "${city}"
- نبرة الخطاب المطلوبة: "${selectedTone.name}" (${selectedTone.description})
${focusKeywords ? `- خدمات أو كلمات تركيز إضافية: "${focusKeywords}"` : ''}
${customNotes ? `- ملاحظات إضافية: "${customNotes}"` : ''}

⛔ ميثاق وقواعد التوليد الشامل لجميع الأنشطة (UNIVERSAL ADAPTIVE DOMAIN CHARTER):
1. **الاستيعاب والتموضع التخصصي الدقيق لنشاط المنشأة (Strict Contextual Grounding)**:
   - حلل اسم المنشأة وتصنيفها ووصفها وخدماتها بدقة مطلقة، وتحدث حصرياً بلغة ومصطلحات ومشاكل وتطلعات هذا النشاط بعينه دون أي تعميم أو قوالب مسبقة.
   - إذا كان النشاط طبياً أو علاجياً أو صحياً أو تأهيلياً: تدور الركائز والنصوص حول صحة المريض، التشخيص الدقيق، الرعاية، أحدث الأجهزة والتقنيات، الأمان، وتخفيف الآلام.
   - إذا كان النشاط مطعماً أو كافيه أو أغذية: تدور حول الطعم، جودة المكونات الطازجة، النظافة، واللمة والضيافة.
   - إذا كان مقاولات أو تشطيبات أو ديكور أو هندسة: تدور حول دقة التنفيذ، جودة الخامات، الالتزام بالمواعيد، روعة التصميم، واستغلال المساحات.
   - إذا كان عقارات أو تطوير أو وساطة: تدور حول الموقع الاستراتيجي، القيمة الاستثمارية، المصداقية، وتسهيلات السداد.
   - إذا كان تعليماً أو تدريباً أو حضانات أو كورسات: تدور حول بناء المهارات، التفوق، الكادر المؤهل، والبيئة التعليمية المحفزة.
   - إذا كان سيارات أو صيانة أو خدمات نقل: تدور حول الأمان على الطريق، دقة الفحص، قطع الغيار الأصلية، واحترافية الصيانة.
   - إذا كان محاماة أو استشارات قانونية أو محاسبة وضرائب: تدور حول حماية الحقوق، الخبرة النظامية، السرية التامة، والحلول الاحترافية.
   - إذا كان تجزئة أو أزياء أو إلكترونيات أو أجهزة: تدور حول الجودة، أحدث الموديلات، الضمان، وحل المشكلات اليومية للمشتري.
   - إذا كان رياضة أو جيم أو لياقة بدنية: تدور حول النشاط، بناء الجسم، المتابعة مع مدربين متخصصين، وأسلوب الحياة الصحي.
   - لأي نشاط خدمي، حرفي، أو تجاري آخر: استنبط جوهر القيمة الحقيقية التي يقدمها للعملاء في السوق المصري دون أي خلط مع مجالات أخرى.
2. **اللهجة المصرية الذكية والمقنعة**:
   - اكتب بالعامية المصرية الراقية والذكية التي تناسب طبيعة المنشأة والمستهلك في ${city}.
3. **التوازن بين الركائز الأربع (Four Content Pillars)**:
   - engagement: أسئلة، توعية متخصصة في مجال النشاط، نصائح تفيد العميل.
   - showcase: إبراز جودة الخدمات/المنتجات، كواليس العمل والتميز، خبرات الفريق.
   - offers: باقات حجز، عروض حصرية، خصومات مع نداء عمل مباشر وواضح (CTA).
   - social_proof: آراء وتجارب العملاء الحقيقيين، الثقة، وتقييمات خرائط جوجل ومنصة دليلك.
4. **نظام التقسيم المحكم**:
   - اكتب أول 15 يوماً متكاملة وغنية ومفصلة في مصفوفة calendar، واجعل النصوص بليغة ومركزة لضمان كمال كود الـ JSON بالكامل دون انقطاع.

أجب بصيغة JSON حصراً بدون أي نصوص أو كود ماركداون خارجي، بالهيكل التالي:
{
  "persona": {
    "businessName": "${businessName}",
    "category": "${category}",
    "slogan": "شعار إعلاني رنان مصاغ خصيصاً لهذا النشاط ومجاله",
    "brandVoice": "وصف دقيق لنبرة صوت المنشأة وكيف تتحدث مع عملائها في هذا المجال",
    "toneOfVoice": "${tone}",
    "targetAudience": {
      "demographics": "من هم جمهور هذا النشاط بالتحديد في ${city}",
      "painPoints": ["نقطة ألم حقيقية 1", "نقطة 2", "نقطة 3"],
      "desires": ["النتيجة التي يتمناها العميل 1", "النتيجة 2", "النتيجة 3"]
    },
    "uniqueSellingProposition": "ما الذي يجعل هذا النشاط أفضل من أي منافس آخر في مجاله",
    "recommendedPostingSchedule": "المواعيد المثالية للنشر لهذا التخصص",
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
      "pillarTitle": "تفاعلي وتوعية متخصصة",
      "headline": "عنوان جذاب يخص هذا المجال تحديداً",
      "hookText": "جملة افتتاحية تخطف انتباه الجمهور المستهدف لهذا النشاط",
      "bodyText": "نص المنشور بالعامية المصرية المتقنة ذات الصلة التامة بالنشاط",
      "callToAction": "نداء العمل المناسب (حجز موعد، اتصال، استشارة)",
      "visualDirection": "فكرة الصورة أو الفيديو المناسبة تماماً للمنشأة",
      "hashtags": ["#هاشتاج1", "#هاشتاج2"],
      "bestTimeToPost": "7:00 مساءً"
    }
  ],
  "readyPosts": [
    {
      "id": "post-fb-real",
      "platform": "facebook",
      "title": "منشور فيسبوك الترويجي الرئيسي للنشاط",
      "badge": "📘 فيسبوك",
      "content": "نص المنشور الكامل بالعامية المصرية...",
      "hashtags": ["#..."],
      "imageIdea": "فكرة التصميم..."
    },
    {
      "id": "post-ig-real",
      "platform": "instagram",
      "title": "منشور إنستغرام بصري ومعلوماتي",
      "badge": "📸 إنستغرام",
      "content": "نص المنشور...",
      "hashtags": ["#..."],
      "imageIdea": "فكرة التصميم..."
    },
    {
      "id": "post-tt-real",
      "platform": "tiktok",
      "title": "سكريبت فيديو ريلز / تيك توك 30 ثانية",
      "badge": "🎵 تيك توك",
      "content": "السيناريو المقترح...",
      "hashtags": ["#..."],
      "imageIdea": "طريقة التصوير..."
    }
  ],
  "whatsappCampaigns": [
    {
      "id": "wa-1",
      "title": "رسالة حجز واستفسار ترحيبية",
      "categoryTag": "استفسار جديد",
      "targetAudience": "العملاء الذين استفسروا عبر الواتساب",
      "messageText": "نص الرسالة المناسب تماماً لمجال المنشأة...",
      "intendedGoal": "تأكيد الحجز والاستشارة"
    },
    {
      "id": "wa-2",
      "title": "رسالة متابعة ورعاية بعد الجلسة / الخدمة",
      "categoryTag": "متابعة ورعاية",
      "targetAudience": "العملاء بعد تلقي الخدمة",
      "messageText": "نص الرسالة...",
      "intendedGoal": "بناء ولاء ومتابعة الحالة"
    },
    {
      "id": "wa-3",
      "title": "رسالة طلب تقييم خرائط جوجل",
      "categoryTag": "تقييمات وسمعة",
      "targetAudience": "العميل الراضي بعد نجاح خدمته",
      "messageText": "نص الرسالة...",
      "intendedGoal": "تقييم 5 نجوم على Google Maps"
    }
  ]
}
`;

    let lastError = '';

    // Cascade through all available keys and active models
    for (const key of availableKeys) {
      for (const model of ACTIVE_GEMINI_MODELS) {
        try {
          const { text, error } = await callGeminiRestApi(key, model, prompt, 45000);
          if (error) {
            lastError = error;
            continue;
          }

          if (text) {
            let cleaned = text.trim();
            if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
            if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
            if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
            cleaned = cleaned.trim();

            const parsed = JSON.parse(cleaned);

            if (parsed?.persona && Array.isArray(parsed?.calendar) && parsed.calendar.length > 0) {
              const fullCalendar = completeFullMonthCalendar(parsed.calendar, businessName);

              return {
                persona: parsed.persona,
                calendar: fullCalendar,
                readyPosts: parsed.readyPosts || [],
                whatsappCampaigns: parsed.whatsappCampaigns || [],
                source: 'gemini-ai',
                modelUsed: model,
              };
            }
          }
        } catch (err: any) {
          console.warn(`Attempt with ${model} failed:`, err?.message);
          lastError = err?.message || String(err);
        }
      }
    }

    console.warn('All Gemini keys and models exhausted. Activating domain-aware local strategy. Last error:', lastError);
    const localData = generateCategoryAwareLocalStrategy(
      businessName,
      category,
      city,
      tone,
      description
    );
    return {
      ...localData,
      source: 'smart-egyptian-engine',
      errorDetails: `تعذر الاتصال بـ Gemini (${lastError || 'استنفاد المحاولات'})`,
    };
  }

  // If no key at all was configured
  const localData = generateCategoryAwareLocalStrategy(
    businessName,
    category,
    city,
    tone,
    description
  );
  return {
    ...localData,
    source: 'smart-egyptian-engine',
    errorDetails: 'لم يتم إدخال مفتاح Gemini API في الإعدادات',
  };
}
