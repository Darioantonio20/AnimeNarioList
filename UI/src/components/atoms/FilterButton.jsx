import React from 'react';

const FilterButton = ({ children, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
        active
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
          : 'bg-white text-gray-700 hover:bg-emerald-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );
};

export default FilterButton; 