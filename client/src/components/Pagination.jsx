import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFilters } from '../contexts/FilterContext';

const Pagination = () => {
  const { currentPage, totalPages, goToPage } = useFilters();
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">

      {/* Previous Button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 disabled:bg-neutral-800 disabled:text-neutral-500 rounded text-white text-sm">
        <ChevronLeft size={16} /> Previous
      </button>

      {/* Number for Total Pages */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-3 py-2 rounded text-sm ${
            currentPage === page ? 'bg-purple-600 text-white' : 'bg-neutral-700 hover:bg-neutral-600 text-white'
          }`}>
          {page}
        </button>
      ))}

      {/* If More Than One Page Next Page Button*/}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 disabled:bg-neutral-800 disabled:text-neutral-500 rounded text-white text-sm">
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
