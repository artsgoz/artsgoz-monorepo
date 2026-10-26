import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Search,
  Download,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';

interface Article {
  id: number;
  title: string;
  author: string;
  category: string;
  status: 'เผยแพร่แล้ว' | 'รออนุมัติ' | 'ร่างบทความ';
  publishedAt: string;
  views: number;
}

const ARTICLES: Article[] = [
  { id: 1, title: 'บทความ...', author: 'วู กานดา', category: 'ศิลปะ', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 2, title: 'บทความ...', author: 'วู กานดา', category: 'วรรณกรรม', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 3, title: 'บทความ...', author: 'วู กานดา', category: 'ภาษา', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 4, title: 'บทความ...', author: 'วู กานดา', category: 'วัฒนธรรม', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 5, title: 'บทความ...', author: 'วู กานดา', category: 'ปรัชญา', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 6, title: 'บทความ...', author: 'วู กานดา', category: 'วิจารณ์', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 7, title: 'บทความ...', author: 'วู กานดา', category: 'อื่นๆ', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 8, title: 'บทความ...', author: 'วู กานดา', category: 'อื่นๆ', status: 'รออนุมัติ', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 9, title: 'บทความ...', author: 'วู กานดา', category: 'อื่นๆ', status: 'ร่างบทความ', publishedAt: '1 ม.ค. 69', views: 67 },
  { id: 10, title: 'บทความ...', author: 'วู กานดา', category: 'อื่นๆ', status: 'เผยแพร่แล้ว', publishedAt: '1 ม.ค. 69', views: 67 },
];

const CATEGORIES = [
  'ทั้งหมด',
  'วรรณกรรม',
  'ภาษา',
  'วัฒนธรรม',
  'ปรัชญา',
  'วิจารณ์',
  'อื่นๆ',
];

interface RadioOptionProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

function RadioOption({ label, checked, onChange }: RadioOptionProps) {
  return (
    <div
      onClick={onChange}
      className="flex items-center gap-2 cursor-pointer transition-colors select-none group"
    >
      <div
        className="w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all shrink-0"
        style={{
          border: '1.5px solid #DE5D8F',
          backgroundColor: '#FFFFFF',
        }}
      >
        {checked && (
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#DE5D8F' }}
          />
        )}
      </div>
      <span
        className="text-[#404041] group-hover:text-[#1A1C1C] transition-colors"
        style={{
          fontFamily: 'ChulaCharasNew, sans-serif',
          fontSize: 14,
          lineHeight: '18px',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function PublishedArticlesPage() {
  const [search, setSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter States (Figma Node 8070:48917)
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Sorting States
  const [titleSort, setTitleSort] = useState<'asc' | 'desc' | null>(null);
  const [authorSort, setAuthorSort] = useState<'asc' | 'desc' | null>(null);
  const [dateSort, setDateSort] = useState<'newest' | 'oldest' | null>(null);
  const [viewsSort, setViewsSort] = useState<'most' | 'least' | null>(null);

  const navigate = useNavigate();

  const activeSearch = search || localSearch;

  // Filter & Sort Logic
  const filtered = ARTICLES.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
      a.author.toLowerCase().includes(activeSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(activeSearch.toLowerCase());

    const matchCategory =
      selectedCategory === 'ทั้งหมด' || a.category === selectedCategory;

    const matchStatus =
      !selectedStatus || a.status === selectedStatus;

    return matchSearch && matchCategory && matchStatus;
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
    setSelectedCategory('ทั้งหมด');
    setSelectedStatus(null);
    setTitleSort(null);
    setAuthorSort(null);
    setDateSort(null);
    setViewsSort(null);
    setLocalSearch('');
    setSearch('');
  };

  return (
    <AksornsaraLayout
      showBackButton={true}
      onBack={() => navigate('/aksornsara')}
      searchValue={search}
      onSearchChange={setSearch}
    >
      <div className="w-full flex flex-col gap-6" style={{ maxWidth: 960 }}>
        {/* ── Page Header: Title + Export Button ── */}
        <div className="flex items-end justify-between">
          <h1
            className="font-bold text-[#1A1C1C]"
            style={{
              fontFamily: 'ChulaCharasNew, sans-serif',
              fontSize: 48,
              lineHeight: '64px',
              margin: 0,
            }}
          >
            บทความที่เผยแพร่แล้ว
          </h1>
          <button
            type="button"
            className="flex items-center cursor-pointer border-none transition-all hover:bg-[#DE5D8F] shadow-sm active:scale-95"
            style={{
              height: 40,
              padding: '8px 24px',
              borderRadius: 9999,
              backgroundColor: '#E992B4',
              gap: 6,
              boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <Download size={13} color="#ffffff" />
            <span
              className="font-bold text-white"
              style={{ fontFamily: 'ChulaCharasNew, sans-serif', fontSize: 14 }}
            >
              ส่งออกข้อมูล
            </span>
          </button>
        </div>

        {/* ── Search & Filter Box (Figma Node 8070:48998 & 8070:48917) ── */}
        <div
          className="bg-white rounded-[16px] border border-[#DFDFE0] flex items-center gap-3 p-4 relative"
          style={{
            boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.03)',
          }}
        >
          {/* Pill Search Input */}
          <div
            className="flex items-center flex-1"
            style={{
              height: 44,
              borderRadius: 9999,
              border: '1px solid #8B8B8C',
              backgroundColor: '#FFFFFF',
              padding: '8px 20px',
            }}
          >
            <input
              className="flex-1 bg-transparent outline-none text-[#1A1C1C]"
              style={{
                fontFamily: 'ChulaCharasNew, sans-serif',
                fontSize: 18,
                color: '#1A1C1C',
              }}
              placeholder="ค้นหาบทความ..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <Search size={20} color="#33363F" className="shrink-0" />
          </div>

          {/* Pink Filter Icon Button Container */}
          <div className="relative">
            <button
              id="filter-dropdown-btn"
              type="button"
              onClick={() => setFilterOpen((prev) => !prev)}
              className="flex items-center justify-center shrink-0 cursor-pointer border-none transition-all hover:brightness-95 shadow-sm active:scale-95"
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                backgroundColor: '#DE5D8F',
              }}
              title="ตัวกรอง"
            >
              <SlidersHorizontal size={20} color="#FFFFFF" strokeWidth={2.2} />
            </button>

            {/* Backdrop to close popover when clicking outside */}
            {filterOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setFilterOpen(false)}
              />
            )}

            {/* Filter Popover Dropdown (Figma Node 8070:48917) */}
            {filterOpen && (
              <div
                id="filter-popover"
                className="absolute right-0 top-full mt-3 bg-white rounded-[20px] border border-[#DFDFE0] p-6 z-50 flex flex-col gap-6"
                style={{
                  width: 440,
                  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.12)',
                }}
              >
                {/* 2-Column Filter Layout */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {/* ── LEFT COLUMN ── */}
                  <div className="flex flex-col gap-5">
                    {/* หมวดหมู่ (Category) */}
                    <div className="flex flex-col gap-2.5">
                      <span
                        className="font-bold text-[#1A1C1C] text-[16px]"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        หมวดหมู่
                      </span>

                      {/* Category Chips Rows matching Figma */}
                      <div className="flex flex-wrap gap-1.5">
                        {CATEGORIES.map((cat) => {
                          const isSelected = selectedCategory === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategory(cat)}
                              className="px-2.5 py-0.5 rounded-full text-[13px] font-bold cursor-pointer transition-colors border-none flex items-center gap-1"
                              style={{
                                fontFamily: 'ChulaCharasNew, sans-serif',
                                backgroundColor: isSelected ? '#DE5D8F' : '#F0F1F2',
                                color: isSelected ? '#FFFFFF' : '#545455',
                              }}
                            >
                              <span>{cat}</span>
                              {isSelected && <Check size={12} strokeWidth={2.5} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ชื่อผู้แต่ง (Author sorting) */}
                    <div className="flex flex-col gap-2">
                      <span
                        className="font-bold text-[#1A1C1C] text-[16px]"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        ชื่อผู้แต่ง
                      </span>
                      <div className="flex flex-col gap-2 pl-0.5">
                        <RadioOption
                          label="เรียงจาก A-Z"
                          checked={authorSort === 'asc'}
                          onChange={() => {
                            setAuthorSort(authorSort === 'asc' ? null : 'asc');
                            setTitleSort(null);
                          }}
                        />
                        <RadioOption
                          label="เรียงจาก Z-A"
                          checked={authorSort === 'desc'}
                          onChange={() => {
                            setAuthorSort(authorSort === 'desc' ? null : 'desc');
                            setTitleSort(null);
                          }}
                        />
                      </div>
                    </div>

                    {/* วันที่เผยแพร่ (Publish date sorting) */}
                    <div className="flex flex-col gap-2">
                      <span
                        className="font-bold text-[#1A1C1C] text-[16px]"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        วันที่เผยแพร่
                      </span>
                      <div className="flex flex-col gap-2 pl-0.5">
                        <RadioOption
                          label="เรียงจากใหม่ที่สุด"
                          checked={dateSort === 'newest'}
                          onChange={() =>
                            setDateSort(dateSort === 'newest' ? null : 'newest')
                          }
                        />
                        <RadioOption
                          label="เรียงจากเก่าที่สุด"
                          checked={dateSort === 'oldest'}
                          onChange={() =>
                            setDateSort(dateSort === 'oldest' ? null : 'oldest')
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── RIGHT COLUMN ── */}
                  <div className="flex flex-col gap-5">
                    {/* ชื่อบทความ (Article title sorting) */}
                    <div className="flex flex-col gap-2">
                      <span
                        className="font-bold text-[#1A1C1C] text-[16px]"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        ชื่อบทความ
                      </span>
                      <div className="flex flex-col gap-2 pl-0.5">
                        <RadioOption
                          label="เรียงจาก A-Z"
                          checked={titleSort === 'asc'}
                          onChange={() => {
                            setTitleSort(titleSort === 'asc' ? null : 'asc');
                            setAuthorSort(null);
                          }}
                        />
                        <RadioOption
                          label="เรียงจาก Z-A"
                          checked={titleSort === 'desc'}
                          onChange={() => {
                            setTitleSort(titleSort === 'desc' ? null : 'desc');
                            setAuthorSort(null);
                          }}
                        />
                      </div>
                    </div>

                    {/* สถานะ (Status filter) */}
                    <div className="flex flex-col gap-2">
                      <span
                        className="font-bold text-[#1A1C1C] text-[16px]"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        สถานะ
                      </span>
                      <div className="flex flex-col gap-2 pl-0.5">
                        <RadioOption
                          label="เผยแพร่แล้ว"
                          checked={selectedStatus === 'เผยแพร่แล้ว'}
                          onChange={() =>
                            setSelectedStatus(
                              selectedStatus === 'เผยแพร่แล้ว' ? null : 'เผยแพร่แล้ว'
                            )
                          }
                        />
                        <RadioOption
                          label="รออนุมัติ"
                          checked={selectedStatus === 'รออนุมัติ'}
                          onChange={() =>
                            setSelectedStatus(
                              selectedStatus === 'รออนุมัติ' ? null : 'รออนุมัติ'
                            )
                          }
                        />
                        <RadioOption
                          label="ร่างบทความ"
                          checked={selectedStatus === 'ร่างบทความ'}
                          onChange={() =>
                            setSelectedStatus(
                              selectedStatus === 'ร่างบทความ' ? null : 'ร่างบทความ'
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* ผู้เข้าชม (Views sorting) */}
                    <div className="flex flex-col gap-2">
                      <span
                        className="font-bold text-[#1A1C1C] text-[16px]"
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        ผู้เข้าชม
                      </span>
                      <div className="flex flex-col gap-2 pl-0.5">
                        <RadioOption
                          label="เรียงจากมากที่สุด"
                          checked={viewsSort === 'most'}
                          onChange={() =>
                            setViewsSort(viewsSort === 'most' ? null : 'most')
                          }
                        />
                        <RadioOption
                          label="เรียงจากน้อยที่สุด"
                          checked={viewsSort === 'least'}
                          onChange={() =>
                            setViewsSort(viewsSort === 'least' ? null : 'least')
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Clear Filter Link (ล้างฟิลเตอร์) */}
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-[#8B8B8C] hover:text-[#DE5D8F] text-[13px] underline cursor-pointer bg-transparent border-none transition-colors"
                    style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                  >
                    ล้างฟิลเตอร์
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Main Data Table Card (Figma Node 8070:48998) ── */}
        <div
          className="bg-white rounded-[16px] border border-[#DFDFE0] overflow-x-auto shadow-sm"
        >
          <table className="w-full text-left border-collapse" style={{ minWidth: 840 }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid #DFDFE0',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <th
                  className="py-4 px-6 font-bold text-[#6D6D6D]"
                  style={{
                    fontFamily: 'ChulaCharasNew, sans-serif',
                    fontSize: 16,
                    lineHeight: '22px',
                    width: '30%',
                  }}
                >
                  ชื่อบทความ
                </th>
                <th
                  className="py-4 px-4 font-bold text-[#6D6D6D]"
                  style={{
                    fontFamily: 'ChulaCharasNew, sans-serif',
                    fontSize: 16,
                    lineHeight: '22px',
                  }}
                >
                  ผู้แต่ง
                </th>
                <th
                  className="py-4 px-4 font-bold text-[#6D6D6D]"
                  style={{
                    fontFamily: 'ChulaCharasNew, sans-serif',
                    fontSize: 16,
                    lineHeight: '22px',
                  }}
                >
                  หมวดหมู่
                </th>
                <th
                  className="py-4 px-4 font-bold text-[#6D6D6D]"
                  style={{
                    fontFamily: 'ChulaCharasNew, sans-serif',
                    fontSize: 16,
                    lineHeight: '22px',
                  }}
                >
                  สถานะ
                </th>
                <th
                  className="py-4 px-4 font-bold text-[#6D6D6D]"
                  style={{
                    fontFamily: 'ChulaCharasNew, sans-serif',
                    fontSize: 16,
                    lineHeight: '22px',
                  }}
                >
                  วันที่เผยแพร่
                </th>
                <th
                  className="py-4 px-6 font-bold text-[#6D6D6D] text-right"
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
              {filtered.map((article, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <tr
                    key={article.id}
                    className="hover:bg-[#FFF9FB] transition-colors"
                    style={{
                      borderBottom:
                        idx < filtered.length - 1
                          ? '1px solid #F0F0F0'
                          : 'none',
                      backgroundColor: isEven ? '#FAFAFA' : '#FFFFFF',
                    }}
                  >
                    {/* Thumbnail + Title */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-md bg-[#DFDFE0] shrink-0 flex items-center justify-center text-xs text-gray-400 font-bold"
                          style={{
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
                          }}
                        />
                        <span
                          className="font-bold text-[#1A1C1C] hover:text-[#9E4266] cursor-pointer transition-colors"
                          style={{
                            fontFamily: 'ChulaCharasNew, sans-serif',
                            fontSize: 16,
                            lineHeight: '20px',
                          }}
                        >
                          {article.title}
                        </span>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-4">
                      <span
                        className="text-[#1A1C1C]"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 15,
                        }}
                      >
                        {article.author}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span
                        className="text-[#1A1C1C]"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 15,
                        }}
                      >
                        {article.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[14px] font-bold ${
                          article.status === 'เผยแพร่แล้ว'
                            ? 'text-[#64A93C]'
                            : article.status === 'รออนุมัติ'
                            ? 'text-[#EA6D24]'
                            : 'text-[#8B8B8C]'
                        }`}
                        style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
                      >
                        {article.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4">
                      <span
                        className="text-[#1A1C1C]"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 15,
                        }}
                      >
                        {article.publishedAt}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="py-3.5 px-6 text-right">
                      <span
                        className="text-[#1A1C1C] font-medium"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 15,
                        }}
                      >
                        {article.views}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer: Total Count ── */}
        <div
          className="bg-white rounded-[16px] border border-[#DFDFE0] py-3.5 px-6 flex justify-end items-center shadow-sm"
        >
          <span
            className="text-[#8B8B8C] text-[14px]"
            style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
          >
            ทั้งหมด {filtered.length} รายการ
          </span>
        </div>
      </div>
    </AksornsaraLayout>
  );
}
