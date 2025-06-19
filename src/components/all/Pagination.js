const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxPageDisplay = 5;

  const generatePageNumbers = () => {
    let start = Math.max(1, currentPage - Math.floor(maxPageDisplay / 2));
    let end = start + maxPageDisplay - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPageDisplay + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div className="flex justify-center mt-4 space-x-4 text-sm text-gray-700">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="underline disabled:text-gray-400"
      >
        First
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="underline disabled:text-gray-400"
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`underline ${
            page === currentPage ? "font-bold text-gray-900" : ""
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="underline disabled:text-gray-400"
      >
        Next
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="underline disabled:text-gray-400"
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
