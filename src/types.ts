export interface DalilakBusiness {
  id: string;
  name_ar: string;
  name_en?: string;
  category?: string;
  governorate?: string;
  city?: string;
  street?: string;
  landmark?: string;
  phone: string;
  secondary_phone?: string;
  working_hours?: string;
  description?: string;
  lat?: number;
  lng?: number;
  owner_name?: string;
  owner_phone?: string;
  photos?: string[]; // تتضمن صور الواجهة الميدانية واللافتة والكروت بتشفير Base64
  google_maps_url?: string;
  google_place_id?: string;
  verification_status?: string;
  notes?: string | Record<string, any>;
  created_at?: string;
  invoice_number?: string;
}

export type MarketingTone = 
  | 'friendly_baladi'     // أسلوب ودي بلدي (عشم وجدعنة وترحاب مصري أصيل)
  | 'luxury_prestigious'  // أسلوب راقٍ وفخم (VIP ووجاهة وأناقة)
  | 'urgent_enthusiastic' // أسلوب عروض ناري وحماسي (قنبلة التوفير والحق قبل النفاذ)
  | 'witty_smart'         // أسلوب ذكي وفرفوش (خفة دم وتفاعل شبابي ترند)
  | 'professional_direct';// أسلوب احترافي ومباشر (ثقة وأرقام وضمان وجودة)

export type ContentPillarType = 
  | 'engagement'    // المحتوى التفاعلي والتوعوي والمسابقات
  | 'showcase'      // استعراض جودة المنتجات والخدمات وكواليس العمل
  | 'offers'        // عروض وتخفيضات وباقات قوية مع CTA حاسم
  | 'social_proof'; // آراء العملاء، التقييمات، وقصص النجاح وبناء الثقة

export interface MarketingPersona {
  businessName: string;
  category: string;
  slogan: string;
  brandVoice: string;
  toneOfVoice: MarketingTone;
  targetAudience: {
    demographics: string;
    painPoints: string[];
    desires: string[];
  };
  uniqueSellingProposition: string;
  recommendedPostingSchedule: string;
  suggestedColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface ContentCalendarDay {
  day: number;
  pillar: ContentPillarType;
  pillarTitle: string;
  headline: string;
  hookText: string;
  bodyText: string;
  callToAction: string;
  visualDirection: string;
  hashtags: string[];
  bestTimeToPost: string;
  isCompleted?: boolean;
}

export interface ReadySocialPost {
  id: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'threads';
  title: string;
  badge: string;
  content: string;
  hashtags: string[];
  imageIdea: string;
}

export interface WhatsAppCampaign {
  id: string;
  title: string;
  categoryTag: string;
  targetAudience: string;
  messageText: string;
  intendedGoal: string;
}

export interface EcosystemActivityProgress {
  businessId: string;
  businessName: string;
  lastUpdated: string;
  persona: MarketingPersona | null;
  calendar: ContentCalendarDay[];
  readyPosts: ReadySocialPost[];
  whatsappCampaigns: WhatsAppCampaign[];
  isPromotedToCore: boolean;
  promotedAt?: string;
  notes?: string;
}

export interface ServerConfig {
  coreUrl: string;
  coreKey: string;
  ecosystemUrl: string;
  ecosystemKey: string;
  geminiKey: string;
}
