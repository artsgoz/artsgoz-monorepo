import {
  logout,
  auth,
  backendRequest,
  API_BASE_URL,
  useAuth,
} from '@base-components';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { useState, useRef, useMemo, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronLeft,
  User,
  Shield,
  Pencil,
  Check,
  X,
  Eye,
  EyeOff,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';
import { articlesService } from './services/articlesService';
import catAvatar from '../../assets/cat_avatar.png';
import articleThumb from '../../assets/article_thumb.png';

export function AccountSettingsPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Active Main Tab: 'profile' or 'articles' (Figma Nodes 6602:23073 vs 6602:23431/23831)
  const [activeTab, setActiveTab] = useState<'profile' | 'articles'>('profile');

  // Sub-filter inside My Articles: 'published' or 'draft' (Figma Nodes 6602:23431 vs 6602:23831)
  const [articleSubTab, setArticleSubTab] = useState<'published' | 'draft'>(
    'published',
  );
  const [articlesPage, setArticlesPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const [version, setVersion] = useState(0);

  useEffect(() => {
    articlesService.syncWithApi();
    return articlesService.subscribe(() => setVersion((v) => v + 1));
  }, []);

  // Load real articles from articlesService
  const allArticles = useMemo(() => articlesService.getAll(), [version]);
  const publishedArticles = useMemo(
    () => allArticles.filter((a) => a.status === 'เผยแพร่แล้ว'),
    [allArticles],
  );
  const draftArticles = useMemo(
    () => allArticles.filter((a) => a.status === 'ร่างบทความ'),
    [allArticles],
  );

  const currentList =
    articleSubTab === 'published' ? publishedArticles : draftArticles;
  const totalPages = Math.ceil(currentList.length / ITEMS_PER_PAGE) || 1;
  const paginatedList = useMemo(() => {
    const start = (articlesPage - 1) * ITEMS_PER_PAGE;
    return currentList.slice(start, start + ITEMS_PER_PAGE);
  }, [currentList, articlesPage]);

  // Profile states with persistence (ACC-002, ACC-004)
  const [avatar, setAvatar] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('aksornsara_user_avatar');
      if (saved) return saved;
    } catch {}
    return profile?.avatar_url || catAvatar;
  });
  const [username, setUsername] = useState(() => {
    try {
      const saved = localStorage.getItem('aksornsara_user_name');
      if (saved) return saved;
    } catch {}
    return profile?.username || 'Meowlnwza';
  });
  const [tempUsername, setTempUsername] = useState(username);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const email = profile?.email || 'xxxxx@gmail.com';

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showToast('ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB');
        return;
      }
      try {
        const body = new FormData();
        body.append('file', file);
        const response = await backendRequest<{ avatar_url: string }>(
          '/me/avatar',
          { method: 'POST', body },
          true,
        );
        const newUrl = new URL(response.avatar_url, API_BASE_URL).href;
        setAvatar(newUrl);
        try {
          localStorage.setItem('aksornsara_user_avatar', newUrl);
        } catch {}
        showToast('อัปเดตรูปโปรไฟล์เรียบร้อยแล้ว');
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target?.result === 'string') {
            setAvatar(event.target.result);
            try {
              localStorage.setItem('aksornsara_user_avatar', event.target.result);
            } catch {}
            showToast('อัปเดตรูปโปรไฟล์เรียบร้อยแล้ว');
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleStartEditUsername = () => {
    setTempUsername(username);
    setUsernameError(null);
    setIsEditingUsername(true);
  };

  const handleSaveUsername = async () => {
    const trimmed = tempUsername.trim();
    if (!trimmed) {
      setUsernameError('ชื่อผู้ใช้ต้องไม่เป็นค่าว่าง');
      return;
    }
    if (trimmed.length < 3) {
      setUsernameError('ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร');
      return;
    }
    if (trimmed.length > 30) {
      setUsernameError('ชื่อผู้ใช้ต้องไม่เกิน 30 ตัวอักษร');
      return;
    }
    try {
      await backendRequest(
        '/me',
        { method: 'PUT', body: JSON.stringify({ username: trimmed }) },
        true,
      );
    } catch {}
    setUsername(trimmed);
    try {
      localStorage.setItem('aksornsara_user_name', trimmed);
    } catch {}
    setIsEditingUsername(false);
    setUsernameError(null);
    showToast('บันทึกชื่อผู้ใช้เรียบร้อยแล้ว');
  };

  const handleCancelUsername = () => {
    setTempUsername(username);
    setUsernameError(null);
    setIsEditingUsername(false);
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      showToast('กรุณากรอกรหัสผ่านปัจจุบัน');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    try {
      const user = auth.currentUser;
      if (
        !user?.email ||
        !user.providerData.some(
          (provider) => provider.providerId === 'password',
        )
      )
        throw new Error(
          'Use password reset to set an email/password login for this account.',
        );
      await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, currentPassword),
      );
      await updatePassword(user, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      showToast('เปลี่ยนรหัสผ่านสำเร็จแล้ว!');
    } catch (cause) {
      showToast(
        cause instanceof Error ? cause.message : 'Unable to update password.',
      );
    }
  };

  const handleSignOut = () => {
    try {
      void logout();
      localStorage.removeItem('aksornsara_auth_token');
      sessionStorage.removeItem('aksornsara_auth_token');
    } catch {}
    showToast('ออกจากระบบเรียบร้อยแล้ว');
    navigate('/aksornsara');
  };

  return (
    <AksornsaraLayout showBackButton={false} showTopSearchBar={false}>
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

      <div className="w-full flex flex-col gap-6" style={{ maxWidth: 840 }}>
        {/* ── Header: Back button + Title (NAV-004) ── */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'articles') {
                setActiveTab('profile');
              } else {
                navigate('/aksornsara');
              }
            }}
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
            Account Settings
          </h1>
        </div>

        {/* ── Main Tab Bar (Pill Container) ── */}
        <div className="flex items-center w-full">
          <div className="p-1 rounded-[10px] bg-[#F7F8F9] border border-[#DFDFE0] flex items-center gap-1 shadow-xs w-full max-w-[480px]">
            {/* Tab 1: Profile & Privacy (Figma Node 6602:23073) */}
            <button
              type="button"
              id="tab-profile-privacy"
              onClick={() => setActiveTab('profile')}
              className="flex-1 cursor-pointer border-none font-bold rounded-[8px] transition-all flex items-center justify-center text-[14px]"
              style={{
                fontFamily: 'ChulaCharasNew, sans-serif',
                padding: '8px 16px',
                backgroundColor:
                  activeTab === 'profile' ? '#E992B4' : 'transparent',
                color: activeTab === 'profile' ? '#FFFFFF' : '#E992B4',
                boxShadow:
                  activeTab === 'profile'
                    ? '0 2px 4px rgba(233,146,180,0.2)'
                    : 'none',
              }}
            >
              Profile & Privacy
            </button>

            {/* Tab 2: All Articles / My Articles (Figma Nodes 6602:23431 / 6602:23831) */}
            <button
              type="button"
              id="tab-my-articles"
              onClick={() => setActiveTab('articles')}
              className="flex-1 cursor-pointer border-none font-bold rounded-[8px] transition-all flex items-center justify-center text-[14px]"
              style={{
                fontFamily: 'ChulaCharasNew, sans-serif',
                padding: '8px 16px',
                backgroundColor:
                  activeTab === 'articles' ? '#E992B4' : 'transparent',
                color: activeTab === 'articles' ? '#FFFFFF' : '#E992B4',
                boxShadow:
                  activeTab === 'articles'
                    ? '0 2px 4px rgba(233,146,180,0.2)'
                    : 'none',
              }}
            >
              All Articles
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1: PROFILE & PRIVACY (Figma Node 6602:23073)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' ? (
          <div className="flex flex-col gap-6">
            {/* ── Section 1: Profile (ข้อมูลส่วนตัว) ── */}
            <div className="bg-white rounded-[16px] border border-[#DFDFE0] overflow-hidden shadow-xs">
              {/* Header Banner */}
              <div
                className="px-6 py-3.5 flex items-center gap-2.5 border-b border-[#F0BED2]"
                style={{ backgroundColor: '#FCEFF4' }}
              >
                <User size={18} color="#DE5D8F" strokeWidth={2.2} />
                <span
                  className="font-bold text-[#1A1C1C] text-[16px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  Profile (ข้อมูลส่วนตัว)
                </span>
              </div>

              {/* Body Content */}
              <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                {/* Avatar with CHANGE PHOTO */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <img
                    src={avatar}
                    alt="Cat Avatar"
                    className="w-16 h-16 rounded-full object-cover border border-[#DFDFE0] shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => fileInputRef.current?.click()}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#6D6D6D] hover:text-[#DE5D8F] text-[11px] font-bold border-none bg-transparent cursor-pointer transition-colors uppercase tracking-wider p-0 mt-0.5"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    CHANGE PHOTO
                  </button>
                </div>

                {/* Username Input Field (ACC-002, ACC-003) */}
                <div className="flex flex-col gap-1.5 flex-1 max-w-[460px]">
                  <label
                    className="text-[#8B8B8C] text-[12px] font-bold tracking-wide"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Username
                  </label>
                  <div
                    className={`flex items-center justify-between border rounded-[8px] px-4 py-2.5 bg-[#FAFAFA] transition-colors ${
                      usernameError
                        ? 'border-red-400 bg-red-50/30'
                        : 'border-[#DFDFE0] focus-within:bg-white focus-within:border-[#DE5D8F]'
                    }`}
                  >
                    {isEditingUsername ? (
                      <div className="flex items-center justify-between w-full gap-2">
                        <input
                          type="text"
                          value={tempUsername}
                          onChange={(e) => {
                            setTempUsername(e.target.value);
                            if (usernameError) setUsernameError(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveUsername();
                            if (e.key === 'Escape') handleCancelUsername();
                          }}
                          autoFocus
                          placeholder="กรอกชื่อผู้ใช้..."
                          className="w-full bg-transparent outline-none font-bold text-[#1A1C1C] text-[15px]"
                          style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                        />
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={handleSaveUsername}
                            className="p-1 rounded-[6px] bg-[#E992B4] text-white hover:opacity-90 border-none cursor-pointer flex items-center justify-center shadow-xs"
                            title="บันทึกชื่อใหม่"
                          >
                            <Check size={16} strokeWidth={2.5} />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelUsername}
                            className="p-1 rounded-[6px] bg-gray-200 text-gray-600 hover:bg-gray-300 border-none cursor-pointer flex items-center justify-center"
                            title="ยกเลิก"
                          >
                            <X size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span
                          className="font-bold text-[#1A1C1C] text-[15px]"
                          style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                        >
                          {username}
                        </span>
                        <button
                          type="button"
                          onClick={handleStartEditUsername}
                          className="border-none bg-transparent cursor-pointer p-0 text-[#6D6D6D] hover:text-[#DE5D8F] transition-colors"
                          title="แก้ไขชื่อผู้ใช้"
                        >
                          <Pencil size={16} />
                        </button>
                      </>
                    )}
                  </div>
                  {usernameError && (
                    <span className="text-red-500 text-[12px] font-sans">
                      {usernameError}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Section 2: Privacy (การตั้งค่าความปลอดภัย) ── */}
            <div className="bg-white rounded-[16px] border border-[#DFDFE0] overflow-hidden shadow-xs">
              {/* Header Banner */}
              <div
                className="px-6 py-3.5 flex items-center gap-2.5 border-b border-[#F0F0F0]"
                style={{ backgroundColor: '#F7F8F9' }}
              >
                <Shield size={18} color="#DE5D8F" strokeWidth={2.2} />
                <span
                  className="font-bold text-[#1A1C1C] text-[16px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  Privacy (การตั้งค่าความปลอดภัย)
                </span>
              </div>

              {/* Body Content */}
              <div className="p-6 flex flex-col gap-6">
                {/* EMAIL ADDRESS */}
                <div className="flex flex-col gap-1.5 max-w-[460px]">
                  <label
                    className="text-[#8B8B8C] text-[12px] font-bold tracking-wide"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    EMAIL ADDRESS
                  </label>
                  <div className="flex items-center justify-between border border-[#DFDFE0] rounded-[8px] px-4 py-2.5 bg-[#FAFAFA]">
                    <span
                      className="text-[#545455] text-[15px]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {email}
                    </span>
                    <span
                      className="px-3 py-0.5 rounded-full text-[12px] font-bold"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        backgroundColor: '#FCEFF4',
                        color: '#DE5D8F',
                        border: '1px solid #F5CDDC',
                      }}
                    >
                      Verified
                    </span>
                  </div>
                </div>

                <div className="h-[1px] bg-[#F0F0F0] my-1" />

                {/* Change Password */}
                <div className="flex flex-col gap-4 max-w-[460px]">
                  <span
                    className="font-bold text-[#1A1C1C] text-[16px]"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    Change Password (เปลี่ยนรหัสผ่าน)
                  </span>

                  {/* CURRENT PASSWORD */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[#8B8B8C] text-[12px] font-bold tracking-wide"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      CURRENT PASSWORD
                    </label>
                    <div className="flex items-center justify-between border border-[#DFDFE0] rounded-[8px] px-4 py-2.5 bg-white focus-within:border-[#DE5D8F]">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-transparent outline-none text-[#1A1C1C] text-[15px]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw((prev) => !prev)}
                        className="border-none bg-transparent cursor-pointer p-0 text-[#8B8B8C] hover:text-[#1A1C1C]"
                      >
                        {showCurrentPw ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* NEW PASSWORD */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[#8B8B8C] text-[12px] font-bold tracking-wide"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      NEW PASSWORD
                    </label>
                    <div className="flex items-center justify-between border border-[#DFDFE0] rounded-[8px] px-4 py-2.5 bg-white focus-within:border-[#DE5D8F]">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-transparent outline-none text-[#1A1C1C] text-[15px]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw((prev) => !prev)}
                        className="border-none bg-transparent cursor-pointer p-0 text-[#8B8B8C] hover:text-[#1A1C1C]"
                      >
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* UPDATE PASSWORD Button */}
                  <button
                    type="button"
                    onClick={handleUpdatePassword}
                    className="border-none cursor-pointer font-bold text-[#1A1C1C] transition-opacity hover:opacity-90 active:scale-95 self-start mt-1"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      padding: '10px 20px',
                      borderRadius: 8,
                      backgroundColor: '#F5CDDC',
                      fontSize: 13,
                    }}
                  >
                    UPDATE PASSWORD
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Sign Out Button (outside card, bottom right as in Figma) */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSignOut}
                className="border-none cursor-pointer font-bold text-white transition-opacity hover:opacity-90 active:scale-95 shadow-sm"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  padding: '10px 32px',
                  borderRadius: 10,
                  backgroundColor: '#E992B4',
                  fontSize: 15,
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════════════════
              TAB 2: MY ARTICLES (Figma Nodes 6602:23431 & 6602:23831)
              ══════════════════════════════════════════════════════════════════════ */
          <div className="flex flex-col gap-5">
            {/* Sub-tabs / Filters: เผยแพร่แล้ว (12) vs ร่างบทความ (2) */}
            <div className="flex items-center gap-3">
              {/* เผยแพร่แล้ว (12) */}
              <button
                type="button"
                id="btn-subtab-published"
                onClick={() => setArticleSubTab('published')}
                className="cursor-pointer font-bold rounded-full transition-all text-[13px] flex items-center justify-center"
                style={{
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  padding: '6px 18px',
                  backgroundColor:
                    articleSubTab === 'published' ? '#B08926' : '#FFFFFF',
                  color: articleSubTab === 'published' ? '#FFFFFF' : '#545455',
                  border:
                    articleSubTab === 'published'
                      ? '1px solid #B08926'
                      : '1px solid #DFDFE0',
                }}
              >
                เผยแพร่แล้ว (12)
              </button>

              {/* ร่างบทความ (2) */}
              <button
                type="button"
                id="btn-subtab-draft"
                onClick={() => setArticleSubTab('draft')}
                className="cursor-pointer font-bold rounded-full transition-all text-[13px] flex items-center justify-center"
                style={{
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  padding: '6px 18px',
                  backgroundColor:
                    articleSubTab === 'draft' ? '#B08926' : '#FFFFFF',
                  color: articleSubTab === 'draft' ? '#FFFFFF' : '#545455',
                  border:
                    articleSubTab === 'draft'
                      ? '1px solid #B08926'
                      : '1px solid #DFDFE0',
                }}
              >
                ร่างบทความ (2)
              </button>
            </div>

            {/* Table Card (Figma Nodes 6602:23431 & 6602:23831) */}
            <div className="bg-white rounded-[16px] border border-[#DFDFE0] overflow-hidden shadow-xs">
              <table
                className="w-full text-left border-collapse"
                style={{ minWidth: 680 }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid #DFDFE0',
                      backgroundColor: '#F7F8F9',
                    }}
                  >
                    <th
                      className="py-4 px-6 font-bold text-[#1A1C1C]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 16,
                        lineHeight: '22px',
                        width: '38%',
                      }}
                    >
                      ชื่อบทความ
                    </th>
                    <th
                      className="py-4 px-4 font-bold text-[#1A1C1C]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 16,
                        lineHeight: '22px',
                      }}
                    >
                      ผู้แต่ง
                    </th>
                    <th
                      className="py-4 px-4 font-bold text-[#1A1C1C]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 16,
                        lineHeight: '22px',
                      }}
                    >
                      หมวดหมู่
                    </th>
                    <th
                      className="py-4 px-4 font-bold text-[#1A1C1C]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 16,
                        lineHeight: '22px',
                      }}
                    >
                      วันที่เผยแพร่
                    </th>
                    <th
                      className="py-4 px-4 font-bold text-[#1A1C1C]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 16,
                        lineHeight: '22px',
                      }}
                    >
                      ยอดเข้าชม
                    </th>
                    <th
                      className="py-4 px-6 font-bold text-[#1A1C1C] text-right"
                      style={{ width: 48 }}
                    />
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.length > 0 ? (
                    paginatedList.map((item, idx, arr) => (
                      <tr
                        key={item.id}
                        onClick={() =>
                          navigate(`/aksornsara/create?id=${item.id}`)
                        }
                        className="hover:bg-[#FFF9FB] transition-colors cursor-pointer"
                        style={{
                          borderBottom:
                            idx < arr.length - 1 ? '1px solid #F0F0F0' : 'none',
                        }}
                      >
                        {/* Thumbnail + Title */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                item.coverImage || item.imageUrl || articleThumb
                              }
                              alt="thumb"
                              className="w-10 h-10 rounded-[6px] object-cover shrink-0 shadow-xs bg-gray-100 border border-gray-100"
                              onError={(e) => {
                                e.currentTarget.src = articleThumb;
                              }}
                            />
                            <span
                              className="font-bold text-[#1A1C1C] hover:text-[#DE5D8F] cursor-pointer transition-colors line-clamp-1"
                              style={{
                                fontFamily: 'ChulaCharasNew, sans-serif',
                                fontSize: 16,
                                lineHeight: '20px',
                              }}
                              title={item.title}
                            >
                              {item.title}
                            </span>
                          </div>
                        </td>

                        {/* Author */}
                        <td className="py-3.5 px-4">
                          <span
                            className="text-[#1A1C1C] truncate max-w-[140px] block"
                            style={{
                              fontFamily: 'ChulaCharasNew, sans-serif',
                              fontSize: 15,
                            }}
                            title={item.author}
                          >
                            {item.author}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span
                            className="inline-block px-2 py-0.5 rounded-[6px] font-sans font-normal text-[11px] text-[#DE5D8F] bg-[#FCEFF4]"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {item.category?.replace(/^ปี\s*/, '')}
                          </span>
                        </td>

                        {/* Published Date */}
                        <td className="py-3.5 px-4">
                          <span
                            className="text-gray-500 whitespace-nowrap"
                            style={{
                              fontFamily: 'ChulaCharasNew, sans-serif',
                              fontSize: 14,
                            }}
                          >
                            {item.publishedAt || item.date}
                          </span>
                        </td>

                        {/* Views */}
                        <td className="py-3.5 px-4">
                          <span
                            className="text-[#1A1C1C] font-bold"
                            style={{
                              fontFamily: 'ChulaCharasNew, sans-serif',
                              fontSize: 15,
                            }}
                          >
                            {(item.views || 0).toLocaleString()}
                          </span>
                        </td>

                        {/* Action Icon */}
                        <td className="py-3.5 px-6 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/aksornsara/create?id=${item.id}`);
                            }}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FCEFF4] text-[#1A1C1C] hover:text-[#DE5D8F] border-none bg-transparent cursor-pointer transition-colors"
                            title="แก้ไขบทความ"
                          >
                            <Pencil size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <p className="text-gray-500 font-serif text-[15px] m-0">
                            {articleSubTab === 'published'
                              ? 'ไม่พบบทความที่เผยแพร่แล้ว'
                              : 'ยังไม่มีบทความฉบับร่าง'}
                          </p>
                          {articleSubTab === 'draft' && (
                            <button
                              type="button"
                              onClick={() => navigate('/aksornsara/create')}
                              className="mt-2 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white font-bold font-serif border-none cursor-pointer"
                              style={{
                                backgroundColor: '#E992B4',
                                fontSize: 13,
                              }}
                            >
                              <Plus size={14} />
                              <span>สร้างบทความใหม่</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#DFDFE0] bg-[#FAFAFA]">
                  <span className="text-[13px] text-gray-500 font-serif">
                    แสดง {paginatedList.length} จากทั้งหมด {currentList.length}{' '}
                    รายการ
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={articlesPage === 1}
                      onClick={() => setArticlesPage((p) => Math.max(1, p - 1))}
                      className="px-2.5 py-1 rounded-[6px] border border-[#DFDFE0] bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer flex items-center"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-[13px] font-bold text-gray-700 font-serif px-2">
                      {articlesPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={articlesPage === totalPages}
                      onClick={() =>
                        setArticlesPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="px-2.5 py-1 rounded-[6px] border border-[#DFDFE0] bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer flex items-center"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AksornsaraLayout>
  );
}
