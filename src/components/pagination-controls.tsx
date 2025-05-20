"use client";

import { useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

type PageItem = number | "ellipsis1" | "ellipsis2";

export default function PaginationControls({
  currentPage,
  lastPage,
  onPageChange,
}: PaginationControlsProps) {
  // Generate array of page numbers to show
  const getPageNumbers = useCallback(() => {
    const delta = 2; // Number of pages to show before and after current page
    const range: number[] = [];
    const rangeWithDots: PageItem[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(lastPage - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Always show first page
    if (currentPage > delta + 1) {
      rangeWithDots.push(1);
    }

    // Add ellipsis if needed
    if (currentPage > delta + 2) {
      rangeWithDots.push("ellipsis1");
    }

    // Add the range of pages around current page
    range.forEach((i) => rangeWithDots.push(i));

    // Add ellipsis if needed
    if (currentPage < lastPage - delta - 1) {
      rangeWithDots.push("ellipsis2");
    }

    // Always show last page if it's not already included
    if (lastPage > 1 && currentPage < lastPage - delta) {
      rangeWithDots.push(lastPage);
    }

    return rangeWithDots;
  }, [currentPage, lastPage]);

  // If there's only one page, don't render pagination
  if (lastPage <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className="my-4">
      <PaginationContent>
        {/* Previous button */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }}
            />
          </PaginationItem>
        )}

        {/* Show first page (if not in range) */}
        {!pageNumbers.includes(1) && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(1);
              }}
              isActive={currentPage === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Page numbers with ellipsis */}
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis1" || page === "ellipsis2") {
            return (
              <PaginationItem key={`${page}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Number(page));
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next button */}
        {currentPage < lastPage && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
