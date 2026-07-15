// Generated from Pagination.spec.ts
import { useCallback, useMemo } from 'react';
import { useControlledState } from '../../../engine';

export interface UsePaginationOptions {
  /** Total number of pages */
  total: number;
  /** Controlled active page (1-based) */
  page?: number;
  /** Uncontrolled initial page (1-based) */
  defaultPage?: number;
  /** Called when the active page changes */
  onChange?: (page: number) => void;
  /** Number of pages shown on each side of the active page */
  siblings?: number;
  /** Number of pages always shown at the start and end */
  boundaries?: number;
}

export interface UsePaginationReturn {
  /** Current active page (1-based) */
  page: number;
  /** Array of page numbers and 'dots' strings representing the visible range */
  range: (number | 'dots')[];
  /** Total number of pages */
  totalPages: number;
  /** Navigate to a specific page */
  setPage: (page: number) => void;
  /** Go to next page */
  next: () => void;
  /** Go to previous page */
  previous: () => void;
  /** Go to first page */
  first: () => void;
  /** Go to last page */
  last: () => void;
  /** Whether previous navigation is available */
  canPrevious: boolean;
  /** Whether next navigation is available */
  canNext: boolean;
}

function createRange(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
}

function computeRange(
  totalPages: number,
  currentPage: number,
  siblings: number,
  boundaries: number,
): (number | 'dots')[] {
  if (totalPages <= 0) return [];

  // Total slots: boundaries*2 + siblings*2 + 1 (current) + 2 (potential dots)
  const totalSlots = boundaries * 2 + siblings * 2 + 3;

  // If total pages fits in total slots, show all pages
  if (totalPages <= totalSlots) {
    return createRange(1, totalPages);
  }

  const leftBoundary = createRange(1, boundaries);
  const rightBoundary = createRange(totalPages - boundaries + 1, totalPages);

  const siblingStart = Math.max(boundaries + 1, currentPage - siblings);
  const siblingEnd = Math.min(totalPages - boundaries, currentPage + siblings);

  const showLeftDots = siblingStart > boundaries + 2;
  const showRightDots = siblingEnd < totalPages - boundaries - 1;

  const result: (number | 'dots')[] = [];

  // Left boundary
  result.push(...leftBoundary);

  // Left dots or fill
  if (showLeftDots) {
    result.push('dots');
  } else {
    // Fill the gap between boundary end and sibling start
    const fillStart = boundaries + 1;
    const fillEnd = siblingStart - 1;
    if (fillEnd >= fillStart) {
      result.push(...createRange(fillStart, fillEnd));
    }
  }

  // Sibling range (including current page)
  result.push(...createRange(siblingStart, siblingEnd));

  // Right dots or fill
  if (showRightDots) {
    result.push('dots');
  } else {
    const fillStart = siblingEnd + 1;
    const fillEnd = totalPages - boundaries;
    if (fillEnd >= fillStart) {
      result.push(...createRange(fillStart, fillEnd));
    }
  }

  // Right boundary
  result.push(...rightBoundary);

  return result;
}

export function usePagination(options: UsePaginationOptions): UsePaginationReturn {
  const { total, siblings = 1, boundaries = 1 } = options;

  const totalPages = Math.max(1, total);

  const [page, setPageRaw] = useControlledState<number>({
    value: options.page,
    defaultValue: options.defaultPage ?? 1,
    onChange: options.onChange,
  });

  const clampedPage = Math.max(1, Math.min(page, totalPages));

  const setPage = useCallback(
    (newPage: number) => {
      const clamped = Math.max(1, Math.min(newPage, totalPages));
      setPageRaw(clamped);
    },
    [totalPages, setPageRaw],
  );

  const next = useCallback(() => setPage(clampedPage + 1), [clampedPage, setPage]);
  const previous = useCallback(() => setPage(clampedPage - 1), [clampedPage, setPage]);
  const first = useCallback(() => setPage(1), [setPage]);
  const last = useCallback(() => setPage(totalPages), [totalPages, setPage]);

  const range = useMemo(
    () => computeRange(totalPages, clampedPage, siblings, boundaries),
    [totalPages, clampedPage, siblings, boundaries],
  );

  return {
    page: clampedPage,
    range,
    totalPages,
    setPage,
    next,
    previous,
    first,
    last,
    canPrevious: clampedPage > 1,
    canNext: clampedPage < totalPages,
  };
}
