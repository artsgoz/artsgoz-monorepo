import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '../IconButton/index.js';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Near the start: 1, 2, 3, 4, 5, '...', totalPages
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }

  // Near the end: 1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages
  if (currentPage >= totalPages - 3) {
    return [
      1,
      '...',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // In the middle: 1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const visiblePages = getVisiblePages(currentPage, totalPages);

  const getPageButtonClass = (isActive: boolean) => {
    const stateStyle = isActive
      ? 'border-[var(--color-background-primary-dark,#DE5D8F)] bg-white text-[var(--color-text-primary,#DE5D8F)]'
      : 'border-[#DFE3E8] bg-white text-[#212B36] hover:bg-gray-50';

    return `flex items-center justify-center w-[32px] h-[32px] rounded-[4px] border shrink-0 cursor-pointer transition-colors text-center font-[family:var(--font-mobile-heading-lg,ChulaCharasNew)] text-[16px] font-bold leading-none ${stateStyle}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 w-full mt-8">
      {/* Left Chevron Button */}
      <IconButton
        icon={<ChevronLeft size={16} />}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-[32px] h-[32px] p-0 flex items-center justify-center"
        aria-label="Previous page"
      />

      {/* Page Numbers & Ellipsis */}
      {visiblePages.map((item, index) => {
        if (typeof item === 'string') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex items-center justify-center w-[32px] h-[32px] text-[#8B8B8C] font-serif text-[16px] select-none"
            >
              ...
            </span>
          );
        }
        return (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={getPageButtonClass(item === currentPage)}
            aria-current={item === currentPage ? 'page' : undefined}
          >
            {item}
          </button>
        );
      })}

      {/* Right Chevron Button */}
      <IconButton
        icon={<ChevronRight size={16} />}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-[32px] h-[32px] p-0 flex items-center justify-center"
        aria-label="Next page"
      />
    </div>
  );
}
