import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="flex justify-center px-2 sm:px-0">
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          placeholder="Buscar anime..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-full border border-gray-300 bg-white px-4 sm:px-6 py-3 pl-10 sm:pl-12 text-sm sm:text-base text-gray-900 shadow-sm transition-all duration-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 min-h-[44px]"
          style={{ fontSize: '16px' }} // Prevents zoom on iOS
        />
        <svg
          className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar; 