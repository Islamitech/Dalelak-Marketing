import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Sparkles,
  Camera,
  Layers,
  Facebook,
  Instagram,
  Video,
  Send,
} from 'lucide-react';
import { DalilakBusiness, ReadySocialPost } from '../types';

interface ReadyPostsTabsProps {
  readyPosts: ReadySocialPost[];
  business?: DalilakBusiness | null;
}

export const ReadyPostsTabs: React.FC<ReadyPostsTabsProps> = ({ readyPosts, business }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!readyPosts || readyPosts.length === 0) return null;

  const currentPost = readyPosts[activeTab] || readyPosts[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSendWhatsApp = (post: ReadySocialPost) => {
    const textToSend = `${post.title}\n\n${post.content}\n\n${(post.hashtags || []).join(' ')}`;
    const phone = business?.owner_phone || business?.phone || '';
    const cleanNumber = phone.replace(/\D/g, '');
    const intlNumber = cleanNumber.startsWith('0') ? `20${cleanNumber.slice(1)}` : cleanNumber;
    const encoded = encodeURIComponent(textToSend);
    const url = intlNumber ? `https://wa.me/${intlNumber}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'tiktok':
        return <Video className="w-4 h-4 text-slate-900" />;
      default:
        return <Share2 className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              منشورات إعلانية جاهزة للنشر الفوري
            </h3>
            <p className="text-xs text-slate-500">
              مصممة خصيصاً لخوارزميات فيسبوك وإنستغرام وتيك توك مع نصوص وهاشتاجات كاملة
            </p>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {readyPosts.map((post, idx) => (
            <button
              key={post.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === idx
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {getPlatformIcon(post.platform)}
              <span>{post.badge.split('-')[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Post Box */}
      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700">
              {currentPost.title}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(currentPost.content, currentPost.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                {copiedId === currentPost.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ النص</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleSendWhatsApp(currentPost)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                title="إرسال عبر واتساب لصاحب النشاط"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال واتساب</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium shadow-2xs">
            {currentPost.content}
          </div>

          {/* Hashtags */}
          {currentPost.hashtags && currentPost.hashtags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap pt-1">
              {currentPost.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Visual Idea */}
        <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-3 text-xs">
          <div className="p-2 rounded-lg bg-purple-100 text-purple-700 shrink-0">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-purple-900 block mb-0.5">
              فكرة الصورة / الفيديو الترويجي لهذا البوست:
            </span>
            <p className="text-purple-800/90 leading-relaxed">
              {currentPost.imageIdea}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
