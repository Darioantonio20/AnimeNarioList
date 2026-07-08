import React, { useState } from 'react';

const SearchBar = ({ onSearch, value = '' }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex justify-center px-4 sm:px-0 w-full animate-fade-in">
      <div className={`relative w-full max-w-2xl transition-all duration-500 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
        {/* Glow effect behind the input when focused */}
        <div className={`absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-20 blur-md transition-opacity duration-500 ${isFocused ? 'opacity-40' : 'opacity-0'}`}></div>
        
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Buscar anime (ej. Naruto, Attack on Titan)..."
            value={value}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full rounded-full border border-gray-200/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-5 sm:px-8 py-3.5 sm:py-4 pl-12 sm:pl-14 text-sm sm:text-base text-gray-900 shadow-lg transition-all duration-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 dark:border-gray-700/50 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-800 min-h-[48px] sm:min-h-[56px]"
            style={{ fontSize: '16px' }} // Prevents zoom on iOS
          />
          <svg
            className={`absolute left-4 sm:left-6 h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-300 ${isFocused ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'}`}
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
          
          {/* Clear Button */}
          {value && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-4 sm:right-6 p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 