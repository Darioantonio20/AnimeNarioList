import React from 'react';
import { Link } from 'react-router-dom';

const AnimeHeader = () => {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div className="w-[120px]"></div>
        <Link to="/" className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-4xl font-bold text-transparent">
          AnimeNarioList
        </Link>
        <Link
          to="/my-lists"
          className="flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-white transition-all hover:bg-emerald-600"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <span>Mis Listas</span>
        </Link>
      </div>
      <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
        Descubre y explora el mundo del anime
      </p>
    </header>
  );
};

export default AnimeHeader; 