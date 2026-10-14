import { useState } from 'react';
import {
  ExternalLink,
  Lock,
  Umbrella,
  Users,
  FileText,
  MessageCircle,
  Megaphone,
  AlertCircle,
  HelpCircle,
  Globe,
  BookOpen,
  Share2,
  CheckCircle2,
  Sparkles,
  Wifi,
  Battery,
  ShieldCheck,
} from 'lucide-react';

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: React.ReactNode;
  badge?: string;
  isHeader?: boolean;
}

const LINKTREE_ITEMS: LinkItem[] = [
  // ── 1. บริการและกิจกรรมปัจจุบัน ─────────────────────────────
  {
    id: 'locker',
    title: 'บริการเช่าล็อกเกอร์ปี 69',
    url: 'https://forms.gle/syWp9tfDqt8SXg189',
    icon: <Lock className="w-4 h-4 text-[#D23976]" />,
    badge: 'บริการ',
  },
  {
    id: 'umbrella-return',
    title: 'คืนร่มก.อศ. 69',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSeMW432M187ZYhetQPyQqkbHHoRpnwjVN6oLUR9rn5AMpsXVw/viewform',
    icon: <Umbrella className="w-4 h-4 text-[#0165F8]" />,
  },
  {
    id: 'umbrella-borrow',
    title: 'ยืมร่มก.อศ. 69',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSfOOmV07Ay8UOs41nuGj3Bcm6x8YEWNe3Kcc7ul9FHc4D_KRA/viewform',
    icon: <Umbrella className="w-4 h-4 text-[#10B981]" />,
  },
  {
    id: 'sairahas',
    title: 'ลงทะเบียนกิจกรรมสายรหัสคล้องจิต เพื่อนพ้องนิสิตอักษรศาสตร์ 2569 (Arts Sairahas 2026)',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSefrfdiXP8-_KmfX10ge0lhiO7t0m0Kp7UW4sTHwKUWH0qP4A/viewform',
    icon: <Users className="w-4 h-4 text-[#8B5CF6]" />,
    badge: 'Arts 94',
  },
  {
    id: 'activity-survey',
    title: 'แบบสอบถามความต้องการในการจัดกิจกรรมภายในคณะอักษรศาสตร์',
    url: 'https://forms.gle/F7dMaREkg856fzzh9',
    icon: <FileText className="w-4 h-4 text-[#F59E0B]" />,
  },
  {
    id: 'openchat-94',
    title: 'Openchat for Arts CU 94',
    url: 'https://line.me/ti/g2/tq6Y6MCkWOhkaDEZCZVNeGwWLxe66zkW0iKpgw?utm_source=invitation&utm_medium=link_copy&utm_campaign=default',
    icon: <MessageCircle className="w-4 h-4 text-[#06C755]" />,
    badge: 'LINE',
  },

  // ── 2. งานประชาสัมพันธ์/กิจกรรม ก.อศ. ───────────────────────
  {
    id: 'hdr-pr',
    title: 'งานประชาสัมพันธ์ / กิจกรรม ก.อศ.',
    url: '',
    isHeader: true,
  },
  {
    id: 'pr-form',
    title: 'ฟอร์มกรอกเพื่อขอประชาสัมพันธ์ในช่องทางของ ก.อศ.',
    url: 'https://airtable.com/appaWGKhYblYtwjmo/shrQKYnnyhVKLq3Pr',
    icon: <Megaphone className="w-4 h-4 text-[#EC4899]" />,
  },

  // ── 3. รวมฟอร์มสำหรับเพื่อนนิสิต ─────────────────────────────
  {
    id: 'hdr-forms',
    title: 'รวมฟอร์มสำหรับเพื่อนนิสิต',
    url: '',
    isHeader: true,
  },
  {
    id: 'water-mbk',
    title: 'ขอเบิกใช้น้ำ MBK กับทาง อบจ.',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSfhIiMb2W1RTt0oUUVUtzjdp4sD9Q51SzI7ePoM0Hd56_7MKQ/closedform',
    icon: <FileText className="w-4 h-4 text-[#0284C7]" />,
  },
  {
    id: 'harassment-report',
    title: 'ฟอร์มร้องเรียนเหตุการณ์ที่เกี่ยวกับการคุกคามทางเพศสำหรับนิสิตอักษรศาสตร์ (Sexual Harassment Report)',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSc43bz4bf8QXb_HikJ0bUWt4NKWxkSEinZWDJ8J31izOIgNHw/viewform?usp=sf_link',
    icon: <AlertCircle className="w-4 h-4 text-[#EF4444]" />,
    badge: 'ความปลอดภัย',
  },
  {
    id: 'hoa-mc',
    title: 'แบบฟอร์มการขอพิธีกร HOA 69',
    url: 'https://docs.google.com/spreadsheets/d/1NgsRvADD3sDFlapd53RWAfDRImb82IN69uYImt3Bzzs/edit?gid=0#gid=0',
    icon: <FileText className="w-4 h-4 text-[#10B981]" />,
  },
  {
    id: 'general-issues',
    title: 'ฟอร์มแจ้งปัญหาทั่วไปภายในคณะสำหรับนิสิตอักษรศาสตร์',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLScSRMsEHAJzdFOKWwuKtJiK5L8rZhFcNlirRkIm7NT40wTiVg/viewform',
    icon: <HelpCircle className="w-4 h-4 text-[#6366F1]" />,
  },

  // ── 4. ช่องทางติดต่อ ก.อศ. ──────────────────────────────────
  {
    id: 'hdr-contact',
    title: 'ช่องทางติดต่อ ก.อศ.',
    url: '',
    isHeader: true,
  },
  {
    id: 'official-web',
    title: 'เว็บไซต์คณะกรรมการนิสิตอักษรศาสตร์ (ก.อศ.)',
    url: 'https://www.arts.chula.ac.th/goz',
    icon: <Globe className="w-4 h-4 text-[#3B82F6]" />,
  },
  {
    id: 'fb-goz',
    title: 'Facebook: คณะกรรมการนิสิตอักษรศาสตร์ จุฬาฯ ก.อศ.',
    url: 'http://www.facebook.com/artsgozcu',
    icon: <Globe className="w-4 h-4 text-[#1877F2]" />,
  },
  {
    id: 'twitter-goz',
    title: 'Twitter (X): @arts_goz',
    url: 'https://twitter.com/arts_goz?s=21&t=kxPgl5cuSlInPDEAMlqYtw',
    icon: <Globe className="w-4 h-4 text-[#000000]" />,
  },
  {
    id: 'ig-goz',
    title: 'Instagram: @arts_goz',
    url: 'http://www.instagram.com/arts_goz',
    icon: <Globe className="w-4 h-4 text-[#E1306C]" />,
  },
  {
    id: 'discord-goz',
    title: 'Discord: Arts Chula Community 💞',
    url: 'https://discord.gg/2QrmYg88a9',
    icon: <MessageCircle className="w-4 h-4 text-[#5865F2]" />,
  },

  // ── 5. GOZ Projects ─────────────────────────────────────────
  {
    id: 'hdr-projects',
    title: 'GOZ Projects',
    url: '',
    isHeader: true,
  },
  {
    id: 'article-kru',
    title: '[บทความสัปดาห์ไหว้ครู] ความสัมพันธ์ “ครู-ศิษย์” : เมื่อศิษย์เคารพ “ติวเตอร์” กับ “ครู” ไม่เท่ากัน',
    url: 'https://artsgoz.vercel.app/lookup/180823_1',
    icon: <BookOpen className="w-4 h-4 text-[#D23976]" />,
  },
  {
    id: 'manud-yt',
    title: 'มนุดโรงบาล x ArtsCU x MDCU | EP.1 มนุษย์รักษามนุษย์',
    url: 'https://www.youtube.com/watch?v=LEbPxnCf68s&list=PLMJIZ95mFtZs47Bp3gslJ1nUi-AXnvCmP',
    icon: <YoutubeIcon className="w-4 h-4 text-[#FF0000]" />,
    badge: 'YouTube',
  },
  {
    id: 'artsmor',
    title: 'A(RTS)mor: หลากรสเรื่องรักฉบับอักษรศาสตร์',
    url: 'http://www.linktr.ee/artsmor',
    icon: <Sparkles className="w-4 h-4 text-[#EC4899]" />,
  },
  {
    id: 'artsfem',
    title: 'Arts F(E)M: เข้าใจสตรีผ่านมิติอักษรศาสตร์',
    url: 'http://www.linktr.ee/artsfem',
    icon: <Sparkles className="w-4 h-4 text-[#A855F7]" />,
  },
];

export function LinktreeMiniScreen() {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('https://linktr.ee/artsgoz');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Device frame container */}
      <div className="w-full max-w-[380px] sm:max-w-[400px] lg:max-w-[420px] rounded-[44px] p-3 sm:p-3.5 bg-gradient-to-b from-[#2A2B37] via-[#1E1F29] to-[#15161E] shadow-[0_20px_50px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.08)] border-4 border-[#3D3E4F]">
        
        {/* Screen Bezel */}
        <div className="relative w-full h-[580px] sm:h-[620px] rounded-[34px] overflow-hidden bg-gradient-to-b from-[#2b1664] via-[#1b1042] to-[#11092b] flex flex-col shadow-inner">
          
          {/* Top Status Bar & Dynamic Island */}
          <div className="shrink-0 h-11 px-6 flex items-center justify-between text-white/90 text-xs font-medium z-20 select-none bg-black/15 backdrop-blur-sm">
            <span className="tracking-tight text-[12px] font-semibold">9:41</span>
            
            {/* Dynamic Island / Speaker Pill */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-1.5 shadow-md">
              <div className="w-2 h-2 rounded-full bg-[#1c1c24] border border-white/10" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#052b48]" />
            </div>

            <div className="flex items-center gap-1.5 opacity-90">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Mini Browser Bar */}
          <div className="shrink-0 mx-3 my-1 px-3 py-1.5 bg-white/10 hover:bg-white/15 transition-colors rounded-full flex items-center justify-between text-[11px] text-white/80 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-mono tracking-tight text-white/90 truncate">linktr.ee/artsgoz</span>
            </div>
            <a
              href="https://linktr.ee/artsgoz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[10px] font-medium transition-all shrink-0 ml-1"
              title="เปิดในแท็บใหม่"
            >
              <span>เปิดเต็มจอ</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Scrollable Mini-Screen Viewport */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
            
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center pt-2 pb-3">
              {/* Avatar with glow and ring */}
              <div className="relative mb-3 group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#D23976] via-[#A855F7] to-[#0165F8] opacity-75 blur-[6px] group-hover:opacity-100 transition-opacity" />
                <img
                  src="https://ugc.production.linktr.ee/8023f976-11d0-497c-97f5-24f421f615c2_Untitled-design.png"
                  alt="Artsgoz Profile"
                  className="relative w-20 h-20 rounded-full object-cover border-2 border-white shadow-md bg-white"
                  onError={(e) => {
                    // Fallback to stylized SVG placeholder if blocked
                    (e.target as HTMLImageElement).src =
                      'https://linktr.ee/og/image/artsgoz.jpg';
                  }}
                />
                <button
                  type="button"
                  onClick={handleShare}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white text-[#1C205D] shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title="คัดลอกลิงก์"
                  aria-label="Share Linktree"
                >
                  {copied ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Title & Badge */}
              <div className="flex items-center gap-1.5 mb-1">
                <h2 className="text-[17px] font-bold text-white tracking-tight">
                  @artsgoz
                </h2>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#D23976] text-white">
                  Official
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-white/80 max-w-[280px] leading-relaxed font-light">
                คณะกรรมการนิสิตอักษรศาสตร์ (ก.อศ.) จุฬาฯ
                <br />
                <span className="opacity-75 text-[10px]">The Arts Student Committee, CU</span>
              </p>
            </div>

            {/* Links List */}
            <div className="space-y-2.5 pb-6">
              {LINKTREE_ITEMS.map((item) => {
                if (item.isHeader) {
                  return (
                    <div
                      key={item.id}
                      className="pt-3 pb-1 px-1 flex items-center gap-2 select-none"
                    >
                      <div className="h-[1px] flex-1 bg-white/20" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-pink-300">
                        {item.title}
                      </span>
                      <div className="h-[1px] flex-1 bg-white/20" />
                    </div>
                  );
                }

                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white/95 hover:bg-white text-[#1C205D] rounded-[18px] py-2.5 px-3.5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:scale-[1.015] active:scale-[0.985] transition-all duration-200 group text-left border border-white/40"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-7 h-7 rounded-full bg-[#F5F6FA] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        {item.icon || <Globe className="w-4 h-4 text-[#D23976]" />}
                      </div>
                      <span className="text-[12px] font-semibold leading-snug line-clamp-2 text-[#2D2B52] group-hover:text-[#D23976] transition-colors">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-pink-100 text-[#D23976]">
                          {item.badge}
                        </span>
                      )}
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#D23976] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Bottom Linktree footer */}
            <div className="pt-2 pb-4 text-center">
              <a
                href="https://linktr.ee/artsgoz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-white/70 hover:text-white transition-colors py-1 px-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              >
                <span>เปิด Linktree ของ ก.อศ. ทั้งหมด</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Home Indicator Swipe Bar */}
          <div className="shrink-0 h-5 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="w-28 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Helpful scroll & click hint caption below device */}
      <div className="flex items-center gap-1.5 mt-3 text-xs text-[#71717A]">
        <Sparkles className="w-3.5 h-3.5 text-[#D23976]" />
        <span>สามารถเลื่อนสกอร์และคลิกเปิดแต่ละลิงก์ได้โดยตรง</span>
      </div>
    </div>
  );
}
export default LinktreeMiniScreen;
