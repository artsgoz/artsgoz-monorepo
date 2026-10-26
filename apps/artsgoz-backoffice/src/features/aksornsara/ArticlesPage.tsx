import { useState } from 'react';
import {
  ChevronDown,
  Check,
} from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';
import articleThumb from '../../assets/article_thumb.png';

interface ArticleItem {
  id: number;
  title: string;
  author: string;
  category: string;
  status: 'เผยแพร่แล้ว' | 'ร่างบทความ';
  publishedAt: string;
  views: number;
}

const ALL_ARTICLES_DATA: ArticleItem[] = [
  { id: 1, title: 'บทความ...', author: 'วู กานดา', category: 'ศิลปะ', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 2, title: 'บทความ...', author: 'วู กานดา', category: 'วรรณกรรม', status: 'ร่างบทความ', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 3, title: 'บทความ...', author: 'วู กานดา', category: 'ภาษา', status: 'ร่างบทความ', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 4, title: 'บทความ...', author: 'วู กานดา', category: 'วัฒนธรรม', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 5, title: 'บทความ...', author: 'วู กานดา', category: 'ปรัชญา', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 6, title: 'บทความ...', author: 'วู กานดา', category: 'วิจารณ์', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 7, title: 'บทความ...', author: 'วู กานดา', category: 'ทั่วไป', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 8, title: 'บทความ...', author: 'วู กานดา', category: 'ทั่วไป', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 9, title: 'บทความ...', author: 'วู กานดา', category: 'ศิลปะ', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 10, title: 'บทความ...', author: 'วู กานดา', category: 'วรรณกรรม', status: 'ร่างบทความ', publishedAt: '1 ม.ค. 69', views: 67 },
];

export function ArticlesPage() {
  const [search, setSearch] = useState('');

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Filter & Sort states
  const [titleSort, setTitleSort] = useState<'asc' | 'desc' | null>(null);
  const [authorSort, setAuthorSort] = useState<'asc' | 'desc' | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ทั้งหมด' | 'เผยแพร่แล้ว' | 'ร่างบทความ'>('ทั้งหมด');
  const [dateSort, setDateSort] = useState<'newest' | 'oldest' | null>(null);
  const [viewsSort, setViewsSort] = useState<'most' | 'least' | null>(null);

  // Filtered & Sorted Articles
  const filtered = ALL_ARTICLES_DATA.filter((item) => {
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === 'ทั้งหมด' || item.status === statusFilter;

    return matchSearch && matchStatus;
  }).sort((a, b) => {
    if (titleSort === 'asc') return a.title.localeCompare(b.title, 'th');
    if (titleSort === 'desc') return b.title.localeCompare(a.title, 'th');
    if (authorSort === 'asc') return a.author.localeCompare(b.author, 'th');
    if (authorSort === 'desc') return b.author.localeCompare(a.author, 'th');
    if (dateSort === 'newest') return b.id - a.id;
    if (dateSort === 'oldest') return a.id - b.id;
    if (viewsSort === 'most') return b.views - a.views;
    if (viewsSort === 'least') return a.views - b.views;
    return 0;
  });

  const handleClearFilters = () => {
    setTitleSort(null);
    setAuthorSort(null);
    setStatusFilter('ทั้งหมด');
    setDateSort(null);
    setViewsSort(null);
    setSearch('');
    setOpenDropdown(null);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <AksornsaraLayout
      showBackButton={false}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="ค้นหาบทความ"
    >
      <div className="w-full flex flex-col gap-6" style={{ maxWidth: 960 }}>
        {/* ── Page Title ── */}
        <div>
          <h1
            className="font-bold text-[#1A1C1C] text-[32px] md:text-[48px] leading-tight m-0"
            style={{
              fontFamily: 'ChulaCharasNew, sans-serif',
            }}
          >
            All Articles
          </h1>
        </div>

        {/* ── Filter Dropdowns Bar (Figma Node 6538:28881) ── */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 relative">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* 1. ชื่อบทความ Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('title')}
                className="flex items-center justify-between gap-2 bg-white px-3.5 py-1.5 rounded-[8px] cursor-pointer transition-colors shadow-sm"
                style={{
                  border: titleSort ? '1.5px solid #DE5D8F' : '1.5px solid #0165F8',
                  minWidth: 108,
                  height: 38,
                }}
              >
                <span
                  className="font-bold text-[#1A1C1C] text-[14px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  {titleSort ? (titleSort === 'asc' ? 'ชื่อ (A-Z)' : 'ชื่อ (Z-A)') : 'ชื่อบทความ'}
                </span>
                <ChevronDown size={16} color="#1A1C1C" />
              </button>
              {openDropdown === 'title' && (
                <div
                  className="absolute left-0 top-full mt-1.5 bg-white rounded-[10px] border border-[#DFDFE0] shadow-lg py-1.5 z-30 min-w-[130px]"
                >
                  <button
                    type="button"
                    onClick={() => { setTitleSort('asc'); setOpenDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    <span>เรียงจาก A-Z</span>
                    {titleSort === 'asc' && <Check size={14} color="#DE5D8F" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTitleSort('desc'); setOpenDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    <span>เรียงจาก Z-A</span>
                    {titleSort === 'desc' && <Check size={14} color="#DE5D8F" />}
                  </button>
                </div>
              )}
            </div>

            {/* 2. ชื่อผู้แต่ง Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('author')}
                className="flex items-center justify-between gap-2 bg-white px-3.5 py-1.5 rounded-[8px] cursor-pointer transition-colors shadow-sm"
                style={{
                  border: authorSort ? '1.5px solid #DE5D8F' : '1.5px solid #0165F8',
                  minWidth: 108,
                  height: 38,
                }}
              >
                <span
                  className="font-bold text-[#1A1C1C] text-[14px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  {authorSort ? (authorSort === 'asc' ? 'ผู้แต่ง (A-Z)' : 'ผู้แต่ง (Z-A)') : 'ชื่อผู้แต่ง'}
                </span>
                <ChevronDown size={16} color="#1A1C1C" />
              </button>
              {openDropdown === 'author' && (
                <div
                  className="absolute left-0 top-full mt-1.5 bg-white rounded-[10px] border border-[#DFDFE0] shadow-lg py-1.5 z-30 min-w-[130px]"
                >
                  <button
                    type="button"
                    onClick={() => { setAuthorSort('asc'); setOpenDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    <span>เรียงจาก A-Z</span>
                    {authorSort === 'asc' && <Check size={14} color="#DE5D8F" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthorSort('desc'); setOpenDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    <span>เรียงจาก Z-A</span>
                    {authorSort === 'desc' && <Check size={14} color="#DE5D8F" />}
                  </button>
                </div>
              )}
            </div>

            {/* 3. สถานะ Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('status')}
                className="flex items-center justify-between gap-2 bg-white px-3.5 py-1.5 rounded-[8px] cursor-pointer transition-colors shadow-sm"
                style={{
                  border: statusFilter !== 'ทั้งหมด' ? '1.5px solid #DE5D8F' : '1.5px solid #0165F8',
                  minWidth: 108,
                  height: 38,
                }}
              >
                <span
                  className="font-bold text-[#1A1C1C] text-[14px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  {statusFilter !== 'ทั้งหมด' ? statusFilter : 'สถานะ'}
                </span>
                <ChevronDown size={16} color="#1A1C1C" />
              </button>
              {openDropdown === 'status' && (
                <div
                  className="absolute left-0 top-full mt-1.5 bg-white rounded-[10px] border border-[#DFDFE0] shadow-lg py-1.5 z-30 min-w-[130px]"
                >
                  {(['ทั้งหมด', 'เผยแพร่แล้ว', 'ร่างบทความ'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => { setStatusFilter(st); setOpenDropdown(null); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer"
                      style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                    >
                      <span className={st === 'เผยแพร่แล้ว' ? 'text-[#3D940B]' : st === 'ร่างบทความ' ? 'text-[#0165F8]' : ''}>
                        {st}
                      </span>
                      {statusFilter === st && <Check size={14} color="#DE5D8F" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. วันที่เผยแพร่ Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('date')}
                className="flex items-center justify-between gap-2 bg-white px-3.5 py-1.5 rounded-[8px] cursor-pointer transition-colors shadow-sm"
                style={{
                  border: dateSort ? '1.5px solid #DE5D8F' : '1.5px solid #0165F8',
                  minWidth: 108,
                  height: 38,
                }}
              >
                <span
                  className="font-bold text-[#1A1C1C] text-[14px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  {dateSort ? (dateSort === 'newest' ? 'ใหม่ที่สุด' : 'เก่าที่สุด') : 'วันที่เผยแพร่'}
                </span>
                <ChevronDown size={16} color="#1A1C1C" />
              </button>
              {openDropdown === 'date' && (
                <div
                  className="absolute left-0 top-full mt-1.5 bg-white rounded-[10px] border border-[#DFDFE0] shadow-lg py-1.5 z-30 min-w-[140px]"
                >
                  <button
                    type="button"
                    onClick={() => { setDateSort('newest'); setOpenDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    <span>เรียงจากใหม่ที่สุด</span>
                    {dateSort === 'newest' && <Check size={14} color="#DE5D8F" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDateSort('oldest'); setOpenDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    <span>เรียงจากเก่าที่สุด</span>
                    {dateSort === 'oldest' && <Check size={14} color="#DE5D8F" />}
                  </button>
                </div>
              )}
            </div>

            {/* 5. ผู้เข้าชม Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('views')}
                className="flex items-center justify-between gap-2 bg-white px-3.5 py-1.5 rounded-[8px] cursor-pointer transition-colors shadow-sm"
                style={{
                  border: viewsSort ? '1.5px solid #DE5D8F' : '1.5px solid #0165F8',
                  minWidth: 108,
                  height: 38,
                }}
              >
                <span
                  className="font-bold text-[#1A1C1C] text-[14px]"
                  style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                >
                  {viewsSort ? (viewsSort === 'most' ? 'มากที่สุด' : 'น้อยที่สุด') : 'ผู้เข้าชม'}
                </span>
                <ChevronDown size={16} color="#1A1C1C" />
              </button>
              {openDropdown === 'views' && (
                <div
                  className="absolute left-0 top-full mt-1.5 bg-white rounded-[10px] border border-[#DFDFE0] shadow-lg py-1.5 z-30 min-w-[140px]"
                >
                  <button
                    type="button"
                    onClick={() => { setViewsSort('most'); setOpenDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    <span>เรียงจากมากที่สุด</span>
                    {viewsSort === 'most' && <Check size={14} color="#DE5D8F" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setViewsSort('least'); setOpenDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    <span>เรียงจากน้อยที่สุด</span>
                    {viewsSort === 'least' && <Check size={14} color="#DE5D8F" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ล้างฟิลเตอร์ Link to the right */}
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-[#8B8B8C] hover:text-[#DE5D8F] text-[13px] underline cursor-pointer bg-transparent border-none transition-colors"
            style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
          >
            ล้างฟิลเตอร์
          </button>

          {/* Close backdrop if dropdown open */}
          {openDropdown && (
            <div
              className="fixed inset-0 z-20"
              onClick={() => setOpenDropdown(null)}
            />
          )}
        </div>

        {/* ── Table Card (Figma Node 6538:28881) ── */}
        <div
          className="bg-white rounded-[16px] border border-[#DFDFE0] overflow-hidden shadow-sm relative"
        >
          {/* Scrollable table container */}
          <div className="overflow-x-auto" style={{ maxHeight: 520 }}>
            <table className="w-full text-left border-collapse" style={{ minWidth: 840 }}>
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
                      width: '32%',
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
                    สถานะ
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
                    className="py-4 px-6 font-bold text-[#1A1C1C]"
                    style={{
                      fontFamily: 'ChulaCharasNew, sans-serif',
                      fontSize: 16,
                      lineHeight: '22px',
                    }}
                  >
                    ยอดเข้าชม
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FFF9FB] transition-colors"
                    style={{
                      borderBottom:
                        idx < filtered.length - 1
                          ? '1px solid #F0F0F0'
                          : 'none',
                    }}
                  >
                    {/* Thumbnail + Title */}
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={articleThumb}
                          alt="thumbnail"
                          className="w-9 h-9 rounded-[6px] object-cover shrink-0 shadow-xs"
                        />
                        <span
                          className="font-bold text-[#1A1C1C] hover:text-[#DE5D8F] cursor-pointer transition-colors"
                          style={{
                            fontFamily: 'ChulaCharasNew, sans-serif',
                            fontSize: 16,
                            lineHeight: '20px',
                          }}
                        >
                          {item.title}
                        </span>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="py-3 px-4">
                      <span
                        className="text-[#1A1C1C]"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 15,
                        }}
                      >
                        {item.author}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span
                        className="text-[#1A1C1C]"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 15,
                        }}
                      >
                        {item.category}
                      </span>
                    </td>

                    {/* Status: เผยแพร่แล้ว in green, ร่างบทความ in blue */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-[14px] font-bold ${
                          item.status === 'เผยแพร่แล้ว'
                            ? 'text-[#3D940B]'
                            : 'text-[#0165F8]'
                        }`}
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Published Date */}
                    <td className="py-3 px-4">
                      <span
                        className="text-[#1A1C1C]"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 15,
                        }}
                      >
                        {item.publishedAt}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="py-3 px-6">
                      <span
                        className="text-[#1A1C1C] font-medium"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 15,
                        }}
                      >
                        {item.views}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pink scrollbar thumb on right edge matching Figma */}
          <div
            className="absolute right-0 top-12 bottom-0 w-1 bg-[#E992B4] rounded-full opacity-60"
            style={{ width: 3 }}
          />
        </div>

        {/* ── Table Footer Card: ทั้งหมด 108 รายการ (Figma Node 6538:28881) ── */}
        <div
          className="bg-white rounded-[16px] border border-[#DFDFE0] py-3.5 px-6 flex justify-end items-center shadow-sm"
        >
          <span
            className="text-[#6D6D6D] text-[14px] font-bold"
            style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
          >
            ทั้งหมด 108 รายการ
          </span>
        </div>
      </div>
    </AksornsaraLayout>
  );
}
