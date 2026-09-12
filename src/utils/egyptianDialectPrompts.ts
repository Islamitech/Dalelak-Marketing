import {
  ContentCalendarDay,
  ContentPillarType,
  MarketingPersona,
  MarketingTone,
  ReadySocialPost,
  WhatsAppCampaign,
} from '../types';

export interface ToneDefinition {
  id: MarketingTone;
  name: string;
  badge: string;
  description: string;
  keywords: string[];
  samplePhrase: string;
}

export const MARKETING_TONES: ToneDefinition[] = [
  {
    id: 'friendly_baladi',
    name: 'أسلوب ودي بلدي (عشم وجدعنة وترحاب)',
    badge: '🤝 جدعنة وعشم',
    description: 'أسلوب مصري أصيل يعتمد على دفء المعاملة، الترحيب الحار، والقرب من القلب كأنك بتكلم صاحبك أو جارك العزيز.',
    keywords: ['يا هلا بيك', 'تنورنا وتشرفنا', 'على رأسنا من فوق', 'أهل كرم', 'حبيبنا'],
    samplePhrase: 'يا مرحب بيك في بيتك التاني.. طلبك مجاب ومن العين دي قبل العين دي!',
  },
  {
    id: 'luxury_prestigious',
    name: 'أسلوب راقٍ وفخم (VIP ووجاهة)',
    badge: '👑 فخامة ووجاهة',
    description: 'أسلوب يركز على القيمة العالية، التفاصيل الدقيقة، الإتقان والتميز لجمهور يبحث عن الأفضل دائماً.',
    keywords: ['فخامة تليق بك', 'ذوق رفيع', 'تجربة استثنائية', 'أناقة لا تضاهى', 'اختيار الصفوة'],
    samplePhrase: 'لأنك تستحق الأرقى دائماً، صممنا كل تفصيلة لتمنحك شعور الرفاهية الذي يليق بك.',
  },
  {
    id: 'urgent_enthusiastic',
    name: 'أسلوب عروض ناري وحماسي (قنبلة التوفير)',
    badge: '🔥 حماس وعروض',
    description: 'أسلوب صاخب وجريء يولد شعور الفومو (FOMO) والاستعجال للاستفادة من أقوى الخصومات قبل نفاد الكمية.',
    keywords: ['قنبلة الموسم', 'الحق قبل ما يخلص', 'عرض ميتفوتش', 'وفر صح', 'ضرب نار'],
    samplePhrase: 'العرض اللي كسر الدنيا رجع تاني! متفوتش الفرصة والحق احجز قبل الزحمة!',
  },
  {
    id: 'witty_smart',
    name: 'أسلوب ذكي وفرفوش (خفة دم وتريند)',
    badge: '⚡ فرفشة وتريند',
    description: 'أسلوب شبابي مبهج يستغل التريندات المصرية بروح دعابة ذكية ومحببة بدون مبالغة.',
    keywords: ['روق على حالك', 'مزاجك رايق', 'سيبك من وجع الدماغ', 'الحل عندنا', 'على الرايق'],
    samplePhrase: 'ليه تعقدها والموضوع أصلاً بسيط؟ روق على نفسك وسيب الباقي علينا!',
  },
  {
    id: 'professional_direct',
    name: 'أسلوب احترافي ومباشر (ثقة وضمان)',
    badge: '🎯 ثقة وجودة',
    description: 'أسلوب يعتمد على لغة الحقائق، الضمانات الموثوقة، والسرعة في التنفيذ لرواد الأعمال والعائلات.',
    keywords: ['جودة معتمدة', 'ضمان حقيقي', 'دقة بالمواعيد', 'خبرة سنين', 'ثقة لا تتزعزع'],
    samplePhrase: 'نلتزم بأعلى معايير الجودة وخدمة ما بعد البيع، لأن رضاك التزامنا الأول.',
  },
];

export const CONTENT_PILLARS_METADATA: Record<
  ContentPillarType,
  { title: string; color: string; bg: string; icon: string; description: string }
> = {
  engagement: {
    title: 'تفاعلي ومسابقات وتوعية',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    icon: 'MessageCircle',
    description: 'أسئلة، تصويتات، نصائح ذهبية، ومسابقات لتنشيط خوارزميات التفاعل وجذب متابعين جدد.',
  },
  showcase: {
    title: 'استعراض المنتجات والخدمات',
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
    icon: 'Sparkles',
    description: 'كواليس العمل، طريقة التحضير، جودة الخامات، وإبراز لمسات التميز الفريدة.',
  },
  offers: {
    title: 'عروض حصرية وخصومات',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    icon: 'Flame',
    description: 'عروض الجمعة، تخفيضات الأسبوع، باقات التوفير مع نداء واضح للحجز والشراء الفوري.',
  },
  social_proof: {
    title: 'آراء العملاء والمصداقية',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    icon: 'ShieldCheck',
    description: 'ريفيوهات حقيقية، صور عملاء سعداء، وتوثيق الثقة عبر خرائط جوجل ومنصة دليلك.',
  },
};

export type BusinessDomain = 'medical' | 'dining' | 'automotive' | 'beauty' | 'retail' | 'general';

export function detectBusinessDomain(name: string, category: string, description?: string): BusinessDomain {
  const combined = `${name || ''} ${category || ''} ${description || ''}`.toLowerCase();

  // 1. Medical & Health
  if (
    /علاج طبيعي|تأهيل|عياد|طبيب|دكتور|طبي|أسنان|مستشفى|مركز طبي|صحة|صيدلية|جلدية|عظام|باطنة|أطفال|نفسي|علاج|مفاصل|عمود فقري|غضروف/i.test(
      combined
    )
  ) {
    return 'medical';
  }

  // 2. Dining & Food
  if (
    /مطعم|مشويات|أكل|كافيه|مقهى|قهوة|طعام|مشاوي|شاورما|برجر|بيتزا|حلويات|عصير|فطير|مخبز|ساندوتش/i.test(
      combined
    )
  ) {
    return 'dining';
  }

  // 3. Automotive
  if (/سيارات|غسيل سيارات|تلميع|مغسلة|نانو سيراميك|ورشة|ميكانيكا|زيوت|كاوتش|كار كير/i.test(combined)) {
    return 'automotive';
  }

  // 4. Beauty & Salon
  if (/صالون|كوافير|تجميل|سبا|ميكب|حلاقة|باربر|عناية بالبشرة|شعر|أظافر/i.test(combined)) {
    return 'beauty';
  }

  // 5. Retail & Fashion
  if (/ملابس|أزياء|أحذية|سوبرماركت|بقالة|تجزئة|إلكترونيات|موبايل|مفروشات|أثاث|عطور/i.test(combined)) {
    return 'retail';
  }

  return 'general';
}

/**
 * Deeply domain-aware local strategy generator that NEVER confuses medical with dining or auto
 */
export function generateCategoryAwareLocalStrategy(
  businessName: string,
  category: string,
  city: string = 'مصر',
  tone: MarketingTone = 'friendly_baladi',
  description?: string
): {
  persona: MarketingPersona;
  calendar: ContentCalendarDay[];
  readyPosts: ReadySocialPost[];
  whatsappCampaigns: WhatsAppCampaign[];
} {
  const name = businessName.trim() || 'المنشأة';
  const cat = category.trim() || 'خدمات متخصصة';
  const domain = detectBusinessDomain(businessName, category, description);

  if (domain === 'medical') {
    return generateMedicalStrategy(name, cat, city, tone);
  } else if (domain === 'automotive') {
    return generateAutomotiveStrategy(name, cat, city, tone);
  } else if (domain === 'beauty') {
    return generateBeautyStrategy(name, cat, city, tone);
  } else if (domain === 'dining') {
    return generateDiningStrategy(name, cat, city, tone);
  } else {
    return generateGeneralStrategy(name, cat, city, tone);
  }
}

// ----------------------------------------------------
// 1. MEDICAL & PHYSICAL THERAPY DOMAIN STRATEGY
// ----------------------------------------------------
function generateMedicalStrategy(
  name: string,
  cat: string,
  city: string,
  tone: MarketingTone
): {
  persona: MarketingPersona;
  calendar: ContentCalendarDay[];
  readyPosts: ReadySocialPost[];
  whatsappCampaigns: WhatsAppCampaign[];
} {
  const persona: MarketingPersona = {
    businessName: name,
    category: cat,
    slogan: `مع ${name}.. صحتك وحركتك بدون ألم في أيدٍ أمينة! 🩺✨`,
    brandVoice: 'صوت طبي مطمئن ومهني، يجمع بين العلم الحديث والرعاية الإنسانية والاهتمام الحقيقي بكل مريض.',
    toneOfVoice: tone,
    targetAudience: {
      demographics: `المرضى والمراجعين في ${city} والباحثين عن حلول جذرية لآلام العمود الفقري، المفاصل، والإصابات وتأهيل الحركة.`,
      painPoints: [
        'الخوف من استمرار الآلام المزمنة والاعتماد على المسكنات المؤقتة.',
        'القلق من العمليات الجراحية المعقدة والبحث عن علاج تحفظي آمن.',
        'صعوبة الحركة وممارسة الحياة اليومية والعمل بحرية وبدون وجع.',
      ],
      desires: [
        'التعافي التام واستعادة مرونة الجسم والحركة الطبيعية.',
        'برنامج علاجي مخصص ومتابعة دقيقة مع دكاترة متخصصين وأجهزة حديثة.',
        'بيئة علاجية مريحة ومعاملة راقية بدون تأخير أو إهمال.',
      ],
    },
    uniqueSellingProposition: `في ${name} نعتمد أحدث بروتوكولات العلاج الطبيعي والتأهيل الحركي بأحدث الأجهزة الطبية وفريق متخصص يضع راحة المريض وسلامته في المقام الأول.`,
    recommendedPostingSchedule: 'يومياً بين الساعة 6:00 مساءً حتى 9:30 مساءً (أوقات عودة المرضى من العمل وتصفح السوشيال ميديا).',
    suggestedColors: {
      primary: '#0284c7', // Sky Blue
      secondary: '#059669', // Emerald Green
      accent: '#0d9488', // Teal
    },
  };

  const calendar: ContentCalendarDay[] = [];
  const pillarRotation: ContentPillarType[] = ['engagement', 'showcase', 'offers', 'social_proof'];

  const templates: Record<
    ContentPillarType,
    Array<{ headline: string; hook: string; body: string; cta: string; visual: string; tags: string[] }>
  > = {
    engagement: [
      {
        headline: 'نصيحة طبية: وضعية الجلوس الصحيحة في الشغل 🪑💡',
        hook: 'بتقعد قدام الكمبيوتر أكتر من 6 ساعات في اليوم؟ ظهرك بيشتكي!',
        body: `يا جماعة آلام أسفل الظهر والرقبة مبتجيش فجأة، دي ناتجة عن عادات يومية غلط! في ${name} بننصحك: كل 45 دقيقة قوم اتحرك دقيقة، واضبط شاشتك على مستوى عينيك، وحافظ على استقامة فقرات ظهرك. صحتك وسلامة عمودك الفقري أولوية!`,
        cta: 'احفظ البوست عندك وشاركه مع زميلك اللي بيقعد كتير على المكتب! 🩺',
        visual: 'إنفوجرافيك طبي واضح يوضح الفرق بين الجلسة الصحيحة والجلسة الخاطئة للظهر.',
        tags: [`#${name.replace(/\s+/g, '_')}`, '#علاج_طبيعي', '#صحة_الظهر', '#نصيحة_طبية'],
      },
      {
        headline: 'سؤال طبي: هل المسكنات هي الحل للوجع؟ 💊🤔',
        hook: 'بتاخد مسكن أول ما تحس بوجع في رقبتك أو مفصلك؟ خلي بالك!',
        body: `المسكن مجرد مخدر مؤقت للألم، لكن السبب الحقيقي (زي الانزلاق الغضروفي أو خشونة المفصل أو الشد العضلي) بيفضل موجود وممكن يزيد! العلاج الطبيعي هو اللي بيعالج أصل المشكلة بدون تدخل جراحي. في ${name} بنحدد سبب الألم وبنحطلك خطة تأهيل جذرية.`,
        cta: 'شاركنا في التعليقات: إيه أكتر ألم بيتكرر معاك؟ وهنجاوبك فوراً! 👇',
        visual: 'صورة توعوية لشخص يمسك رقبته مع رسم توضيحي للفقرات بلون أحمر هادئ.',
        tags: [`#${name.replace(/\s+/g, '_')}`, '#استشارة_طبية', '#العمود_الفقري', '#بدون_جراحة'],
      },
    ],
    showcase: [
      {
        headline: 'أحدث أجهزة العلاج الطبيعي والتأهيل الحركي ⚡🔬',
        hook: 'شوف إزاي التكنولوجيا الحديثة بتسرع مدة التعافي وتخفف الألم!',
        body: `في ${name} بنستخدم أحدث الأجهزة والتقنيات المعتمدة عالمياً (علاج بالموجات التصادمية Shockwave، الليزر عالي الشدة، وأجهزة الشد الفقري الإلكتروني). ده بيساعد في تقليل الالتهاب وتنشيط الدورة الدموية في وقت قياسي وبأعلى درجات الراحة للمريض.`,
        cta: 'شرفنا في المركز واستشر فريقنا المتخصص لمعرفة الأنسب لحالتك! 🏥',
        visual: 'فيديو ريلز أو صورة احترافية للأجهزة الطبية الحديثة داخل العيادة في بيئة معقمة ومريحة.',
        tags: [`#${name.replace(/\s+/g, '_')}`, '#أجهزة_طبية', '#تقنيات_التأهيل', '#عيادات_مصر'],
      },
      {
        headline: 'كواليس جلسة التأهيل الحركي والعلاج اليدوي 🩺🤲',
        hook: 'العلاج اليدوي (Manual Therapy) مش مجرد مساج.. ده علم ودراسة وتشريح!',
        body: `أطباؤنا وأخصائيو العلاج الطبيعي في ${name} مدربون على أعلى مستوى لتقييم حركة المفاصل وتحرير العضلات المشدودة بأمان تام. خطوة بخطوة معاك لحد ما ترجع تمارس حياتك الطبيعية بابتسامة وراحة تامة.`,
        cta: 'احجز موعد كشفك أو جلستك القادمة الآن بخطوة واحدة عبر الواتساب!',
        visual: 'لقطة توضح أخصائي العلاج الطبيعي يقوم بتمارين تأهيل حركي لمريض في بيئة هادئة وراقية.',
        tags: [`#${name.replace(/\s+/g, '_')}`, '#علاج_يدوي', '#تأهيل_حركي', '#صحة_وعافية'],
      },
    ],
    offers: [
      {
        headline: 'باقة الكشف الشامل وتحديد برنامج التأهيل 📋🌿',
        hook: 'متسيبش الألم يكبر.. ابدأ خطة علاجك الآن بخصم خاص!',
        body: `لأهالينا في ${city}، وفرنالكم باقة كشف وفحص حركي شامل تشمل: تقييم القوام وحركة المفاصل والفقرات + جلسة علاج طبيعي تجريبية لتخفيف الألم فوراً بخصم خاص لفترة محدودة داخل ${name}.`,
        cta: 'احجز موعدك الآن عبر الرسائل واستفد من العرض قبل اكتمال المواعيد!',
        visual: 'تصميم بوستر طبي أنيق باللون الأزرق والأبيض عليه تفاصيل الباقة وأيقونة الكشف الطبي.',
        tags: [`#${name.replace(/\s+/g, '_')}`, '#باقة_الكشف', '#عروض_طبية', '#صحتك_تهمنا'],
      },
      {
        headline: 'باقة جلسات علاج الانزلاق الغضروفي والفقرات 🛡️🦴',
        hook: 'تخلص من ألم عرق النسا والظهر مع برنامجنا المتكامل!',
        body: `برنامج مخصص لمرضى الفقرات والانزلاق الغضروفي في ${name}: يشمل جلسات علاج يدوي + أجهزة شد وتسكين الألم + تمارين علاجية لتقوية عضلات الجذع، كل ده في باقة متكاملة بأسعار مريحة وتسهيلات تناسب الجميع.`,
        cta: 'تواصل معنا على الواتساب لمعرفة تفاصيل الباقة ومواعيد الأطباء!',
        visual: 'رسم توضيحي ثلاثي الأبعاد للعمود الفقري مع شارة "خطة علاج متكاملة".',
        tags: [`#${name.replace(/\s+/g, '_')}`, '#انزلاق_غضروفي', '#عرق_النسا', '#جلسات_تأهيل'],
      },
    ],
    social_proof: [
      {
        headline: 'قصة تعافي نجاح نعتز بيها من داخل ${name} 🌟👏',
        hook: '"كنت مش قادر أقف 5 دقايق على بعض.. والنهاردة رجعت أمارس شغلي وحياتي!"',
        body: `دي كلمات مريضنا العزيز بعد التزامه بكورس العلاج الطبيعي والتأهيل في ${name}. مفيش إحساس أحلى من إننا نشوف مريض دخل متألم وبيخرج من عندنا وهو بيتحرك بحرية وأمل من جديد. الحمد لله دائماً وأبداً على الشفاء.`,
        cta: 'شاركنا فرحتك بتعافيك وسيب رأيك الكريم على خرائط جوجل لدعم غيرك!',
        visual: 'صورة لكارت تقييم إيجابي أو شهادة شكر من أحد المرضى مع أيقونة الـ 5 نجوم.',
        tags: [`#${name.replace(/\s+/g, '_')}`, '#قصص_شفاء', '#ثقة_المرضى', '#الحمد_لله'],
      },
      {
        headline: 'شكراً لثقتكم الغالية وتقييماتكم على جوجل ⭐⭐⭐⭐⭐',
        hook: 'تقييماتكم وكلامكم الطيب هو الدافع الأكبر لفريقنا الطبي للاستمرار بالأفضل!',
        body: `فريق العمل والأطباء في ${name} بيشكروا كل مراجع شرفنا برأيه الصادق. التزامنا بأعلى معايير النظافة والتعقيم والمواعيد الدقيقة والنتائج الحقيقية هو عهدنا ليكم دائماً.`,
        cta: 'امسح الرمز داخل العيادة أو افتح الرابط وقيّم تجربتك الطبية معنا!',
        visual: 'لقطة شاشة من تقييمات المرضى على Google Maps مدمجة مع شعار المركز وشارة التوثيق.',
        tags: [`#${name.replace(/\s+/g, '_')}`, '#تقييمات_جوجل', '#عيادة_معتمدة', '#خمس_نجوم'],
      },
    ],
  };

  for (let day = 1; day <= 30; day++) {
    const pillarIndex = (day - 1) % pillarRotation.length;
    const pillar = pillarRotation[pillarIndex];
    const pool = templates[pillar];
    const tmpl = pool[(day - 1) % pool.length];

    calendar.push({
      day,
      pillar,
      pillarTitle: CONTENT_PILLARS_METADATA[pillar].title,
      headline: tmpl.headline.replace(/\$\{name\}/g, name).replace(/\$\{city\}/g, city),
      hookText: tmpl.hook.replace(/\$\{name\}/g, name).replace(/\$\{city\}/g, city),
      bodyText: tmpl.body.replace(/\$\{name\}/g, name).replace(/\$\{city\}/g, city),
      callToAction: tmpl.cta,
      visualDirection: tmpl.visual,
      hashtags: tmpl.tags,
      bestTimeToPost: day % 2 === 0 ? '7:00 مساءً' : '8:30 مساءً',
      isCompleted: false,
    });
  }

  const readyPosts: ReadySocialPost[] = [
    {
      id: 'post-fb-med',
      platform: 'facebook',
      title: 'منشور فيسبوك التعريفي والخدمات الطبية',
      badge: '📘 فيسبوك - تعريف ورعاية',
      content: `إلى أهالي ${city} الكرام.. لو بتعاني من آلام في الظهر أو الرقبة، خشونة المفاصل، أو محتاج تأهيل بعد كسر أو عملية جراحية، ${name} بيقدملك الحل الطبي المضمون بدون جراحة وبدون مسكنات مؤقتة! 🩺🌿\n\nخدماتنا المتخصصة:\n✅ علاج الانزلاق الغضروفي والفقرات العنقية والقطنية.\n✅ تأهيل إصابات الملاعب وإصابات المفاصل والغضاريف.\n✅ علاج وتأهيل حالات الشلل النصفي والجلطات وجلطات الأعصاب.\n✅ برامج تصحيح القوام وعلاج اعوجاج العمود الفقري (الجنف).\n\n📍 العنوان: ${city}\n📞 للحجز والاستفسار عن المواعيد: تواصل معنا الآن عبر الواتساب أو الهاتف!`,
      hashtags: [`#${name.replace(/\s+/g, '_')}`, '#علاج_طبيعي', '#صحة_مصر', '#تأهيل_حركي'],
      imageIdea: 'صورة احترافية للأجهزة الطبية وقاعة التمارين العلاجية النظيفة مع طاقم العمل.',
    },
    {
      id: 'post-ig-med',
      platform: 'instagram',
      title: 'منشور إنستغرام توعوي بصري',
      badge: '📸 إنستغرام - نصائح حركية',
      content: `صحتك هي أغلى استثمار بتعمله في حياتك 🌿✨ لا تستسلم للألم ولا تؤجل الكشف، لأن التشخيص المبكر للعلاج الطبيعي يختصر شهوراً من المعاناة.\n\nفي ${name} نرافقك في كل خطوة نحو استعادة صحتك ونشاطك الكامل.\n\nمنشن لشخص عزيز عليك بيشتكي دايماً من وجع ظهره أو رقبته! 👇\n\n📌 رابط اللوكيشن والمواعيد في البايو.`,
      hashtags: [`#${name.replace(/\s+/g, '_')}`, '#صحة_وعافية', '#بدون_ألم', '#علاج_طبيعي_مصر'],
      imageIdea: 'صورة جمالية دافئة تبرز الراحة النفسية داخل العيادة وأيقونات التمارين الصحية.',
    },
    {
      id: 'post-tt-med',
      platform: 'tiktok',
      title: 'سيناريو فيديو ريلز / تيك توك توعوي طبي',
      badge: '🎵 تيك توك - فحص وتوعية سريعة',
      content: `🎬 سكريبت ريلز طبي (20 ثانية):\n[0-3 ثوانٍ - هوك]: أخصائي العلاج الطبيعي يمسك نموذج العمود الفقري: "عارف ليه وجع أسفل الظهر بيرجعلك كل أسبوع؟"\n[3-12 ثانية]: استعراض سريع لـ 3 أخطاء شائعة (الجلوس الخاطئ، عدم شرب ماء كافي، ضعف عضلات البطن).\n[12-18 ثانية]: لقطة سريعة للأجهزة المتطورة وكيف تحل المشكلة: "في ${name} بنحدد موضع الخلل وبنخلصك من الألم من جذوره!"\n[18-20 ثانية]: شاشة النهاية: العنوان ورقم الحجز المباشر.`,
      hashtags: [`#${name.replace(/\s+/g, '_')}`, '#تيك_توك_طبي', '#علاج_طبيعي', '#fyp'],
      imageIdea: 'تصوير فيديو ديناميكي سريع مع أخصائي يرتدي المعطف الطبي ويشرح باحترافية.',
    },
  ];

  const whatsappCampaigns: WhatsAppCampaign[] = [
    {
      id: 'wa-med-01',
      title: 'رسالة ترحيب وتأكيد حجز الكشف الطبي',
      categoryTag: 'حجز واستفسار',
      targetAudience: 'المرضى الذين استفسروا عن مواعيد الجلسات والكشف',
      messageText: `أهلاً بحضرتك يا فندم في *${name}* 🩺🌿\n\nشرفتنا بالتواصل ونتمنى لك دوام الصحة والعافية.\nبخصوص استفسارك، يسعدنا إبلاغك بأن المواعيد المتاحة للكشف والاستشارة المبدئية هذا الأسبوع هي:\n- الفترات الصباحية: 11:00 ص إلى 3:00 م\n- الفترات المسائية: 5:00 م إلى 10:00 م\n\n📍 عنوان المركز: ${city}\n\nإذا كنت ترغب في تأكيد الحجز، يرجى إرسال (الاسم + موعدك المفضل) وسيقوم المنسق الطبي بتثبيت موعدك فوراً. نسأل الله لكم دوام الشفاء! 🙏`,
      intendedGoal: 'تأكيد موعد الكشف للمريض بدون تردد.',
    },
    {
      id: 'wa-med-02',
      title: 'رسالة متابعة حالة المريض بعد الجلسة',
      categoryTag: 'متابعة ورعاية',
      targetAudience: 'المريض بعد أول جلسة علاج طبيعي',
      messageText: `ألف سلامة على حضرتك يا فندم من فريق *${name}* 🌿\n\nنود الاطمئنان على صحتك بعد جلسة اليوم. نذكرك بأهمية شرب كميات كافية من الماء والالتزام بتمارين الإطالة البسيطة التي وضحها لك الدكتور.\n\nموعد جلستك القادمة هو: [الموعد]\nلو حسيت بأي استفسار أو ملاحظة، فريقنا الطبي متاح لخدمتك دائماً. مع أطيب تمنياتنا بتمام الشفاء والعافية! 💛`,
      intendedGoal: 'بناء علاقة ثقة ورعاية إنسانية راقية.',
    },
    {
      id: 'wa-med-03',
      title: 'رسالة طلب تقييم خرائط جوجل بعد تحسن الحالة',
      categoryTag: 'تقييمات وسمعة',
      targetAudience: 'المرضى الذين أتموا برنامج التعافي',
      messageText: `حمداً لله على سلامتك واكتمال شفائك في *${name}*! 🌟✨\n\nسعادتنا لا توصف برؤيتك تتعافى وتعود لحياتك وحركتك الطبيعية.\nرأيك وتجربتك الإيجابية قد تكون سبباً وأملاً لمريض آخر يعاني من نفس الألم ويبحث عن مكان موثوق.. يا ريت تشاركنا تقييمك بـ 5 نجوم على خرائط جوجل في ثوانٍ معدودة:\n⭐⭐⭐⭐⭐\n\nشكراً لثقتك الغالية في مركزنا الطبي! 🙏🩺`,
      intendedGoal: 'جمع تقييمات 5 نجوم حقيقية لمرضى متعافين.',
    },
    {
      id: 'wa-med-04',
      title: 'عرض الباقة التسويقية لدليلك موجه للدكتور / إدارة المركز',
      categoryTag: 'إغلاق بيعي (B2B)',
      targetAudience: 'إلى إدارة مركز العلاج الطبيعي والعيادة',
      messageText: `السلام عليكم دكتورنا الفاضل وإدارة *${name}* الموقرة،\n\nمعكم فريق منصة *دليلك* الرسمية 🗺️✨\nقمنا بدراسة الحضور الرقمي لمركزكم المتميز في ${city}، ويسرنا تقديم خطة تسويقية شهرية طبية متكاملة (30 يوماً من المحتوى الطبي الموثوق) لتعزيز وصول المرضى إلى عيادتكم ورفع ترتيبكم على Google Maps.\n\nأعددنا لحضراتكم تقريراً تسويقياً متخصصاً كاملاً متاحاً للاطلاع الآن.\nيسعدنا التنسيق معكم لإطلاق الحملة وتوثيق المركز رسمياً. دمتم منارة للعلم والشفاء! 🚀`,
      intendedGoal: 'التعاقد مع العيادة على الباقة التسويقية لدليلك.',
    },
  ];

  return { persona, calendar, readyPosts, whatsappCampaigns };
}

// ----------------------------------------------------
// 2. AUTOMOTIVE & CAR CARE DOMAIN STRATEGY
// ----------------------------------------------------
function generateAutomotiveStrategy(
  name: string,
  cat: string,
  city: string,
  tone: MarketingTone
): {
  persona: MarketingPersona;
  calendar: ContentCalendarDay[];
  readyPosts: ReadySocialPost[];
  whatsappCampaigns: WhatsAppCampaign[];
} {
  const persona: MarketingPersona = {
    businessName: name,
    category: cat,
    slogan: `مع ${name}.. سيارتك ترجع زيرو ولمعان يخطف الأنظار! 🚗✨`,
    brandVoice: 'صوت مفعم بالحماس والخبرة وعشق تفاصيل السيارات والاهتمام الفائق بكل مليمتر في المركبة.',
    toneOfVoice: tone,
    targetAudience: {
      demographics: `أصحاب وعشاق السيارات في ${city} والمهتمين بالمحافظة على لمعان وقيمة ونظافة سياراتهم.`,
      painPoints: ['تلف دهان السيارة من الشمس والغسيل بمواد كيماوية رديئة.', 'قلة النظافة العميقة للفرش والتكييف.', 'الخدوش السطحية وفقدان بريق الوكالة.'],
      desires: ['سيارة تبرق كأنها طالعة من المعرض.', 'حماية نانو سيراميك تدوم لسنوات مع ضمان معتمد.', 'سرعة وإتقان وسعر عادل.'],
    },
    uniqueSellingProposition: `في ${name} نستخدم أرقى المواد العالمية المعتمدة لغسيل وحماية وتلميع السيارات بأيدي فنيين محترفين وأحدث أجهزة البخار والنانو.`,
    recommendedPostingSchedule: 'يومياً بين 4:00 عصراً حتى 8:30 مساءً وخاصة أيام الخميس والجمعة.',
    suggestedColors: { primary: '#dc2626', secondary: '#1e293b', accent: '#f59e0b' },
  };

  const calendar = buildGenericDomainCalendar(name, cat, city, 'car');
  const readyPosts = buildGenericDomainPosts(name, cat, city, 'car');
  const whatsappCampaigns = buildGenericDomainWhatsApp(name, cat, city, 'car');
  return { persona, calendar, readyPosts, whatsappCampaigns };
}

// ----------------------------------------------------
// 3. BEAUTY & SALON DOMAIN STRATEGY
// ----------------------------------------------------
function generateBeautyStrategy(
  name: string,
  cat: string,
  city: string,
  tone: MarketingTone
): {
  persona: MarketingPersona;
  calendar: ContentCalendarDay[];
  readyPosts: ReadySocialPost[];
  whatsappCampaigns: WhatsAppCampaign[];
} {
  const persona: MarketingPersona = {
    businessName: name,
    category: cat,
    slogan: `مع ${name}.. دلال وأناقة وإطلالة تسحر القلوب! 🌸👑`,
    brandVoice: 'صوت أنيق، ناعم، حنون وراقي يهتم بأدق تفاصيل الجمال والراحة وتجديد الطاقة.',
    toneOfVoice: tone,
    targetAudience: {
      demographics: `السيدات والفتيات في ${city} الباحثات عن أرقى خدمات العناية بالشعر والبشرة وميكب المناسبات.`,
      painPoints: ['تلف الشعر أو البشرة من المنتجات المقلدة.', 'عدم الحصول على اللوك المطلوب في المناسبات المهمة.', 'ازدحام الأماكن وضعف التعقيم والنظافة.'],
      desires: ['إطلالة ملكية وميكب يدوم لساعات بدون عيوب.', 'استرخاء ودلال بأحدث الأجهزة والمنتجات الأصلية.', 'معاملة محترمة ومواعيد دقيقة.'],
    },
    uniqueSellingProposition: `في ${name} نضمن لك استخدام منتجات أصلية 100% وأيدي خبيرات تجميل معتمدات لضمان أجمل إطلالة تليق بجمالك.`,
    recommendedPostingSchedule: 'يومياً بين 1:00 ظهراً حتى 7:00 مساءً.',
    suggestedColors: { primary: '#ec4899', secondary: '#8b5cf6', accent: '#f43f5e' },
  };

  const calendar = buildGenericDomainCalendar(name, cat, city, 'beauty');
  const readyPosts = buildGenericDomainPosts(name, cat, city, 'beauty');
  const whatsappCampaigns = buildGenericDomainWhatsApp(name, cat, city, 'beauty');
  return { persona, calendar, readyPosts, whatsappCampaigns };
}

// ----------------------------------------------------
// 4. DINING & RESTAURANT DOMAIN STRATEGY
// ----------------------------------------------------
function generateDiningStrategy(
  name: string,
  cat: string,
  city: string,
  tone: MarketingTone
): {
  persona: MarketingPersona;
  calendar: ContentCalendarDay[];
  readyPosts: ReadySocialPost[];
  whatsappCampaigns: WhatsAppCampaign[];
} {
  const persona: MarketingPersona = {
    businessName: name,
    category: cat,
    slogan: `مع ${name}.. أصل الطعم والنكهة اللي تعدل المزاج! 🍽️🔥`,
    brandVoice: 'صوت دافئ ومرحب، يجمع بين كرم الضيافة المصرية وأشهى النكهات الطازجة المحضرة بكل حب.',
    toneOfVoice: tone,
    targetAudience: {
      demographics: `العائلات والشباب وعشاق الأكلات الشهية في ${city}.`,
      painPoints: ['عدم نظافة الأكل أو تدني جودة اللحوم والمكونات.', 'تأخر الطلبات والخدمة البطيئة.', 'أسعار مبالغ فيها مقابل كميات قليلة.'],
      desires: ['أكل طازج وشهي يشرف أمام الضيوف.', 'لمة حلوة وخدمة سريعة ونظيفة.', 'عروض ووجبات قيمة وموفرة.'],
    },
    uniqueSellingProposition: `في ${name} لحومنا ومكوناتنا طازجة يومياً 100% وتتبيلاتنا الخاصة على الفحم بنكهة أصيلة لا تقاوم.`,
    recommendedPostingSchedule: 'يومياً بين 1:00 ظهراً حتى 3:30 عصراً، ومن 7:00 حتى 10:00 مساءً.',
    suggestedColors: { primary: '#ea580c', secondary: '#b91c1c', accent: '#f59e0b' },
  };

  const calendar = buildGenericDomainCalendar(name, cat, city, 'dining');
  const readyPosts = buildGenericDomainPosts(name, cat, city, 'dining');
  const whatsappCampaigns = buildGenericDomainWhatsApp(name, cat, city, 'dining');
  return { persona, calendar, readyPosts, whatsappCampaigns };
}

// ----------------------------------------------------
// 5. GENERAL & RETAIL DOMAIN STRATEGY
// ----------------------------------------------------
function generateGeneralStrategy(
  name: string,
  cat: string,
  city: string,
  tone: MarketingTone
): {
  persona: MarketingPersona;
  calendar: ContentCalendarDay[];
  readyPosts: ReadySocialPost[];
  whatsappCampaigns: WhatsAppCampaign[];
} {
  const persona: MarketingPersona = {
    businessName: name,
    category: cat,
    slogan: `مع ${name}.. ثقة، جودة، وخدمة ترضيك دائماً! 🌟`,
    brandVoice: 'صوت محترف، ودود، يركز على توفير أفضل الحلول والمنتجات بأمانة وجودة.',
    toneOfVoice: tone,
    targetAudience: {
      demographics: `العملاء الباحثين عن الجودة والمصداقية في ${city}.`,
      painPoints: ['التعامل مع أماكن غير موثوقة أو خدمات دون المستوى.', 'عدم الالتزام بالمواعيد والضمان.'],
      desires: ['معاملة راقية وأسعار واضحة بدون مصاريف خفية.', 'خدمة ما بعد البيع مضمونة.'],
    },
    uniqueSellingProposition: `في ${name} نلتزم بأعلى معايير المصداقية والجودة وسرعة تلبية احتياجات عملائنا الكرام.`,
    recommendedPostingSchedule: 'يومياً بين 5:00 مساءً حتى 9:00 مساءً.',
    suggestedColors: { primary: '#2563eb', secondary: '#475569', accent: '#f59e0b' },
  };

  const calendar = buildGenericDomainCalendar(name, cat, city, 'general');
  const readyPosts = buildGenericDomainPosts(name, cat, city, 'general');
  const whatsappCampaigns = buildGenericDomainWhatsApp(name, cat, city, 'general');
  return { persona, calendar, readyPosts, whatsappCampaigns };
}

// Helpers for generic/auto/beauty/dining
function buildGenericDomainCalendar(name: string, cat: string, city: string, type: 'car' | 'beauty' | 'dining' | 'general'): ContentCalendarDay[] {
  const days: ContentCalendarDay[] = [];
  const pillars: ContentPillarType[] = ['engagement', 'showcase', 'offers', 'social_proof'];

  const typeConfig = {
    car: {
      hookEng: 'بتهتم بعربيتك بنفسك ولا بتسيبها على الله؟ 🚗',
      bodyEng: `في ${name} بنفكرك: لمعان ونظافة سيارتك بتفرق في نفسيتك وعمر دهانها! إيه أول حاجة بتنظفها في عربيتك؟`,
      hookShow: 'شوف الفرق بعينك قبل وبعد التلميع والعناية! ✨',
      bodyShow: `اللمعان ده مش صدفة، دي خطوات نانو سيراميك وحماية احترافية في ${name}.`,
      hookOff: 'عرض الويك إند: غسيل وتلميع وحماية بأقوى خصم! 🔥',
      bodyOff: `دلّع عربيتك واستفيد بخصم مميز الأسبوع ده داخل ${name} في ${city}.`,
      hookSoc: 'زبون دخل بعربية مطفية وخرج ببريق الوكالة! 🌟',
      bodySoc: `كلامكم الحلو وتقييماتكم على خرائط جوجل هي شهادة فخر لينا دائماً.`,
    },
    beauty: {
      hookEng: 'روتينك اليومي للعناية ببشرتك وشعرك عامل إيه؟ 🌸',
      bodyEng: `في ${name} بنهتم بدلالك وإشراقتك.. شاركينا روتينك أو اسألي خبيراتنا في الكومنتات!`,
      hookShow: 'اللوك الجديد اللي خطف كل الأنظار عندنا النهاردة! 💅✨',
      bodyShow: `بأيدي خبيراتنا ومنتجاتنا الأصلية 100% بنضمن لك إطلالة تسحر الكل.`,
      hookOff: 'باقة الدلال والجمال الأسبوعية بخصم خاص جداً! 🎁',
      bodyOff: `استمتعي بأحلى جلسة عناية وريلاكس في ${name} بأفضل الأسعار.`,
      hookSoc: 'ابتسامة عروستنا وثقتها بجمالها هي أكبر مكسب لينا! 👑',
      bodySoc: `شكراً لكل قمر نورتنا وشاركتنا تقييمها اللطيف على خرائط جوجل!`,
    },
    dining: {
      hookEng: 'لو قدامك طبق مشويات وطاجن صعيدي.. هتبدأ بمين الأول؟ 😋🍽️',
      bodyEng: `يا مساء الجمال على الأكيلة! اللمة متكملش غير مع أشهى أكلات ${name}. شاركنا اختيارك!`,
      hookShow: 'ريحة الفحم والتتبيلة اللي على أصلها من قلب المطبخ! 🔥🥩',
      bodyShow: `الجودة والأصل في ${name}: لحوم طازجة يومياً مفيهاش أي تنازل عن النظافة والإتقان.`,
      hookOff: 'عرض اللمة والصحاب: وجبات التوفير الخطيرة! 💥',
      bodyOff: `اجمع عيلتك أو صحابك وتعالوا استمتعوا بأقوى خصومات وعروض في ${city}.`,
      hookSoc: 'كلامكم الحلو بعد الأكلة دي بيسعد الشيف وكل الطاقم! ❤️',
      bodySoc: `ثقتكم في طعامنا ونظافتنا وتقييماتكم على جوجل هي رأس مالنا الحقيقي.`,
    },
    general: {
      hookEng: 'إيه أكتر حاجة بتدور عليها لما تختار مكان تتعامل معاه؟ 🧐',
      bodyEng: `في ${name} بنؤمن إن الثقة والوضوح هما أساس أي علاقة نجاح مع عملائنا.`,
      hookShow: 'كواليس شغلنا واهتمامنا بأدق التفاصيل عشانك! 💼✨',
      bodyShow: `بنقدملك حلول وخدمات معتمدة ومضمونة بنسبة 100% لتوفير وقتك ومجهودك.`,
      hookOff: 'عرض التوفير الخاص لجميع متابعي صفحتنا! 🏷️',
      bodyOff: `استفد من باقاتنا الخاصة وأسعارنا التنافسية لفترة محدودة.`,
      hookSoc: 'شهادة نعتز بيها من عملائنا الكرام وشركاء النجاح! 🌟',
      bodySoc: `شكراً لدعمكم الدائم وثقتكم الغالية في ${name} على منصة دليلك.`,
    },
  }[type];

  for (let day = 1; day <= 30; day++) {
    const pillarIndex = (day - 1) % pillars.length;
    const pillar = pillars[pillarIndex];
    let headline = '';
    let hook = '';
    let body = '';
    let cta = 'تواصل معنا للحجز والاستفسار!';

    if (pillar === 'engagement') {
      headline = 'سؤال وتفاعل يهمك';
      hook = typeConfig.hookEng;
      body = typeConfig.bodyEng;
      cta = 'شاركنا رأيك في التعليقات!';
    } else if (pillar === 'showcase') {
      headline = 'استعراض الجودة والتميز';
      hook = typeConfig.hookShow;
      body = typeConfig.bodyShow;
      cta = 'شرفنا بزيارتك واكتشف الفرق بنفسك!';
    } else if (pillar === 'offers') {
      headline = 'عرض حصري وخصم خاص';
      hook = typeConfig.hookOff;
      body = typeConfig.bodyOff;
      cta = 'احجز عرضك الآن قبل انتهاء الكمية!';
    } else {
      headline = 'آراء العملاء وثقتكم بنا';
      hook = typeConfig.hookSoc;
      body = typeConfig.bodySoc;
      cta = 'قيّمنا بـ 5 نجوم على خرائط جوجل!';
    }

    days.push({
      day,
      pillar,
      pillarTitle: CONTENT_PILLARS_METADATA[pillar].title,
      headline,
      hookText: hook,
      bodyText: body,
      callToAction: cta,
      visualDirection: 'تصميم عالي الجودة يناسب طبيعة النشاط.',
      hashtags: [`#${name.replace(/\s+/g, '_')}`, `#${city.replace(/\s+/g, '_')}`, '#دليلك'],
      bestTimeToPost: '7:00 مساءً',
      isCompleted: false,
    });
  }

  return days;
}

function buildGenericDomainPosts(name: string, cat: string, city: string, type: string): ReadySocialPost[] {
  return [
    {
      id: `post-fb-${type}`,
      platform: 'facebook',
      title: 'منشور فيسبوك الترويجي الرئيسي',
      badge: '📘 فيسبوك',
      content: `أهالي ${city} الكرام.. لو بتدوروا على أعلى جودة وخدمة ممتازة في ${cat}، يبقى مكانكم الأكيد في ${name}! 🌟\n\nنلتزم بتقديم أفضل تجربة بأفضل الأسعار وبخدمة تشرفك.\n📍 العنوان: ${city}\n📞 تواصل معنا الآن!`,
      hashtags: [`#${name.replace(/\s+/g, '_')}`, '#عروض_مصر', '#دليلك'],
      imageIdea: 'تصميم بوستر يعرض أفضل خدمات المنشأة.',
    },
    {
      id: `post-ig-${type}`,
      platform: 'instagram',
      title: 'منشور إنستغرام جمالي',
      badge: '📸 إنستغرام',
      content: `التفاصيل تصنع الفارق دائماً ✨ في ${name} نحرص على تقديم تجربة استثنائية ترضي تطلعاتكم.\n\nمنشن لصاحبك وشرفونا بزيارتكم!`,
      hashtags: [`#${name.replace(/\s+/g, '_')}`, '#جودة', '#مصر'],
      imageIdea: 'لقطة أنيقة للمكان أو الخدمات.',
    },
    {
      id: `post-tt-${type}`,
      platform: 'tiktok',
      title: 'سيناريو فيديو ريلز / تيك توك',
      badge: '🎵 تيك توك',
      content: `🎬 سكريبت فيديو سريع (15 ثانية):\nلقطات سريعة لكواليس الخدمة في ${name} مع دعوة سريعة لتجربة الجودة في ${city}!`,
      hashtags: [`#${name.replace(/\s+/g, '_')}`, '#fyp', '#viral'],
      imageIdea: 'تصوير ديناميكي سريع.',
    },
  ];
}

function buildGenericDomainWhatsApp(name: string, cat: string, city: string, type: string): WhatsAppCampaign[] {
  return [
    {
      id: `wa-1-${type}`,
      title: 'رسالة ترحيب وعرض للعملاء الجدد',
      categoryTag: 'عملاء جدد',
      targetAudience: 'العميل بعد أول استفسار',
      messageText: `أهلاً بحضرتك في *${name}* 🌟\nيسعدنا خدمتكم ونقدم لكم خصماً خاصاً على أول تعامل!\n📍 العنوان: ${city}\nنحن بانتظار تشريفكم!`,
      intendedGoal: 'تأكيد الحجز والزيارة',
    },
    {
      id: `wa-2-${type}`,
      title: 'رسالة متابعة وتقييم',
      categoryTag: 'تقييمات',
      targetAudience: 'العميل بعد إتمام الخدمة',
      messageText: `شكراً لاختياركم *${name}* اليوم! نتمنى أن نكون عند حسن ظنكم، ويسعدنا تقييمكم بـ 5 نجوم على Google Maps. ⭐⭐⭐⭐⭐`,
      intendedGoal: 'جمع تقييمات جوجل',
    },
  ];
}
