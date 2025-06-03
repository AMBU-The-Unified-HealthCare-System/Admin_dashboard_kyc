type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {

    // Function to generate page numbers based on the current page and total pages
  const generatePageNumbers = () => {
    const visiblepages = 10;
    let start = Math.max(1, currentPage - Math.floor(visiblepages / 2));
    const end = Math.min(totalPages, start + visiblepages - 1);

    if (end - start < visiblepages - 1) {
      start = Math.max(1, end - visiblepages + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };


  return (
    <div className="flex justify-center items-center gap-2 mt-4 text-sm">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 text-gray-600 disabled:opacity-50"
      >
        &lt; Previous
      </button>

      {generatePageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 py-1 rounded ${
            currentPage === page ? " bg-sky-50 text-blue-500" : "text-gray-700"
          }`}
        >
          {page.toString().padStart(2, "0")}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 text-gray-600 disabled:opacity-50"
      >
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;
