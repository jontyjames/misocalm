/**
 * Pagination Component
 * Handles paginated list navigation
 */

'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  hasMore,
  onPageChange,
  showInfo = true,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const canGoPrev = page > 1;
  const canGoNext = hasMore || page < totalPages;

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {showInfo && (
        <p className="text-sm text-slate-300 font-light">
          {start}-{end} of {total}
        </p>
      )}

      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!canGoPrev}
          className={`
            p-2 rounded-lg transition-colors
            ${canGoPrev
              ? 'text-slate-300 hover:text-white hover:bg-slate-700'
              : 'text-slate-600 cursor-not-allowed'
            }
          `}
          aria-label="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoPrev}
          className={`
            p-2 rounded-lg transition-colors
            ${canGoPrev
              ? 'text-slate-300 hover:text-white hover:bg-slate-700'
              : 'text-slate-600 cursor-not-allowed'
            }
          `}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page indicator */}
        <span className="px-3 py-1 text-sm text-slate-300 font-light">
          {page} / {totalPages}
        </span>

        {/* Next page */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext}
          className={`
            p-2 rounded-lg transition-colors
            ${canGoNext
              ? 'text-slate-300 hover:text-white hover:bg-slate-700'
              : 'text-slate-600 cursor-not-allowed'
            }
          `}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          className={`
            p-2 rounded-lg transition-colors
            ${canGoNext
              ? 'text-slate-300 hover:text-white hover:bg-slate-700'
              : 'text-slate-600 cursor-not-allowed'
            }
          `}
          aria-label="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Simple "Load More" button for infinite scroll patterns
 */
export function LoadMoreButton({ loading, hasMore, onLoadMore, className = '' }) {
  if (!hasMore) return null;

  return (
    <button
      onClick={onLoadMore}
      disabled={loading}
      aria-live="polite"
      className={`
        w-full py-3 px-4 rounded-lg
        bg-slate-800/50 border border-slate-700/50
        text-slate-300 font-light text-sm
        hover:bg-slate-700/50 hover:text-white
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${className}
      `}
    >
      {loading ? 'Bringing more in...' : 'Load more'}
    </button>
  );
}

export default Pagination;
