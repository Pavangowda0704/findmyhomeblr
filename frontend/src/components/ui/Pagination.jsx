import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-text-sub hover:bg-primary hover:text-dark hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <FaChevronLeft className="text-xs" />
      </button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-text-sub hover:bg-primary hover:text-dark hover:border-primary transition-all text-sm">1</button>
          {pages[0] > 2 && <span className="text-text-sub">...</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-all ${
            p === currentPage
              ? 'bg-primary border-primary text-dark'
              : 'border-border text-text-sub hover:bg-primary hover:text-dark hover:border-primary'
          }`}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="text-text-sub">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-text-sub hover:bg-primary hover:text-dark hover:border-primary transition-all text-sm">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-text-sub hover:bg-primary hover:text-dark hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <FaChevronRight className="text-xs" />
      </button>
    </div>
  );
};

export default Pagination;
