import React from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = React.useState({
    type: '',
    genres: '',
    nsfw: false
  });

  const types = [
    { value: 'tv', label: 'Series' },
    { value: 'movie', label: 'Películas' },
    { value: 'ova', label: 'OVAs' }
  ];

  // IDs de Jikan v4 reales
  const genres = [
    { value: '1', label: 'Acción' },
    { value: '2', label: 'Aventura' },
    { value: '4', label: 'Comedia' },
    { value: '8', label: 'Drama' },
    { value: '10', label: 'Fantasía' },
    { value: '22', label: 'Romance' },
    { value: '24', label: 'Sci-Fi' },
    { value: '9', label: 'Ecchi', nsfw: true },
    { value: '12', label: 'Hentai', nsfw: true }
  ];

  const handleTypeSelect = (typeVal) => {
    const newVal = activeFilters.type === typeVal ? '' : typeVal;
    const nextFilters = { ...activeFilters, type: newVal };
    setActiveFilters(nextFilters);
    onFilterChange(nextFilters);
  };

  const handleGenreSelect = (genreVal) => {
    const newVal = activeFilters.genres === genreVal ? '' : genreVal;
    const nextFilters = { ...activeFilters, genres: newVal };
    setActiveFilters(nextFilters);
    onFilterChange(nextFilters);
  };

  const clearFilters = () => {
    const nextFilters = { type: '', genres: '', nsfw: false };
    setActiveFilters(nextFilters);
    onFilterChange(nextFilters);
  };

  const hasActiveFilters = activeFilters.type !== '' || activeFilters.genres !== '';

  return (
    <div className="mb-6 rounded-2xl glass-panel p-4 sm:p-5 shadow-lg animate-fade-in transition-all duration-300 relative z-10">
      <div className="flex flex-col gap-4 items-center justify-center">
        
        {/* Filtros Container */}
        <div className="flex flex-col gap-4 w-full items-center">
          
          {/* Tipos */}
          <div className="flex flex-col items-center gap-2 w-full">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">Tipo</span>
            <div className="flex flex-wrap justify-center gap-2 w-full">
              {types.map((type) => {
                const isActive = activeFilters.type === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => handleTypeSelect(type.value)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-all duration-300 active:scale-95 ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-500/50' 
                        : 'bg-white/50 hover:bg-white text-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-700 dark:text-gray-300 ring-1 ring-gray-200/50 dark:ring-gray-700/50 hover:shadow-md'
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Separador (Solo visible si deciden ponerlo en horizontal luego, pero por ahora lo oculto en este diseño centrado vertical/wrap) */}
          <div className="hidden w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-1" />

          {/* Géneros */}
          <div className="flex flex-col items-center gap-2 w-full">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">Género</span>
            <div className="flex flex-wrap justify-center gap-2 w-full">
              {genres.map((genre) => {
                const isActive = activeFilters.genres === genre.value;
                return (
                  <button
                    key={genre.value}
                    onClick={() => handleGenreSelect(genre.value)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-all duration-300 active:scale-95 ${
                      isActive 
                        ? genre.nsfw
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-500/50'
                          : 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-500/50'
                        : genre.nsfw
                          ? 'bg-red-50 hover:bg-red-100 text-red-500 dark:bg-red-900/10 dark:hover:bg-red-900/30 dark:text-red-400 ring-1 ring-red-200/50 dark:ring-red-900/50 hover:shadow-md'
                          : 'bg-white/50 hover:bg-white text-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-700 dark:text-gray-300 ring-1 ring-gray-200/50 dark:ring-gray-700/50 hover:shadow-md'
                    }`}
                  >
                    {genre.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Limpiar */}
        <div className={`transition-all duration-300 mt-2 ${hasActiveFilters ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2 pointer-events-none'}`}>
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-1.5 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 px-6 py-2 text-xs font-bold text-gray-500 dark:bg-gray-800 dark:hover:bg-red-900/30 dark:text-gray-400 dark:hover:text-red-400 ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-300 active:scale-95 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;