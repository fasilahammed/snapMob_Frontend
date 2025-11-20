import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="flex justify-center mt-12">
      <nav className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1} 
          className="px-4 py-2 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-md"
        >
          &laquo; Prev
        </button>
        
        {pages.map((page) => (
          <button 
            key={page} 
            onClick={() => onPageChange(page)} 
            className={`px-4 py-2 rounded-xl border-2 font-semibold transition-all duration-300 shadow-md ${
              page === currentPage 
                ? "bg-orange-500 text-white border-orange-500 scale-110 shadow-lg" 
                : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
        
        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages} 
          className="px-4 py-2 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-md"
        >
          Next &raquo;
        </button>
      </nav>
    </div>
  );
}