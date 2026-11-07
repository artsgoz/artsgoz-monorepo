import { useState, useRef, useEffect, ChangeEvent, DragEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  ChevronLeft,
  Eye,
  ArrowLeft,
  UploadCloud,
  Check,
  X,
  Bookmark,
  Share2,
  Calendar,
} from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';
import { TiptapEditor } from './components/TiptapEditor';
import { articlesService } from './services/articlesService';
import { aksornsaraApi } from './services/apiClient';

export function CreateArticlePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  // Mode: 'edit' or 'preview'
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  // Confirmation Modal
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const initialArticle = editId ? articlesService.getById(editId) : undefined;

  // Form Fields initialized from article or blank
  const [title, setTitle] = useState(
    () => initialArticle?.title || ''
  );
  const [content, setContent] = useState(
    () => initialArticle?.contentHtml || (initialArticle ? `<p>${initialArticle.excerpt}</p>` : '')
  );

  const [author, setAuthor] = useState(() => initialArticle?.author || '');
  const [proofreader, setProofreader] = useState(() => initialArticle?.proofreader || '');
  const [illustrator, setIllustrator] = useState(() => initialArticle?.illustrator || '');

  // Cover Image
  const [coverImage, setCoverImage] = useState<string | null>(
    () => initialArticle?.coverImage || initialArticle?.imageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sidebar Settings
  const [visibility, setVisibility] = useState(() => initialArticle?.visibility || 'สาธารณะ');
  const [publishDate] = useState(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const yr = now.getFullYear() + 543;
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${yr} , ${hours}:${mins}`;
  });

  // Categories (Blank when creating new, or loaded from initialArticle)
  const [categories, setCategories] = useState<{ id: string; name: string; checked: boolean }[]>(() => {
    const base = [
      { id: '1', name: 'ศิลปะ', checked: false },
      { id: '2', name: 'วรรณกรรม', checked: false },
      { id: '3', name: 'ภาษา', checked: false },
      { id: '4', name: 'วัฒนธรรม', checked: false },
      { id: '5', name: 'ปรัชญา', checked: false },
      { id: '6', name: 'วิจารณ์', checked: false },
      { id: '7', name: 'ทั่วไป', checked: false },
    ];
    const initialCats = initialArticle?.categories || (initialArticle?.category ? [initialArticle.category] : []);
    if (initialCats.length > 0) {
      const set = new Set(initialCats);
      const mapped = base.map((c) => ({ ...c, checked: set.has(c.name) }));
      const customCats = initialCats
        .filter((c) => !base.some((b) => b.name === c))
        .map((c) => ({ id: `cat-${c}`, name: c, checked: true }));
      return [...mapped, ...customCats];
    }
    return base;
  });
  const [newCatName, setNewCatName] = useState('');
  const [showAddCatInput, setShowAddCatInput] = useState(false);

  // Tags
  const [tags, setTags] = useState<string[]>(
    () => initialArticle?.tags || []
  );
  const [tagInput, setTagInput] = useState('');

  // SEO Settings
  const [slug, setSlug] = useState(() => initialArticle?.slug || initialArticle?.id || '');
  const [metaDesc, setMetaDesc] = useState(() => initialArticle?.metaDescription || initialArticle?.excerpt || '');

  // Drag and Drop Cover Image State
  const [isDragging, setIsDragging] = useState(false);

  // Focus trap ref for publish modal
  const modalRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Prevent accidental leave when form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (title.trim() || content.trim()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [title, content]);

  // Modal focus trap & Escape key handler (E2E-007)
  useEffect(() => {
    if (!showPublishModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPublishModal(false);
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPublishModal]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setCoverImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);

      // Async upload to backend media API
      aksornsaraApi.uploadMedia(file).then((res) => {
        if (res?.success && res.data?.url) {
          setCoverImage(res.data.url);
        }
      }).catch(() => {
        // Fallback to base64 preview
      });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setCoverImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);

      aksornsaraApi.uploadMedia(file).then((res) => {
        if (res?.success && res.data?.url) {
          setCoverImage(res.data.url);
        }
      }).catch(() => {});
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

  const validateForPublish = (): boolean => {
    if (!title.trim()) {
      showToast('กรุณากรอกชื่อบทความก่อนเผยแพร่');
      return false;
    }
    const cleanContent = content.replace(/<[^>]+>/g, '').trim();
    if (!cleanContent) {
      showToast('กรุณากรอกเนื้อหาบทความก่อนเผยแพร่');
      return false;
    }
    if (slug.trim() && articlesService.isSlugTaken(slug, editId || undefined)) {
      showToast('URL Slug นี้ถูกใช้งานแล้ว กรุณาเปลี่ยนเป็นชื่ออื่น');
      return false;
    }
    return true;
  };

  const handleOpenPublishModal = () => {
    if (!validateForPublish()) return;
    setShowPublishModal(true);
  };

  const handleSaveDraft = () => {
    const selectedCats = categories.filter((c) => c.checked).map((c) => c.name);
    const category = selectedCats[0] || 'ทั่วไป';

    if (slug.trim() && articlesService.isSlugTaken(slug, editId || undefined)) {
      showToast('URL Slug นี้ถูกใช้งานแล้ว กรุณาเปลี่ยนเป็นชื่ออื่น');
      return;
    }

    const cleanExcerpt = content.replace(/<[^>]+>/g, '').slice(0, 180) + '...';
    const finalTitle = title.trim() || 'บทความฉบับร่าง';
    const finalAuthor = author.trim() || 'ชมรมสาราณียกร';

    if (editId) {
      articlesService.update(editId, {
        title: finalTitle,
        contentHtml: content,
        excerpt: cleanExcerpt,
        author: finalAuthor,
        proofreader,
        illustrator,
        category,
        categories: selectedCats.length > 0 ? selectedCats : [category],
        metaDescription: metaDesc,
        coverImage: coverImage || undefined,
        imageUrl: coverImage || undefined,
        status: 'ร่างบทความ',
        tags,
        slug,
      });
      showToast('บันทึกร่างบทความเรียบร้อยแล้ว');
    } else {
      const created = articlesService.create({
        title: finalTitle,
        contentHtml: content,
        excerpt: cleanExcerpt,
        author: finalAuthor,
        proofreader,
        illustrator,
        category,
        categories: selectedCats.length > 0 ? selectedCats : [category],
        metaDescription: metaDesc,
        coverImage: coverImage || undefined,
        imageUrl: coverImage || undefined,
        status: 'ร่างบทความ',
        tags,
        slug,
      });
      showToast('บันทึกร่างบทความเรียบร้อยแล้ว');
      navigate(`/aksornsara/create?id=${created.id}`, { replace: true });
    }
  };

  const handleConfirmPublish = () => {
    if (!validateForPublish()) return;
    setShowPublishModal(false);
    const selectedCats = categories.filter((c) => c.checked).map((c) => c.name);
    const category = selectedCats[0] || 'ทั่วไป';

    const cleanExcerpt = content.replace(/<[^>]+>/g, '').slice(0, 180) + '...';
    const finalTitle = title.trim();
    const finalAuthor = author.trim() || 'ชมรมสาราณียกร';

    if (editId) {
      articlesService.update(editId, {
        title: finalTitle,
        contentHtml: content,
        excerpt: cleanExcerpt,
        author: finalAuthor,
        proofreader,
        illustrator,
        category,
        categories: selectedCats.length > 0 ? selectedCats : [category],
        metaDescription: metaDesc,
        coverImage: coverImage || undefined,
        imageUrl: coverImage || undefined,
        status: 'เผยแพร่แล้ว',
        tags,
        slug,
      });
    } else {
      articlesService.create({
        title: finalTitle,
        contentHtml: content,
        excerpt: cleanExcerpt,
        author: finalAuthor,
        proofreader,
        illustrator,
        category,
        categories: selectedCats.length > 0 ? selectedCats : [category],
        metaDescription: metaDesc,
        coverImage: coverImage || undefined,
        imageUrl: coverImage || undefined,
        status: 'เผยแพร่แล้ว',
        tags,
        slug,
      });
    }

    showToast('เผยแพร่บทความสำเร็จแล้ว!');
    setTimeout(() => {
      navigate('/aksornsara/published-articles');
    }, 1200);
  };

  return (
    <AksornsaraLayout showBackButton={false} showTopSearchBar={false}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed top-8 right-8 z-50 bg-[#1A1C1C] text-white px-6 py-3 rounded-[12px] shadow-xl flex items-center gap-2 transition-all font-serif"
          style={{ fontSize: 16 }}
        >
          <Check size={18} color="#64A93C" strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {showPublishModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setShowPublishModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={modalRef}
            className="bg-white rounded-[24px] p-8 md:p-10 shadow-2xl flex flex-col items-center justify-center gap-8 relative"
            style={{
              width: 600,
              maxWidth: '92vw',
              minHeight: 280,
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="font-bold text-[#1A1C1C] text-center m-0 font-serif"
              style={{ fontSize: 32, lineHeight: '40px' }}
            >
              {editId ? 'ยืนยันการบันทึกและเผยแพร่ ?' : 'ยืนยันการส่งบทความ ?'}
            </h2>

            <div className="flex items-center justify-center gap-6 w-full">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="cursor-pointer border-none font-bold text-[#1A1C1C] transition-opacity hover:opacity-85 active:scale-95 flex items-center justify-center font-serif"
                style={{
                  width: 140,
                  height: 48,
                  borderRadius: 10,
                  backgroundColor: '#F5CDDC',
                  fontSize: 16,
                }}
              >
                แก้ไขต่อ
              </button>

              <button
                type="button"
                onClick={handleConfirmPublish}
                className="cursor-pointer border-none font-bold text-white transition-opacity hover:opacity-90 active:scale-95 flex items-center justify-center shadow-sm font-serif"
                style={{
                  width: 140,
                  height: 48,
                  borderRadius: 10,
                  backgroundColor: '#E992B4',
                  fontSize: 16,
                }}
              >
                เผยแพร่
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'preview' ? (
        /* ══════════════════════════════════════════════════════════════════════
            MODE: PREVIEW
            ══════════════════════════════════════════════════════════════════════ */
        <div className="w-full flex flex-col gap-6" style={{ maxWidth: 960 }}>
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#DFDFE0] pb-4 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMode('edit')}
                className="flex items-center gap-2 cursor-pointer border-none bg-transparent font-bold text-[#DE5D8F] hover:text-[#CA5582] transition-colors p-0 font-serif"
                style={{ fontSize: 16 }}
              >
                <ArrowLeft size={18} />
                <span>กลับไปหน้าแก้ไข</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMode('edit')}
                className="cursor-pointer bg-white transition-colors hover:bg-[#FCEFF4] active:scale-95 font-serif"
                style={{
                  border: '1.5px solid #DE5D8F',
                  color: '#DE5D8F',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 20px',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                แก้ไขต่อ
              </button>

              <button
                type="button"
                onClick={handleOpenPublishModal}
                className="cursor-pointer border-none text-white transition-opacity hover:opacity-90 active:scale-95 shadow-sm font-serif"
                style={{
                  backgroundColor: '#E992B4',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 24px',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                เผยแพร่
              </button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="bg-white rounded-[20px] p-8 md:p-12 shadow-sm border border-[#DFDFE0] flex flex-col gap-8 max-w-[840px] mx-auto w-full">
            {/* Category badges (Multi-category support) */}
            <div className="flex items-center gap-2 flex-wrap">
              {categories.filter((c) => c.checked).length > 0 ? (
                categories
                  .filter((c) => c.checked)
                  .map((c) => (
                    <span
                      key={c.id}
                      className="font-sans font-normal text-[14px] text-[#DE5D8F] bg-[#FCEFF4] rounded-[11px] px-3.5 py-1.5"
                      style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}
                    >
                      {c.name.replace(/^ปี\s*/, '')}
                    </span>
                  ))
              ) : (
                <span
                  className="font-sans font-normal text-[14px] text-[#DE5D8F] bg-[#FCEFF4] rounded-[11px] px-3.5 py-1.5"
                  style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}
                >
                  ทั่วไป
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif font-bold text-[28px] sm:text-[36px] md:text-[42px] leading-tight text-[#1A1C1C] m-0">
              {title}
            </h1>

            {/* Author / Date info */}
            <div className="flex items-center justify-between border-y border-[#DFDFE0] py-4 text-[#6D6D6D] font-serif text-[14px]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-black">{author}</span>
                {proofreader && <span>• พิสูจน์อักษร: {proofreader}</span>}
                {illustrator && <span>• ภาพ: {illustrator}</span>}
                <span>|</span>
                <span>{publishDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bookmark size={18} className="cursor-pointer text-[#F8C135]" />
                <Share2 size={18} className="cursor-pointer text-gray-400 hover:text-black" />
              </div>
            </div>

            {/* Cover Image */}
            {coverImage && (
              <div className="w-full aspect-[16/9] rounded-[16px] overflow-hidden bg-gray-100 shadow-xs">
                <img src={coverImage} alt={title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* TipTap Rich HTML Content */}
            <div
              className="tiptap-content font-serif text-[18px] leading-[32px] text-[#2B2B2B] flex flex-col gap-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════════
            MODE: EDIT
            ══════════════════════════════════════════════════════════════════════ */
        <div className="w-full flex flex-col gap-6" style={{ maxWidth: 960 }}>
          {/* Header Row */}
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
                className="font-bold text-[#1A1C1C] m-0 font-serif"
                style={{ fontSize: 32, lineHeight: '40px' }}
              >
                {editId ? `แก้ไขบทความ (${editId})` : 'สร้างบทความใหม่'}
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Preview Mode */}
              <button
                id="btn-preview-mode"
                type="button"
                onClick={() => setMode('preview')}
                className="flex items-center gap-1.5 cursor-pointer bg-white transition-colors hover:bg-[#FCEFF4] active:scale-95 shadow-xs font-serif"
                style={{
                  border: '1.5px solid #DE5D8F',
                  color: '#DE5D8F',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 18px',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <Eye size={16} color="#DE5D8F" />
                <span>Preview mode</span>
              </button>

              {/* Save Draft */}
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 cursor-pointer bg-white transition-colors hover:bg-[#FCEFF4] active:scale-95 shadow-xs font-serif"
                style={{
                  border: '1.5px solid #DE5D8F',
                  color: '#DE5D8F',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 18px',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <span>บันทึกร่างบทความ</span>
              </button>

              {/* Publish */}
              <button
                id="btn-publish-open"
                type="button"
                onClick={handleOpenPublishModal}
                className="flex items-center gap-1.5 cursor-pointer border-none text-white transition-opacity hover:opacity-90 active:scale-95 shadow-sm font-serif"
                style={{
                  backgroundColor: '#E992B4',
                  borderRadius: 9999,
                  height: 38,
                  padding: '0 24px',
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
            {/* ── LEFT COLUMN (TipTap Rich Editor, span 2) ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Title Input Card */}
              <div className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-2 shadow-xs">
                <label
                  className="font-bold text-[#1A1C1C] text-[18px] font-serif"
                >
                  ชื่อบทความ *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ใส่ชื่อบทความ..."
                  className="w-full px-4 py-3 rounded-[10px] border border-[#DFDFE0] outline-none text-[#1A1C1C] font-serif text-[18px] focus:border-[#DE5D8F] transition-colors"
                />
              </div>

              {/* TipTap Rich Text Editor Card */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-bold text-[#1A1C1C] text-[18px] font-serif"
                >
                  เนื้อหาบทความ (TipTap Rich Text Editor) *
                </label>
                <TiptapEditor
                  content={content}
                  onChange={setContent}
                />
              </div>

              {/* Cover Image Upload Card */}
              <div className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-3 shadow-xs">
                <h3 className="font-bold text-[#1A1C1C] m-0 text-[18px] font-serif">
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
                  <div className="relative rounded-[12px] overflow-hidden border border-[#DFDFE0] w-full max-h-[300px]">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover max-h-[300px]"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage(null)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer border-none hover:bg-black/80 transition-colors"
                      title="ลบรูป"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-[12px] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all text-center ${
                      isDragging
                        ? 'border-[#DE5D8F] bg-[#FCEFF4]'
                        : 'border-[#DFDFE0] hover:border-[#DE5D8F] hover:bg-[#FDF8FA]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FCEFF4] flex items-center justify-center text-[#DE5D8F]">
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-[#DE5D8F] m-0 font-serif text-[16px]">
                        {isDragging ? 'วางรูปภาพที่นี่' : 'คลิกหรือลากรูปภาพมาวางที่นี่'}
                      </p>
                      <p className="text-[#6D6D6D] m-0 text-[13px] mt-1 font-serif">
                        SVG, PNG, JPG หรือ GIF (แนะนำขนาด 800x800 หรือ 16:9)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT COLUMN (Sidebar Settings) ── */}
            <div className="flex flex-col gap-6">
              {/* Authorship Card */}
              <div className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-4 shadow-xs">
                <h3 className="font-bold text-[#1A1C1C] m-0 text-[18px] font-serif">
                  ข้อมูลผู้จัดทำ
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] text-[#6D6D6D] font-bold font-serif">
                    ผู้เขียน / นามปากกา
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-[8px] border border-[#DFDFE0] text-[15px] font-serif outline-none focus:border-[#DE5D8F]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] text-[#6D6D6D] font-bold font-serif">
                    พิสูจน์อักษร (ไม่บังคับ)
                  </label>
                  <input
                    type="text"
                    value={proofreader}
                    onChange={(e) => setProofreader(e.target.value)}
                    className="w-full px-3 py-2 rounded-[8px] border border-[#DFDFE0] text-[15px] font-serif outline-none focus:border-[#DE5D8F]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] text-[#6D6D6D] font-bold font-serif">
                    ภาพประกอบ (ไม่บังคับ)
                  </label>
                  <input
                    type="text"
                    value={illustrator}
                    onChange={(e) => setIllustrator(e.target.value)}
                    className="w-full px-3 py-2 rounded-[8px] border border-[#DFDFE0] text-[15px] font-serif outline-none focus:border-[#DE5D8F]"
                  />
                </div>
              </div>

              {/* Publish Settings Card */}
              <div className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-4 shadow-xs">
                <h3 className="font-bold text-[#1A1C1C] m-0 text-[18px] font-serif">
                  การเผยแพร่
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] text-[#6D6D6D] font-bold font-serif">
                    การมองเห็น
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as 'สาธารณะ' | 'ส่วนตัว')}
                    className="w-full px-3 py-2 rounded-[8px] border border-[#DFDFE0] text-[15px] font-serif outline-none focus:border-[#DE5D8F] bg-white cursor-pointer"
                  >
                    <option value="สาธารณะ">สาธารณะ</option>
                    <option value="ส่วนตัว">ส่วนตัว (เฉพาะแอดมิน)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] text-[#6D6D6D] font-bold font-serif">
                    วันที่เผยแพร่
                  </label>
                  <div className="flex items-center justify-between px-3 py-2 rounded-[8px] border border-[#DFDFE0] bg-[#FAFAFA] text-[14px] text-[#404041] font-serif">
                    <span>{publishDate}</span>
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Categories Card */}
              <div className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-4 shadow-xs">
                <h3 className="font-bold text-[#1A1C1C] m-0 text-[18px] font-serif">
                  หมวดหมู่ / ปี
                </h3>

                <div className="flex flex-col gap-2.5">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2.5 cursor-pointer text-[#1A1C1C] text-[15px] font-serif"
                    >
                      <input
                        type="checkbox"
                        checked={cat.checked}
                        onChange={() => toggleCategory(cat.id)}
                        className="w-4 h-4 accent-[#DE5D8F] rounded cursor-pointer"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>

                {showAddCatInput ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="ชื่อหมวดหมู่..."
                      className="flex-1 px-3 py-1.5 rounded-[8px] border border-[#DFDFE0] text-[14px] font-serif outline-none focus:border-[#DE5D8F]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-3 py-1.5 rounded-[8px] bg-[#E992B4] text-white border-none font-bold text-[13px] cursor-pointer font-serif transition-opacity hover:opacity-90 active:scale-95"
                    >
                      เพิ่ม
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCatInput(false)}
                      className="p-1 text-gray-400 hover:text-black border-none bg-transparent cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddCatInput(true)}
                    className="text-[#DE5D8F] hover:text-[#CA5582] text-[14px] font-bold text-left border-none bg-transparent cursor-pointer p-0 font-serif"
                  >
                    + เพิ่มหมวดหมู่ใหม่
                  </button>
                )}
              </div>

              {/* Tags Card */}
              <div className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-4 shadow-xs">
                <h3 className="font-bold text-[#1A1C1C] m-0 text-[18px] font-serif">
                  แท็ก (Tags)
                </h3>

                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCEFF4] text-[#DE5D8F] font-bold text-[13px] font-serif"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="border-none bg-transparent text-[#DE5D8F] hover:text-[#CA5582] cursor-pointer p-0 flex items-center"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-1">
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
                    placeholder="พิมพ์แท็กแล้วกด Enter..."
                    className="flex-1 px-3 py-1.5 rounded-[8px] border border-[#DFDFE0] text-[14px] font-serif outline-none focus:border-[#DE5D8F]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded-[8px] bg-[#E992B4] text-white border-none font-bold text-[13px] cursor-pointer font-serif transition-opacity hover:opacity-90 active:scale-95"
                  >
                    เพิ่ม
                  </button>
                </div>
              </div>

              {/* SEO Settings Card */}
              <div className="bg-white rounded-[16px] border border-[#DFDFE0] p-6 flex flex-col gap-3 shadow-xs">
                <h3 className="font-bold text-[#1A1C1C] m-0 text-[18px] font-serif">
                  การตั้งค่า URL & SEO
                </h3>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-[#6D6D6D] font-bold font-serif">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-[8px] border border-[#DFDFE0] text-[14px] font-serif outline-none focus:border-[#DE5D8F]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] text-[#6D6D6D] font-bold font-serif">
                      คำอธิบายสั้น (Meta Description)
                    </label>
                    <span
                      className={`text-[11px] font-mono ${
                        metaDesc.length > 160 ? 'text-red-500 font-bold' : 'text-[#8B8B8C]'
                      }`}
                    >
                      {metaDesc.length}/160 ตัวอักษร
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    maxLength={160}
                    placeholder="เขียนสรุปเนื้อหาบทความสั้นๆ ไม่เกิน 160 ตัวอักษร..."
                    className={`w-full px-3 py-1.5 rounded-[8px] border text-[14px] font-serif outline-none resize-none transition-colors ${
                      metaDesc.length > 160
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#DFDFE0] focus:border-[#DE5D8F]'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AksornsaraLayout>
  );
}

export default CreateArticlePage;
