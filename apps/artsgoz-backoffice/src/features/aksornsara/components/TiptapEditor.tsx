import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Heading1 as Heading1Icon,
  Heading2 as Heading2Icon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  Quote as QuoteIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Minus as MinusIcon,
  UploadCloud,
  X,
} from 'lucide-react';
import { useEffect, useState, useRef, ChangeEvent, DragEvent } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  // Image insertion modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadedImageData, setUploadedImageData] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#DE5D8F] underline hover:text-[#CA5582] cursor-pointer',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full rounded-[12px] my-6 shadow-sm object-contain mx-auto block',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'tiptap-content w-full min-h-[380px] p-6 outline-none font-serif text-[#1A1C1C] text-[17px] leading-[30px] focus:outline-none',
      },
      // Direct drag-and-drop of images into editor
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              if (src) {
                const { schema } = view.state;
                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                if (coordinates) {
                  const node = schema.nodes.image.create({ src });
                  const transaction = view.state.tr.insert(coordinates.pos, node);
                  view.dispatch(transaction);
                }
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
      // Direct paste of images (e.g. from clipboard screenshot or file copy)
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith('image/')) {
              const file = items[i].getAsFile();
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const src = e.target?.result as string;
                  if (src) {
                    const { schema } = view.state;
                    const node = schema.nodes.image.create({ src });
                    const transaction = view.state.tr.replaceSelectionWith(node);
                    view.dispatch(transaction);
                  }
                };
                reader.readAsDataURL(file);
                return true;
              }
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content update (only when not actively typing/focused)
  useEffect(() => {
    if (editor && !editor.isFocused && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="w-full min-h-[380px] p-6 flex items-center justify-center text-gray-400 font-serif">
        กำลังโหลด Editor...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('ใส่ URL ลิงก์:', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleOpenImageModal = () => {
    setImageUrlInput('');
    setUploadedImageData(null);
    setImageCaption('');
    setIsImageModalOpen(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setUploadedImageData(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setUploadedImageData(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertImage = () => {
    const src = imageTab === 'upload' ? uploadedImageData : imageUrlInput.trim();
    if (!src) return;

    if (imageCaption.trim()) {
      // Insert figure with image and caption
      editor
        .chain()
        .focus()
        .insertContent(
          `<figure class="my-6 flex flex-col items-center"><img src="${src}" alt="${imageCaption.trim()}" class="rounded-[12px] shadow-sm max-w-full max-h-[500px] object-contain mx-auto" /><figcaption class="text-center text-[13px] text-gray-500 font-serif mt-2 italic">${imageCaption.trim()}</figcaption></figure><p></p>`
        )
        .run();
    } else {
      editor.chain().focus().setImage({ src, alt: 'ภาพประกอบบทความ' }).run();
    }

    setIsImageModalOpen(false);
    setUploadedImageData(null);
    setImageUrlInput('');
    setImageCaption('');
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-[16px] border border-[#DFDFE0] shadow-xs overflow-hidden relative">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-1 p-2.5 border-b border-[#DFDFE0] bg-[#F7F8F9] flex-wrap select-none">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer ${
            editor.isActive('bold')
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="ตัวหนา (Ctrl+B)"
        >
          <BoldIcon size={16} />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer ${
            editor.isActive('italic')
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="ตัวเอียง (Ctrl+I)"
        >
          <ItalicIcon size={16} />
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer ${
            editor.isActive('underline')
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="ขีดเส้นใต้ (Ctrl+U)"
        >
          <UnderlineIcon size={16} />
        </button>

        <div className="w-[1px] h-5 bg-[#DFDFE0] mx-1" />

        {/* Heading 1 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer font-bold text-[13px] ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="หัวข้อใหญ่ (Heading 1)"
        >
          <Heading1Icon size={16} />
        </button>

        {/* Heading 2 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer font-bold text-[13px] ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="หัวข้อย่อย (Heading 2)"
        >
          <Heading2Icon size={16} />
        </button>

        <div className="w-[1px] h-5 bg-[#DFDFE0] mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer ${
            editor.isActive('bulletList')
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="รายการแบบจุด (Bullet List)"
        >
          <ListIcon size={16} />
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer ${
            editor.isActive('orderedList')
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="รายการแบบลำดับเลข (Numbered List)"
        >
          <ListOrderedIcon size={16} />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer ${
            editor.isActive('blockquote')
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="คำคม / ข้อความอ้างอิง (Blockquote)"
        >
          <QuoteIcon size={16} />
        </button>

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer transition-colors"
          title="แทรกเส้นคั่นแนวนอน"
        >
          <MinusIcon size={16} />
        </button>

        <div className="w-[1px] h-5 bg-[#DFDFE0] mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer ${
            editor.isActive('link')
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="แทรกลิงก์"
        >
          <LinkIcon size={16} />
        </button>

        {/* Insert Image Button */}
        <button
          type="button"
          onClick={handleOpenImageModal}
          className="px-2.5 h-8 rounded-[6px] flex items-center gap-1.5 hover:bg-[#FCEFF4] hover:text-[#DE5D8F] text-[#404041] border-none bg-transparent cursor-pointer transition-colors font-serif font-bold text-[13px]"
          title="แทรกรูปภาพในบทความ (อัปโหลด หรือ URL)"
        >
          <ImageIcon size={16} />
          <span>แทรกรูปภาพ</span>
        </button>

        <div className="w-[1px] h-5 bg-[#DFDFE0] mx-1" />

        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="เลิกทำ (Undo)"
        >
          <UndoIcon size={15} />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="ทำซ้ำ (Redo)"
        >
          <RedoIcon size={15} />
        </button>
      </div>

      {/* ── Editor Body ── */}
      <div className="w-full min-h-[380px] bg-white cursor-text">
        <EditorContent editor={editor} />
      </div>

      {/* Footer hint */}
      <div className="px-5 py-2.5 border-t border-gray-100 bg-[#FAFAFA] text-[12px] text-gray-500 font-serif flex items-center justify-between">
        <span>💡 เคล็ดลับ: สามารถคลิก &quot;แทรกรูปภาพ&quot; หรือลากรูปภาพมาวาง หรือกด Ctrl+V เพื่อวางรูปภาพในเนื้อหาบทความได้โดยตรง</span>
      </div>

      {/* ── Modal แทรกรูปภาพในเนื้อหา ── */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 font-serif"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="bg-white rounded-[20px] shadow-2xl border border-gray-200 w-full max-w-[520px] p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-[20px] font-bold text-[#1A1C1C] m-0">
                แทรกรูปภาพในเนื้อหาบทความ
              </h3>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 gap-4">
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`pb-2.5 text-[15px] font-bold cursor-pointer border-none bg-transparent transition-colors ${
                  imageTab === 'upload'
                    ? 'text-[#DE5D8F] border-b-2 border-[#DE5D8F]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                อัปโหลดจากคอมพิวเตอร์
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`pb-2.5 text-[15px] font-bold cursor-pointer border-none bg-transparent transition-colors ${
                  imageTab === 'url'
                    ? 'text-[#DE5D8F] border-b-2 border-[#DE5D8F]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                ระบุ URL รูปภาพ
              </button>
            </div>

            {/* Tab 1: Upload */}
            {imageTab === 'upload' && (
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  ref={imageFileInputRef}
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                  className="hidden"
                />

                {uploadedImageData ? (
                  <div className="relative rounded-[12px] overflow-hidden border border-gray-200 max-h-[240px] flex items-center justify-center bg-gray-50">
                    <img
                      src={uploadedImageData}
                      alt="Preview"
                      className="max-h-[240px] max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setUploadedImageData(null)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center border-none cursor-pointer hover:bg-black/80"
                      title="เลือกรูปใหม่"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => imageFileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(true);
                    }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={handleFileDrop}
                    className={`border-2 border-dashed rounded-[12px] p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center ${
                      isDraggingFile
                        ? 'border-[#DE5D8F] bg-[#FCEFF4]'
                        : 'border-gray-200 hover:border-[#DE5D8F] hover:bg-[#FDF8FA]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FCEFF4] flex items-center justify-center text-[#DE5D8F]">
                      <UploadCloud size={20} />
                    </div>
                    <p className="font-bold text-[#DE5D8F] m-0 text-[14px]">
                      คลิกเพื่อเลือกรูป หรือลากรูปภาพมาวางที่นี่
                    </p>
                    <p className="text-gray-400 m-0 text-[12px]">
                      PNG, JPG, GIF, WebP (แนะนำความกว้าง 600 - 1200px)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: URL */}
            {imageTab === 'url' && (
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-gray-700">
                  URL ของรูปภาพ *
                </label>
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-gray-200 outline-none text-[15px] font-serif focus:border-[#DE5D8F]"
                />
                {imageUrlInput.trim() && (
                  <div className="mt-2 rounded-[10px] overflow-hidden border border-gray-100 max-h-[160px] flex items-center justify-center bg-gray-50 p-2">
                    <img
                      src={imageUrlInput.trim()}
                      alt="Preview"
                      className="max-h-[140px] object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Caption */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-bold text-gray-700">
                คำบรรยายภาพ (Caption / Alt Text - ไม่บังคับ)
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="เช่น ภาพประกอบ: งานสาราณียกร ประจำปี 2569"
                className="w-full px-3.5 py-2 rounded-[10px] border border-gray-200 outline-none text-[14px] font-serif focus:border-[#DE5D8F]"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="px-5 py-2 rounded-[8px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[14px] border-none cursor-pointer transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={imageTab === 'upload' ? !uploadedImageData : !imageUrlInput.trim()}
                className="px-6 py-2 rounded-[8px] bg-[#E992B4] hover:bg-[#DE5D8F] text-white font-bold text-[14px] border-none cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                แทรกรูปภาพ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor CSS styles for ProseMirror content */}
      <style>{`
        .tiptap-content p {
          margin-bottom: 1rem;
        }
        .tiptap-content h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1A1C1C;
        }
        .tiptap-content h2 {
          font-size: 1.35rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: #1A1C1C;
        }
        .tiptap-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .tiptap-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .tiptap-content blockquote {
          border-left: 3px solid #DE5D8F;
          padding-left: 1rem;
          font-style: italic;
          color: #555;
          margin: 1.25rem 0;
          background: #FDF8FA;
          padding: 0.75rem 1rem;
          border-radius: 0 8px 8px 0;
        }
        .tiptap-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 1.5rem auto;
          display: block;
        }
        .tiptap-content figure {
          margin: 1.5rem auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .tiptap-content figcaption {
          font-size: 0.875rem;
          color: #6D6D6D;
          margin-top: 0.5rem;
          text-align: center;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

export default TiptapEditor;
