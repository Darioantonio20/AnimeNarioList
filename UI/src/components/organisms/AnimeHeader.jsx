import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AnimeHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/40 ${scrolled ? 'shadow-lg shadow-emerald-500/10' : 'shadow-md shadow-emerald-500/5'}`}>
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo Area */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="group flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <span className="hidden sm:block text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-110">
                AnimeDarío-List
              </span>
            </Link>
          </div>

          {/* Slogan - hidden on mobile/tablet for space */}
          <div className="hidden lg:flex flex-col justify-center opacity-80 animate-fade-in">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400"></p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/my-lists"
              className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white dark:bg-gray-800 px-4 py-2.5 sm:px-5 sm:py-2.5 shadow-md ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:ring-emerald-500/50 active:scale-95"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              
              <svg
                className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                Mis Listas
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AnimeHeader; 