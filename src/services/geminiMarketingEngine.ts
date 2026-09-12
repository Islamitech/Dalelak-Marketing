import { GoogleGenAI } from '@google/genai';
import {
  ContentCalendarDay,
  MarketingPersona,
  MarketingTone,
  ReadySocialPost,
  WhatsAppCampaign,
} from '../types';
import { generateCategoryAwareLocalStrategy, MARKETING_TONES } from '../utils/egyptianDialectPrompts';
import { getServerConfig, isGeminiKeyConfigured } from './dalilakService';

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
}

/**
 * Call Gemini REST endpoint with timeout and candidate models
 */
async function callGeminiRestApi(
  apiKey: string,
  model: string,
  prompt: string,
  timeoutMs = 12000
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
          temperature: 0.75,
          responseMimeType: 'application/json',
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);
    if (!res.ok) {
      console.warn(`Gemini REST error ${res.status}:`, await res.text());
      return null;
    }
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (e) {
    clearTimeout(timer);
    return null;
  }
}

/**
 * Generate full comprehensive marketing strategy via Google Gemini with deep domain awareness
 */
export async function generateComprehensiveMarketingPlan(
  options: GenerateMarketingPlanOptions
): Promise<GeneratedMarketingPlanResult> {
  const { businessName, category, city = 'مصر', tone, description, focusKeywords, customNotes } = options;
  const config = getServerConfig();
  const apiKey = (config.geminiKey || '').trim();

  const selectedTone = MARKETING_TONES.find((t) => t.id === tone) || MARKETING_TONES[0];

  if (apiKey && apiKey.length > 20) {
    try {
      const prompt = `
أنت كبير مديري التسويق الرقمي وكتاب الإعلانات (Senior Marketing Director & Lead Copywriter) في مصر.
مهمتك: دراسة هذا النشاط التجاري بدقة شديدة وتوليد خطة تسويقية شهرية كاملة (30 يوماً) واستراتيجية هوية مخصصة له 100% دون أي قوالب مسبقة أو عبارات عامة.

📌 بيانات المنشأة الحقيقية:
- اسم المنشأة: "${businessName}"
- التصنيف الرسمي: "${category}"
- وصف النشاط والخدمات: "${description || 'نشاط تجاري معتمد يقدم خدمات متخصصة في مجاله'}"
- النطاق الجغرافي / المدينة: "${city}"
- نبرة الخطاب المطلوبة: "${selectedTone.name}" (${selectedTone.description})
${focusKeywords ? `- خدمات أو كلمات تركيز إضافية: "${focusKeywords}"` : ''}
${customNotes ? `- ملاحظات إضافية: "${customNotes}"` : ''}

⛔ قواعد إلزامية صارمة في الصياغة (STRICT DOMAIN RULES):
1. **التخصص الدقيق 100% بحسب نوع النشاط**:
   - إذا كان النشاط **طبي أو صحي أو عيادة أو علاج طبيعي أو تأهيل أو أسنان**: كل النصوص، الهوكات، النصائح، والمنشورات يجب أن تدور حصرياً حول صحة المريض، تخفيف الآلام (مثل آلام الظهر، الرقبة، الانزلاق الغضروفي، تأهيل ما بعد العمليات والإصابات)، أحدث أجهزة العلاج الطبيعي واليدوي، نصائح الجلوس والحركة، كفاءة الطاقم الطبي، والراحة النفسية للمراجعين. **يُحظر تماماً ذكر أي كلمات تتعلق بالأكل أو الوجبات أو الطعم أو المنتجات الاستهلاكية!**
   - إذا كان النشاط **مطعم أو كافيه**: تدور النصوص حول النكهات، الطعم، جودة المكونات الطازجة، واللمة.
   - إذا كان النشاط **سيارات**: تدور حول الحماية، النظافة الفائقة، ولمعان النانو سيراميك.
   - إذا كان النشاط **تجميل وصالون**: تدور حول الإطلالة، العناية بالشعر والبشرة.
2. **اللهجة المصرية الذكية والمحبوبة**:
   - اكتب بالعامية المصرية الراقية المقنعة والمؤثرة، مع استخدام تعبيرات طبيعية ذكية تعكس مصداقية المنشأة وتشجع العميل على الحجز والتواصل.
3. **توزيع الركائز الأربع على مدار الـ 30 يوماً بالتناوب**:
   - engagement: أسئلة، توعية طبية/تخصصية، استشارات سريعة، نصائح ذهبية للجمهور.
   - showcase: استعراض الأجهزة، التقنيات، كواليس التعقيم والرعاية، خبرات الفريق.
   - offers: باقات حجز، كشف وفحص، استشارة أولى، عروض مميزة مع نداء عمل مباشر.
   - social_proof: تجارب تعافي ورضا المرضى/العملاء، شهادات ثقة، تقييمات خرائط جوجل.

أجب بصيغة JSON حصراً بدون أي كود ماركداون خارجي، بالهيكل التالي:
{
  "persona": {
    "businessName": "${businessName}",
    "category": "${category}",
    "slogan": "شعار إعلاني رنان مصاغ خصيصاً لهذا النشاط ومجاله",
    "brandVoice": "وصف دقيق لنبرة صوت المنشأة وكيف تتحدث مع عملائها في هذا المجال",
    "toneOfVoice": "${tone}",
    "targetAudience": {
      "demographics": "من هم جمهور هذا النشاط بالتحديد في ${city}",
      "painPoints": ["المشكلة الحقيقية 1 التي يعاني منها المريض/العميل", "المشكلة 2", "المشكلة 3"],
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
      "bodyText": "نص المنشور الكامل باللهجة المصرية المتقنة ذات الصلة التامة بالنشاط",
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
      "content": "نص المنشور الكامل...",
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
      "targetAudience": "المرضى / العملاء الذين استفسروا عبر الواتساب",
      "messageText": "نص الرسالة المناسب تماماً لمجال المنشأة...",
      "intendedGoal": "تأكيد الحجز المباشر"
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
    },
    {
      "id": "wa-4",
      "title": "عرض الباقة التسويقية لصاحب النشاط",
      "categoryTag": "إغلاق بيعي (B2B)",
      "targetAudience": "لصاحب المنشأة",
      "messageText": "نص الرسالة...",
      "intendedGoal": "عرض خدمات دليلك التسويقية"
    }
  ]
}
`;

      let jsonText: string | null = null;

      // Try SDK first with modern models
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });
        jsonText = response.text || null;
      } catch (sdkErr: any) {
        console.warn('Gemini SDK direct call failed, trying REST fallback:', sdkErr?.message);
        const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
        for (const model of candidateModels) {
          jsonText = await callGeminiRestApi(apiKey, model, prompt, 15000);
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
    } catch (err: any) {
      console.error('Gemini generation error:', err);
    }
  }

  // If no key or API failed, use strictly category-aware local intelligence
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
    errorDetails: !apiKey ? 'لم يتم إدخال مفتاح Gemini API' : 'تعذر الاتصال بـ Gemini API',
  };
}
