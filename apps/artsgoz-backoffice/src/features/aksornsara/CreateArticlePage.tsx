import { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronLeft,
  Eye,
  ArrowLeft,
  UploadCloud,
  Calendar,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Check,
  X,
  Bookmark,
  Share2,
} from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';

export function CreateArticlePage() {
  const navigate = useNavigate();

  // Mode: 'edit' or 'preview' (Figma Node 6667:22959)
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  // Confirmation Modal (Figma Node 6564:23190)
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('10 วิธีจัดโต๊ะทำงานแบบ Minimalist เพิ่ม Productivity');
  const [content, setContent] = useState(
    'สภาพแวดล้อมในการทำงานมีผลอย่างมากต่อประสิทธิภาพการทำงานของเรา โต๊ะทำงานที่รกและเต็มไปด้วยสิ่งของที่ไม่จำเป็นมักจะทำให้จิตใจว้าวุ่นและลดทอนสมาธิ ในทางกลับกัน การจัดโต๊ะทำงานแบบมินิมอล (Minimalist) ไม่เพียงแต่ช่วยให้พื้นที่ดูสะอาดตา แต่ยังช่วยเพิ่ม Productivity ได้อย่างไม่น่าเชื่อ\n\n' +
    '1. เริ่มต้นด้วยการ "ทิ้ง"\n' +
    'กฎข้อแรกของความมินิมอลคือการกำจัดสิ่งที่ไม่จำเป็น เอาของทุกอย่างออกจากโต๊ะ แล้วเลือกเก็บไว้เฉพาะสิ่งที่ต้องใช้ทุกวันจริงๆ เช่น คอมพิวเตอร์ สมุดโน้ตหนึ่งเล่ม และปากกาหนึ่งด้าม ส่วนของที่ใช้นานๆ ครั้ง ให้เก็บลงลิ้นชัก\n\n' +
    '2. ซ่อนสายไฟให้มิดชิด\n' +
    'สายไฟที่พันกันยุ่งเหยิงคือศัตรูตัวฉกาจของความเรียบง่าย ใช้กล่องเก็บสายไฟ หรือสายรัดเพื่อจัดระเบียบสายชาร์จและสายอุปกรณ์ต่างๆ ให้หลบสายตา จะทำให้โต๊ะดูโล่งขึ้นทันที\n\n' +
    '"พื้นที่ว่างบนโต๊ะทำงาน คือพื้นที่ว่างในสมองสำหรับการคิดสร้างสรรค์"\n\n' +
    '3. เลือกใช้สีคุมโทน\n' +
    'สีมีผลต่ออารมณ์ พยายามเลือกอุปกรณ์สำนักงานที่มีสีโทนเดียวกัน หรือโทนสีกลางๆ (Neutral tones) เช่น ขาว เทา ดำ หรือสีไม้ธรรมชาติ หลีกเลี่ยงสีสันที่ฉูดฉาดเกินไปหลายๆ สีปนกัน เพราะจะทำให้ตาลายตา'
  );

  // Cover Image
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sidebar Settings
  const [visibility, setVisibility] = useState('สาธารณะ');
  const [publishDate, setPublishDate] = useState('01/01/2569 , 10:30 AM');

  // Categories
  const [categories, setCategories] = useState<{ id: string; name: string; checked: boolean }[]>([
    { id: '1', name: 'ภาษา', checked: true },
    { id: '2', name: 'ปรัชญา', checked: false },
    { id: '3', name: 'ทั่วไป', checked: false },
  ]);
  const [newCatName, setNewCatName] = useState('');
  const [showAddCatInput, setShowAddCatInput] = useState(false);

  // Tags
  const [tags, setTags] = useState<string[]>(['อาหรับ', 'AI']);
  const [tagInput, setTagInput] = useState('');

  // SEO Settings
  const [slug, setSlug] = useState('10-ways-minimalist-desk-productivity');
  const [metaDesc, setMetaDesc] = useState('คำอธิบายสั้นๆ สำหรับ Google');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverImage(url);
    }
  };

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, checked: !cat.checked } : cat))
    );
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    setCategories((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newCatName.trim(), checked: true },
    ]);
    setNewCatName('');
    setShowAddCatInput(false);
  };

  const handleAddTag = () => {
    if (!tagInput.trim() || tags.includes(tagInput.trim())) return;
    setTags((prev) => [...prev, tagInput.trim()]);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSaveDraft = () => {
    showToast('บันทึกร่างบทความเรียบร้อยแล้ว');
  };

  const handleConfirmPublish = () => {
    setShowPublishModal(false);
    showToast('เผยแพร่บทความสำเร็จแล้ว!');
    setTimeout(() => {
      navigate('/aksornsara/published-articles');
    }, 1200);
  };

  return (
    <AksornsaraLayout
      showBackButton={false}
      showTopSearchBar={false}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed top-8 right-8 z-50 bg-[#1A1C1C] text-white px-6 py-3 rounded-[12px] shadow-xl flex items-center gap-2 transition-all"
          style={{ fontFamily: 'ChulaCharasNew, sans-serif', fontSize: 16 }}
        >
          <Check size={18} color="#64A93C" strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          CONFIRMATION POPUP MODAL (Figma Node 6564:23190)
          ══════════════════════════════════════════════════════════════════════ */}
      {showPublishModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setShowPublishModal(false)}
        >
          <div
            className="bg-white rounded-[24px] p-8 md:p-10 shadow-2xl flex flex-col items-center justify-center gap-8 relative"
            style={{
              width: 600,
              maxWidth: '92vw',
              minHeight: 280,
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title */}
            <h2
              className="font-bold text-[#1A1C1C] text-center m-0"
              style={{
                fontFamily: 'ChulaCharasNew, sans-serif',
                fontSize: 32,
                lineHeight: '40px',
              }}
            >
              ยืนยันการส่งบทความ ?
            </h2>

            {/* Modal Actions */}
            <div className="flex items-center justify-center gap-6 w-full">
              {/* แก้ไขต่อ Button */}
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="cursor-pointer border-none font-bold text-[#1A1C1C] transition-opacity hover:opacity-85 active:scale-95 flex items-center justify-center"
                style={{
                  width: 140,
                  height: 48,
                  borderRadius: 10,
                  backgroundColor: '#F5CDDC',
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  fontSize: 16,
                }}
              >
                แก้ไขต่อ
              </button>

              {/* เผยแพร่ Button */}
              <button
                type="button"
                onClick={handleConfirmPublish}
                className="cursor-pointer border-none font-bold text-white transition-opacity hover:opacity-90 active:scale-95 flex items-center justify-center shadow-sm"
                style={{
                  width: 140,
                  height: 48,
                  borderRadius: 10,
                  backgroundColor: '#DE5D8F',
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  fontSize: 16,
                }}
              >
                เผยแพร่
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODE: PREVIEW (Figma Node 6667:22959)
          ══════════════════════════════════════════════════════════════════════ */}
      {mode === 'preview' ? (
        <div className="w-full flex flex-col gap-6" style={{ maxWidth: 960 }}>
          {/* Top Banner */}
          <div
            className="bg-white rounded-[16px] border border-[#DFDFE0] p-4 flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#FCEFF4' }}
              >
                <Eye size={20} color="#DE5D8F" />
              </div>
              <div className="flex flex-col">
                <span
                  className="font-bold text-[#1A1C1C] text-[16px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  โหมดแสดงตัวอย่าง (Preview Mode)
                </span>
                <span
                  className="text-[#8B8B8C] text-[13px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  ดูตัวอย่างบทความก่อนเผยแพร่จริง
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Back to Edit Button */}
              <button
                type="button"
                onClick={() => setMode('edit')}
                className="flex items-center gap-1.5 cursor-pointer bg-white transition-colors hover:bg-[#FCEFF4] active:scale-95"
                style={{
                  border: '1.5px solid #DE5D8F',
                  color: '#DE5D8F',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 18px',
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <ArrowLeft size={16} color="#DE5D8F" />
                <span>ย้อนกลับ</span>
              </button>

              {/* Publish Button */}
              <button
                type="button"
                onClick={() => setShowPublishModal(true)}
                className="flex items-center gap-1.5 cursor-pointer border-none text-white transition-all hover:bg-[#CA5582] active:scale-95 shadow-sm"
                style={{
                  backgroundColor: '#DE5D8F',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 22px',
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                <span>เผยแพร่</span>
              </button>
            </div>
          </div>

          {/* Article Preview Card Paper */}
          <div
            className="bg-white rounded-[16px] border border-[#DFDFE0] p-8 md:p-12 shadow-sm flex flex-col gap-8 mx-auto w-full"
            style={{ maxWidth: 840 }}
          >
            {/* Cover Image if uploaded */}
            {coverImage && (
              <div className="w-full rounded-[12px] overflow-hidden max-h-[380px]">
                <img
                  src={coverImage}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Title */}
            <h1
              className="font-bold text-[#1A1C1C] m-0"
              style={{
                fontFamily: 'ChulaCharasNew, sans-serif',
                fontSize: 36,
                lineHeight: '46px',
              }}
            >
              {title || '10 วิธีจัดโต๊ะทำงานแบบ Minimalist เพิ่ม Productivity'}
            </h1>

            {/* Author & Meta Row */}
            <div className="flex items-center justify-between pb-6 border-b border-[#F0F0F0]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#F5CDDC] flex items-center justify-center font-bold text-[#DE5D8F] text-[18px]">
                  ว
                </div>
                <div className="flex flex-col">
                  <span
                    className="font-bold text-[#1A1C1C] text-[16px]"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    วิภาวรรณ แสงสุข
                  </span>
                  <span
                    className="text-[#8B8B8C] text-[13px]"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    1 มกราคม 2568 • อ่าน 5 นาที
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-[#FCEFF4] flex items-center justify-center border-none cursor-pointer hover:bg-[#F5CDDC] transition-colors"
                >
                  <Bookmark size={16} color="#DE5D8F" />
                </button>
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-[#FCEFF4] flex items-center justify-center border-none cursor-pointer hover:bg-[#F5CDDC] transition-colors"
                >
                  <Share2 size={16} color="#DE5D8F" />
                </button>
              </div>
            </div>

            {/* Article Formatted Body Text (Figma Node 6667:22959) */}
            <div
              className="flex flex-col gap-6 text-[#1A1C1C] leading-[28px]"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif', fontSize: 18 }}
            >
              <p className="m-0 text-[#404041]">
                สภาพแวดล้อมในการทำงานมีผลอย่างมากต่อประสิทธิภาพการทำงานของเรา โต๊ะทำงานที่รกและเต็มไปด้วยสิ่งของที่ไม่จำเป็นมักจะทำให้จิตใจว้าวุ่นและลดทอนสมาธิ ในทางกลับกัน การจัดโต๊ะทำงานแบบมินิมอล (Minimalist) ไม่เพียงแต่ช่วยให้พื้นที่ดูสะอาดตา แต่ยังช่วยเพิ่ม Productivity ได้อย่างไม่น่าเชื่อ
              </p>

              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-[22px] text-[#1A1C1C] m-0">
                  1. เริ่มต้นด้วยการ "ทิ้ง"
                </h3>
                <p className="m-0 text-[#404041]">
                  กฎข้อแรกของความมินิมอลคือการกำจัดสิ่งที่ไม่จำเป็น เอาของทุกอย่างออกจากโต๊ะ แล้วเลือกเก็บไว้เฉพาะสิ่งที่ต้องใช้ทุกวันจริงๆ เช่น คอมพิวเตอร์ สมุดโน้ตหนึ่งเล่ม และปากกาหนึ่งด้าม ส่วนของที่ใช้นานๆ ครั้ง ให้เก็บลงลิ้นชัก
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-[22px] text-[#1A1C1C] m-0">
                  2. ซ่อนสายไฟให้มิดชิด
                </h3>
                <p className="m-0 text-[#404041]">
                  สายไฟที่พันกันยุ่งเหยิงคือศัตรูตัวฉกาจของความเรียบง่าย ใช้กล่องเก็บสายไฟ หรือสายรัดเพื่อจัดระเบียบสายชาร์จและสายอุปกรณ์ต่างๆ ให้หลบสายตา จะทำให้โต๊ะดูโล่งขึ้นทันที
                </p>
              </div>

              {/* Highlight Quote Box */}
              <div
                className="p-5 rounded-[12px] my-2"
                style={{
                  backgroundColor: '#F7F8F9',
                  borderLeft: '4px solid #DE5D8F',
                }}
              >
                <p
                  className="m-0 font-medium text-[#1A1C1C] italic text-center text-[18px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  "พื้นที่ว่างบนโต๊ะทำงาน คือพื้นที่ว่างในสมองสำหรับการคิดสร้างสรรค์"
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-[22px] text-[#1A1C1C] m-0">
                  3. เลือกใช้สีคุมโทน
                </h3>
                <p className="m-0 text-[#404041]">
                  สีมีผลต่ออารมณ์ พยายามเลือกอุปกรณ์สำนักงานที่มีสีโทนเดียวกัน หรือโทนสีกลางๆ (Neutral tones) เช่น ขาว เทา ดำ หรือสีไม้ธรรมชาติ หลีกเลี่ยงสีสันที่ฉูดฉาดเกินไปหลายๆ สีปนกัน เพราะจะทำให้ตาลายตา
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════════
            MODE: EDIT (Figma Node 6608:22893)
            ══════════════════════════════════════════════════════════════════════ */
        <div className="w-full flex flex-col gap-6" style={{ maxWidth: 960 }}>
          {/* Header Row: Back button, Title, Action Buttons */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/aksornsara/articles')}
                className="w-9 h-9 rounded-full bg-white border border-[#DFDFE0] flex items-center justify-center cursor-pointer hover:bg-[#FCEFF4] transition-colors"
                title="ย้อนกลับ"
              >
                <ChevronLeft size={20} color="#1A1C1C" />
              </button>
              <h1
                className="font-bold text-[#1A1C1C] m-0"
                style={{
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  fontSize: 32,
                  lineHeight: '40px',
                }}
              >
                ร่างบทความ
              </h1>
            </div>

            {/* Top Action Buttons (Figma Node 6608:22893) */}
            <div className="flex items-center gap-3">
              {/* Preview Mode Button */}
              <button
                id="btn-preview-mode"
                type="button"
                onClick={() => setMode('preview')}
                className="flex items-center gap-1.5 cursor-pointer bg-white transition-colors hover:bg-[#FCEFF4] active:scale-95 shadow-xs"
                style={{
                  border: '1.5px solid #DE5D8F',
                  color: '#DE5D8F',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 18px',
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <Eye size={16} color="#DE5D8F" />
                <span>Preview mode</span>
              </button>

              {/* บันทึกร่างบทความ Button */}
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 cursor-pointer bg-white transition-colors hover:bg-[#FCEFF4] active:scale-95 shadow-xs"
                style={{
                  border: '1.5px solid #DE5D8F',
                  color: '#DE5D8F',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 18px',
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <span>บันทึกร่างบทความ</span>
              </button>

              {/* เผยแพร่ Button */}
              <button
                id="btn-publish-open"
                type="button"
                onClick={() => setShowPublishModal(true)}
                className="flex items-center gap-1.5 cursor-pointer border-none text-white transition-all hover:bg-[#CA5582] active:scale-95 shadow-sm"
                style={{
                  backgroundColor: '#DE5D8F',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 24px',
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <span>เผยแพร่</span>
              </button>
            </div>
          </div>

          {/* 2-Column Form Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* ── LEFT COLUMN (Main Editor, span 2) ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Title Card */}
              <div
                className="bg-white rounded-[16px] border border-[#DFDFE0] p-4 shadow-xs"
              >
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ชื่อบทความabcde"
                  className="w-full bg-transparent outline-none font-bold text-[#1A1C1C] placeholder-[#99999A]"
                  style={{
                    fontFamily: 'ChulaCharasNew, sans-serif',
                    fontSize: 22,
                    lineHeight: '28px',
                  }}
                />
              </div>

              {/* Rich Text Editor Card */}
              <div
                className="bg-white rounded-[16px] border border-[#DFDFE0] overflow-hidden shadow-xs flex flex-col"
              >
                {/* Formatting Toolbar */}
                <div
                  className="flex items-center gap-1 px-3 py-2 bg-[#F7F8F9] border-b border-[#DFDFE0] flex-wrap"
                >
                  <button
                    type="button"
                    className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer font-bold"
                    title="Bold"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer italic"
                    title="Italic"
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer underline"
                    title="Underline"
                  >
                    <Underline size={16} />
                  </button>

                  <div className="w-[1px] h-5 bg-[#DFDFE0] mx-1" />

                  <button
                    type="button"
                    className="px-2 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer font-bold text-[13px]"
                    title="Heading 1"
                  >
                    <Heading1 size={16} />
                  </button>
                  <button
                    type="button"
                    className="px-2 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer font-bold text-[13px]"
                    title="Heading 2"
                  >
                    <Heading2 size={16} />
                  </button>

                  <div className="w-[1px] h-5 bg-[#DFDFE0] mx-1" />

                  <button
                    type="button"
                    className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer"
                    title="Bullet List"
                  >
                    <List size={16} />
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer"
                    title="Numbered List"
                  >
                    <ListOrdered size={16} />
                  </button>

                  <div className="w-[1px] h-5 bg-[#DFDFE0] mx-1" />

                  <button
                    type="button"
                    className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer"
                    title="Insert Link"
                  >
                    <LinkIcon size={16} />
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer"
                    title="Insert Image"
                  >
                    <ImageIcon size={16} />
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer"
                    title="Blockquote"
                  >
                    <Quote size={16} />
                  </button>
                </div>

                {/* Editor Textarea */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your content here..."
                  className="w-full p-5 bg-transparent outline-none resize-y text-[#1A1C1C] leading-[26px]"
                  style={{
                    fontFamily: 'ChulaCharasNew, sans-serif',
                    fontSize: 16,
                    minHeight: 340,
                    border: 'none',
                  }}
                />
              </div>

              {/* Cover Image Upload Card (รูปภาพหน้าปก) */}
              <div
                className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-3 shadow-xs"
              >
                <h3
                  className="font-bold text-[#1A1C1C] m-0 text-[18px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  รูปภาพหน้าปก
                </h3>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/svg+xml,image/png,image/jpeg,image/gif"
                  className="hidden"
                />

                {coverImage ? (
                  <div className="relative rounded-[12px] overflow-hidden border border-[#DFDFE0] max-h-[260px] group">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white text-[#1A1C1C] rounded-full font-bold text-[13px] border-none cursor-pointer"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        เปลี่ยนรูปภาพ
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverImage(null)}
                        className="px-4 py-2 bg-[#DE5D8F] text-white rounded-full font-bold text-[13px] border-none cursor-pointer"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        ลบรูปภาพ
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#DFDFE0] hover:border-[#DE5D8F] rounded-[12px] p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#FAFAFA] hover:bg-[#FFF9FB]"
                  >
                    <div
                      className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-3"
                      style={{ backgroundColor: '#FCEFF4' }}
                    >
                      <UploadCloud size={24} color="#DE5D8F" />
                    </div>
                    <span
                      className="font-bold text-[#1A1C1C] text-[15px]"
                      style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                    >
                      คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง
                    </span>
                    <span
                      className="text-[#8B8B8C] text-[12px] mt-1 text-center"
                      style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                    >
                      รองรับไฟล์ประเภท SVG, PNG, JPG หรือ GIF (ขนาดสูงสุดไม่เกิน 1600x900 พิกเซล)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT COLUMN (Sidebar Settings) ── */}
            <div className="flex flex-col gap-6">
              {/* Panel 1: สถานะและการมองเห็น */}
              <div
                className="bg-white rounded-[16px] border border-[#DFDFE0] p-5 flex flex-col gap-4 shadow-xs"
              >
                <h3
                  className="font-bold text-[#1A1C1C] m-0 text-[16px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  สถานะและการมองเห็น
                </h3>

                {/* การมองเห็น */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[#6D6D6D] text-[14px] font-bold"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    การมองเห็น
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full border border-[#DFDFE0] rounded-[8px] px-3 py-2 text-[14px] text-[#1A1C1C] bg-white outline-none focus:border-[#DE5D8F]"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    <option value="สาธารณะ">สาธารณะ</option>
                    <option value="ส่วนตัว">ส่วนตัว</option>
                    <option value="เฉพาะสมาชิก">เฉพาะสมาชิก</option>
                  </select>
                </div>

                {/* วันที่เผยแพร่ */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[#6D6D6D] text-[14px] font-bold"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    วันที่เผยแพร่
                  </label>
                  <div
                    className="flex items-center gap-2 border border-[#DFDFE0] rounded-[8px] px-3 py-2 bg-white"
                  >
                    <Calendar size={16} color="#6D6D6D" className="shrink-0" />
                    <input
                      type="text"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                      className="w-full bg-transparent outline-none text-[14px] text-[#1A1C1C]"
                      style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                    />
                  </div>
                </div>
              </div>

              {/* Panel 2: ตั้งค่าหมวดหมู่ */}
              <div
                className="bg-white rounded-[16px] border border-[#DFDFE0] p-5 flex flex-col gap-4 shadow-xs"
              >
                <h3
                  className="font-bold text-[#1A1C1C] m-0 text-[16px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  ตั้งค่าหมวดหมู่
                </h3>

                {/* หมวดหมู่ Checkboxes */}
                <div className="flex flex-col gap-2">
                  <span
                    className="text-[#6D6D6D] text-[14px] font-bold"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    หมวดหมู่
                  </span>

                  <div className="flex flex-col gap-2 pl-0.5">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className="flex items-center gap-2 cursor-pointer select-none group"
                      >
                        <div
                          className="w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors shrink-0"
                          style={{
                            backgroundColor: cat.checked ? '#DE5D8F' : '#FFFFFF',
                            border: cat.checked ? '1.5px solid #DE5D8F' : '1.5px solid #DFDFE0',
                          }}
                        >
                          {cat.checked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                        </div>
                        <span
                          className="text-[#1A1C1C] text-[14px]"
                          style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                        >
                          {cat.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {showAddCatInput ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="ชื่อหมวดหมู่..."
                        className="flex-1 border border-[#DFDFE0] rounded-[6px] px-2 py-1 text-[13px] outline-none"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-2 py-1 bg-[#DE5D8F] text-white rounded-[6px] text-[12px] font-bold border-none cursor-pointer"
                      >
                        เพิ่ม
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAddCatInput(true)}
                      className="text-[#DE5D8F] hover:underline text-[13px] font-bold text-left cursor-pointer border-none bg-transparent p-0 mt-1"
                      style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                    >
                      + เพิ่มหมวดหมู่
                    </button>
                  )}
                </div>

                {/* แท็ก */}
                <div className="flex flex-col gap-2">
                  <span
                    className="text-[#6D6D6D] text-[14px] font-bold"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    แท็ก
                  </span>

                  <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-[8px] border border-[#DFDFE0] bg-white min-h-[42px]">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#F0F1F2] text-[#404041] flex items-center gap-1"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        <span>{tag}</span>
                        <X
                          size={12}
                          className="cursor-pointer hover:text-[#DE5D8F]"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="เพิ่มแท็ก..."
                      className="flex-1 min-w-[70px] bg-transparent outline-none text-[13px] text-[#1A1C1C]"
                      style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                    />
                  </div>
                </div>
              </div>

              {/* Panel 3: การตั้งค่า SEO */}
              <div
                className="bg-white rounded-[16px] border border-[#DFDFE0] p-5 flex flex-col gap-4 shadow-xs"
              >
                <h3
                  className="font-bold text-[#1A1C1C] m-0 text-[16px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  การตั้งค่า SEO
                </h3>

                {/* URL Slug */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[#6D6D6D] text-[14px] font-bold"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ลิงก์ที่ต้องการให้ปรากฏ"
                    className="w-full border border-[#DFDFE0] rounded-[8px] px-3 py-2 text-[14px] text-[#1A1C1C] outline-none focus:border-[#DE5D8F]"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  />
                </div>

                {/* Meta Description */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[#6D6D6D] text-[14px] font-bold"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    Meta Description
                  </label>
                  <textarea
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    placeholder="คำอธิบายสั้นๆ สำหรับ Google"
                    maxLength={160}
                    className="w-full border border-[#DFDFE0] rounded-[8px] p-3 text-[14px] text-[#1A1C1C] outline-none focus:border-[#DE5D8F] min-h-[72px] resize-none"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  />
                  <span
                    className="text-[#8B8B8C] text-[11px] text-right"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {metaDesc.length} / 160
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AksornsaraLayout>
  );
}
