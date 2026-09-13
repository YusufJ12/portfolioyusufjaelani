import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
}

export function ProjectsPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push('...');
      }
    }
    return pages.filter((page, index, array) => 
      array.indexOf(page) === index
    );
  };

  const getPageButtonClass = (page: number | string) => {
    if (typeof page !== 'number') return 'cursor-default';
    if (page === currentPage) return 'bg-[#ffe400] text-[#101010]';
    return 'hover:bg-[#ffe400] hover:text-[#101010]';
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-all duration-300 
          ${currentPage === 1 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'hover:bg-[#ffe400] hover:text-[#101010]'
          }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {renderPageNumbers().map((page, index) => (
        <button
          key={`page-${page}-${index}`}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 ${getPageButtonClass(page)}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-all duration-300 
          ${currentPage === totalPages 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'hover:bg-[#ffe400] hover:text-[#101010]'
          }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
} 