import React from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = React.useState({
    type: '',
    genres: '',
    nsfw: false
  });

  const types = [
    { value: 'tv', label: '📺 Series' },
    { value: 'movie', label: '🎬 Películas' },
    { value: 'ova', label: '💿 OVAs' }
  ];

  // IDs de Jikan v4 reales
  const genres = [
    { value: '1', label: '⚔️ Acción' },
    { value: '2', label: '🗺️ Aventura' },
    { value: '4', label: '😂 Comedia' },
    { value: '8', label: '🎭 Drama' },
    { value: '10', label: '🧙 Fantasía' },
    { value: '22', label: '💕 Romance' },
    { value: '24', label: '🚀 Sci-Fi' },
    { value: '9', label: '🔞 Ecchi', nsfw: true },
    { value: '12', label: '🔞 Hentai', nsfw: true }
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
    <div className="mb-6 rounded-2xl bg-white/60 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/50 p-4 sm:p-5 shadow-lg backdrop-blur-md transition-all duration-300">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          {/* Tipos */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">Tipo</span>
            <div className="flex gap-1.5">
              {types.map((type) => {
                const isActive = activeFilters.type === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => handleTypeSelect(type.value)}
                    className={`rounded-full px-3 py-1.5 text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 ${
                      isActive 
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Separador */}
          <div className="hidden lg:block h-5 w-px bg-gray-200 dark:bg-gray-700" />

          {/* Géneros */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">Género</span>
            <div className="flex flex-wrap gap-1.5">
              {genres.map((genre) => {
                const isActive = activeFilters.genres === genre.value;
                return (
                  <button
                    key={genre.value}
                    onClick={() => handleGenreSelect(genre.value)}
                    className={`rounded-full px-3 py-1.5 text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 ${
                      isActive 
                        ? genre.nsfw
                          ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                          : 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                        : genre.nsfw
                          ? 'bg-red-50 hover:bg-red-100 text-red-500 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
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
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="rounded-full bg-gray-100 hover:bg-red-500 hover:text-white px-4 py-1.5 text-xs font-bold text-gray-500 dark:bg-gray-700 dark:hover:bg-red-600 dark:text-gray-400 dark:hover:text-white transition-all duration-200 active:scale-95 self-start lg:self-auto"
          >
            ✕ Limpiar
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;