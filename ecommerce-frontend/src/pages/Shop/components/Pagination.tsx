import React from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { Button } from '@/components/ui/button';
import { productFiltersState, productPaginationState } from '@/store/atoms/shop';

export const Pagination: React.FC = () => {
  const setFilters = useSetRecoilState(productFiltersState);
  const pagination = useRecoilValue(productPaginationState);

  const { currentPage, totalPages } = pagination;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setFilters((prev) => ({ ...prev, page }));
    }
  };

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-sm mt-xl">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="p-2 h-auto w-auto rounded-lg border-outline-variant text-outline hover:text-primary-container hover:border-primary-container hover:bg-transparent transition-colors flex items-center justify-center outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </Button>
      
      <div className="flex gap-1">
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "ghost"}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-lg font-label-md flex items-center justify-center outline-none transition-colors ${
              page === currentPage
                ? "bg-primary-container text-white hover:bg-primary-container/90 shadow-none"
                : "hover:bg-surface-variant text-on-surface"
            }`}
          >
            {page}
          </Button>
        ))}
        {totalPages > getPageNumbers()[getPageNumbers().length - 1] && (
          <span className="w-10 h-10 flex items-center justify-center text-outline-variant">
            ...
          </span>
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="p-2 h-auto w-auto rounded-lg border-outline-variant text-outline hover:text-primary-container hover:border-primary-container hover:bg-transparent transition-colors flex items-center justify-center outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </Button>
    </div>
  );
};
