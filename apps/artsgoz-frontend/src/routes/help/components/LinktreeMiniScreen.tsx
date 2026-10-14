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
} from 'lucide-react';
import { logoImg } from '@artsgoz/design-system';

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
    icon: <Umbrella className="w-4 h-4 text-[#64A93C]" />,
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
    icon: <FileText className="w-4 h-4 text-[#F8C135]" />,
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
    icon: <Megaphone className="w-4 h-4 text-[#DE5D8F]" />,
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
    icon: <FileText className="w-4 h-4 text-[#0165F8]" />,
  },
  {
    id: 'harassment-report',
    title: 'ฟอร์มร้องเรียนเหตุการณ์ที่เกี่ยวกับการคุกคามทางเพศสำหรับนิสิตอักษรศาสตร์ (Sexual Harassment Report)',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSc43bz4bf8QXb_HikJ0bUWt4NKWxkSEinZWDJ8J31izOIgNHw/viewform?usp=sf_link',
    icon: <AlertCircle className="w-4 h-4 text-[#EA234F]" />,
    badge: 'ความปลอดภัย',
  },
  {
    id: 'hoa-mc',
    title: 'แบบฟอร์มการขอพิธีกร HOA 69',
    url: 'https://docs.google.com/spreadsheets/d/1NgsRvADD3sDFlapd53RWAfDRImb82IN69uYImt3Bzzs/edit?gid=0#gid=0',
    icon: <FileText className="w-4 h-4 text-[#64A93C]" />,
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
    icon: <Globe className="w-4 h-4 text-[#0165F8]" />,
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
    icon: <Globe className="w-4 h-4 text-[#404041]" />,
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
    icon: <YoutubeIcon className="w-4 h-4 text-[#EA234F]" />,
    badge: 'YouTube',
  },
  {
    id: 'artsmor',
    title: 'A(RTS)mor: หลากรสเรื่องรักฉบับอักษรศาสตร์',
    url: 'http://www.linktr.ee/artsmor',
    icon: <Globe className="w-4 h-4 text-[#DE5D8F]" />,
  },
  {
    id: 'artsfem',
    title: 'Arts F(E)M: เข้าใจสตรีผ่านมิติอักษรศาสตร์',
    url: 'http://www.linktr.ee/artsfem',
    icon: <Globe className="w-4 h-4 text-[#8B5CF6]" />,
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
    <div className="w-full flex flex-col">
      {/* Clean Rectangular Card Container matching Design System */}
      <div className="w-full h-[580px] sm:h-[620px] rounded-[16px] border border-[#ECECEC] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
        
        {/* Header with Artsgoz Logo & Clean Typography */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-[#ECECEC] bg-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={logoImg}
              alt="Arts GOZ Logo"
              className="h-8 sm:h-9 w-auto object-contain shrink-0"
            />
            <div className="h-7 w-[1px] bg-[#ECECEC] shrink-0" />
            <div className="min-w-0">
              <h2 className="font-serif font-bold text-[#404041] text-[16px] sm:text-[18px] leading-tight truncate">
                Linktree @artsgoz
              </h2>
              <p className="font-serif text-[12px] text-[#6D6D6D] leading-tight truncate">
                ศูนย์รวมลิงก์และบริการ ก.อศ.
              </p>
            </div>
          </div>

          <a
            href="https://linktr.ee/artsgoz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#ECECEC] bg-[#F7F8F9] hover:bg-[#FCEFF4] hover:border-[#E992B4] text-[#404041] hover:text-[#D23976] text-xs font-serif font-bold transition-all shrink-0 cursor-pointer"
            title="เปิดในแท็บใหม่"
          >
            <span>เปิดเต็มจอ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Scrollable Rectangular Links Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 [scrollbar-width:thin] [scrollbar-color:#D0D0D1_transparent]">
          {LINKTREE_ITEMS.map((item) => {
            if (item.isHeader) {
              return (
                <div
                  key={item.id}
                  className="pt-3 pb-1 flex items-center gap-2 select-none"
                >
                  <span className="font-serif text-[13px] font-bold tracking-wide text-[#D23976]">
                    {item.title}
                  </span>
                  <div className="h-[1px] flex-1 bg-[#ECECEC]" />
                </div>
              );
            }

            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full bg-white hover:bg-[#FCEFF4]/40 border border-[#ECECEC] hover:border-[#E992B4] rounded-[8px] p-3 flex items-center justify-between gap-3 transition-all duration-150 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Square icon box */}
                  <div className="w-8 h-8 rounded-[6px] bg-[#F7F8F9] border border-[#ECECEC] group-hover:bg-[#FCEFF4] group-hover:border-[#F5CDDC] flex items-center justify-center shrink-0 transition-colors">
                    {item.icon || <Globe className="w-4 h-4 text-[#D23976]" />}
                  </div>
                  <span className="text-[13px] sm:text-[14px] font-serif font-bold text-[#404041] group-hover:text-[#D23976] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-[#FCEFF4] text-[#D23976] border border-[#F5CDDC]">
                      {item.badge}
                    </span>
                  )}
                  <ExternalLink className="w-3.5 h-3.5 text-[#99999A] group-hover:text-[#D23976] transition-colors" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer with link & copy button */}
        <div className="shrink-0 p-3 px-4 border-t border-[#ECECEC] bg-[#F7F8F9] flex items-center justify-between text-xs text-[#6D6D6D] font-serif">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-[#64A93C] shrink-0" />
            <span className="text-[#6D6D6D] truncate">linktr.ee/artsgoz</span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border border-[#ECECEC] bg-white hover:bg-[#FCEFF4] hover:border-[#E992B4] text-[#6D6D6D] hover:text-[#D23976] transition-colors cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#64A93C]" />
                <span className="text-[#64A93C] font-bold">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>แชร์ลิงก์</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Caption hint below */}
      <div className="flex items-center gap-1.5 mt-2.5 text-xs text-[#6D6D6D] font-serif">
        <span>สามารถเลื่อนสกอร์และคลิกเปิดแต่ละลิงก์ได้โดยตรง</span>
      </div>
    </div>
  );
}

export default LinktreeMiniScreen;
