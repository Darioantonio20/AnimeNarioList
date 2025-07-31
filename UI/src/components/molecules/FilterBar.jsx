import React, { useState, useEffect } from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState({
    type: '',
    status: '',
    rating: '',
    year: '',
    season: '',
    genre: '',
    sfw: 'true' // Por defecto, mostrar contenido SFW
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQueries, setSearchQueries] = useState({
    genre: '',
    year: ''
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Filtros rápidos predefinidos
  const quickFilters = [
    { 
      label: '🔥 Populares', 
      filters: { type: 'tv', status: 'complete' },
      gradient: 'from-red-500 to-orange-500'
    },
    { 
      label: '📺 En Emisión', 
      filters: { status: 'airing' },
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      label: '🎬 Películas', 
      filters: { type: 'movie' },
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      label: '✨ Este Año', 
      filters: { year: new Date().getFullYear().toString() },
      gradient: 'from-blue-500 to-cyan-500'
    }
  ];

  const types = [
    { value: 'tv', label: 'TV', icon: '📺', color: 'emerald' },
    { value: 'movie', label: 'Película', icon: '🎬', color: 'purple' },
    { value: 'ova', label: 'OVA', icon: '💿', color: 'blue' },
    { value: 'ona', label: 'ONA', icon: '🌐', color: 'cyan' },
    { value: 'special', label: 'Especial', icon: '⭐', color: 'yellow' }
  ];

  const statuses = [
    { value: 'airing', label: 'En emisión', icon: '🟢', color: 'green' },
    { value: 'complete', label: 'Completado', icon: '✅', color: 'emerald' },
    { value: 'upcoming', label: 'Próximamente', icon: '🔮', color: 'blue' }
  ];

  const ratings = [
    { value: 'g', label: 'G - Todos', icon: '👶', color: 'green' },
    { value: 'pg', label: 'PG - Guía parental', icon: '👨‍👩‍👧‍👦', color: 'blue' },
    { value: 'pg13', label: 'PG-13 - +13', icon: '🧒', color: 'yellow' },
    { value: 'r17', label: 'R - +17', icon: '👤', color: 'orange' },
    { value: 'r', label: 'R+ - Adulto', icon: '🔞', color: 'red' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => {
    const year = currentYear - i;
    return { 
      value: year.toString(), 
      label: year.toString(),
      icon: year >= 2020 ? '🆕' : year >= 2010 ? '📈' : '📚',
      color: year >= 2020 ? 'emerald' : year >= 2010 ? 'blue' : 'gray'
    };
  });

  const seasons = [
    { value: 'winter', label: 'Invierno', icon: '❄️', color: 'blue' },
    { value: 'spring', label: 'Primavera', icon: '🌸', color: 'pink' },
    { value: 'summer', label: 'Verano', icon: '☀️', color: 'yellow' },
    { value: 'fall', label: 'Otoño', icon: '🍂', color: 'orange' }
  ];

  const genres = [
    { value: 'action', label: 'Acción', icon: '⚔️', color: 'red' },
    { value: 'adventure', label: 'Aventura', icon: '🗺️', color: 'emerald' },
    { value: 'comedy', label: 'Comedia', icon: '😂', color: 'yellow' },
    { value: 'drama', label: 'Drama', icon: '🎭', color: 'purple' },
    { value: 'fantasy', label: 'Fantasía', icon: '🧙‍♂️', color: 'indigo' },
    { value: 'horror', label: 'Terror', icon: '👻', color: 'gray' },
    { value: 'mystery', label: 'Misterio', icon: '🔍', color: 'slate' },
    { value: 'romance', label: 'Romance', icon: '💕', color: 'pink' },
    { value: 'sci-fi', label: 'Ciencia Ficción', icon: '🚀', color: 'cyan' },
    { value: 'slice-of-life', label: 'Slice of Life', icon: '🏡', color: 'green' },
    { value: 'sports', label: 'Deportes', icon: '⚽', color: 'orange' },
    { value: 'supernatural', label: 'Sobrenatural', icon: '👽', color: 'violet' },
    { value: 'hentai', label: 'Hentai', icon: '🔞', color: 'red' }
  ];

  const handleFilterChange = (category, value) => {
    const newFilters = {
      ...activeFilters,
      [category]: activeFilters[category] === value ? '' : value // Toggle si ya está activo
    };
    
    // Si se selecciona Hentai, desactivar SFW
    if (category === 'genre' && value === 'hentai') {
      newFilters.sfw = 'false';
    } else if (category === 'genre' && value !== 'hentai' && newFilters.genre !== '') {
      newFilters.sfw = 'true';
    }
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const applyQuickFilter = (quickFilter) => {
    const newFilters = { ...activeFilters, ...quickFilter.filters };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = Object.keys(activeFilters).reduce((acc, key) => {
      acc[key] = key === 'sfw' ? 'true' : '';
      return acc;
    }, {});
    setActiveFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.entries(activeFilters).filter(([key, value]) => value !== '' && key !== 'sfw').length;
  };

  const getColorClasses = (color, isActive = false) => {
    const colorMap = {
      emerald: isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300',
      purple: isActive ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300',
      blue: isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300',
      cyan: isActive ? 'bg-cyan-500 text-white' : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 dark:bg-cyan-900 dark:text-cyan-300',
      yellow: isActive ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300',
      green: isActive ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300',
      red: isActive ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300',
      orange: isActive ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300',
      pink: isActive ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900 dark:text-pink-300',
      indigo: isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300',
      gray: isActive ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300',
      slate: isActive ? 'bg-slate-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300',
      violet: isActive ? 'bg-violet-500 text-white' : 'bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900 dark:text-violet-300'
    };
    return colorMap[color] || colorMap.gray;
  };

  const filteredGenres = genres.filter(genre => 
    genre.label.toLowerCase().includes(searchQueries.genre.toLowerCase())
  );

  const filteredYears = years.filter(year => 
    year.label.includes(searchQueries.year)
  );

  return (
    <div className={`mb-8 overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-700 ease-out dark:bg-gray-900/90 dark:border-gray-700/30 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      {/* Header Premium */}
      <div className="relative bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-transparent to-emerald-800/20" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Filtros Avanzados</h2>
              {getActiveFiltersCount() > 0 && (
                <p className="text-emerald-100 text-sm">
                  {getActiveFiltersCount()} filtro{getActiveFiltersCount() > 1 ? 's' : ''} activo{getActiveFiltersCount() > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group relative overflow-hidden rounded-full bg-white/20 backdrop-blur-sm p-3 text-white transition-all duration-300 hover:bg-white/30 hover:scale-110"
              title={isExpanded ? 'Contraer' : 'Expandir'}
            >
              <svg className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {getActiveFiltersCount() > 0 && (
        <button
          onClick={clearFilters}
                className="group relative overflow-hidden rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-red-500 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Limpiar Todo
                </span>
        </button>
            )}
          </div>
        </div>
      </div>

      {/* Filtros Rápidos - Responsive */}
      <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Acceso Rápido:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 sm:gap-3 md:gap-4">
          {quickFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => applyQuickFilter(filter)}
              className={`group relative overflow-hidden rounded-full bg-gradient-to-r ${filter.gradient} px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 lg:px-6 lg:py-3 text-xs sm:text-sm md:text-base font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg text-center min-h-[40px] md:min-h-[48px] lg:min-h-[52px] flex items-center justify-center`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative leading-tight">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido Principal de Filtros */}
      <div className={`transition-all duration-500 overflow-hidden ${
        isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          
          {/* Tipos - Responsive */}
          <div className="space-y-3 sm:space-y-4 filter-category">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
              </svg>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Tipo de Contenido</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 sm:gap-3 md:gap-4">
              {types.map((type, index) => (
                <button
                  key={type.value}
                  onClick={() => handleFilterChange('type', type.value)}
                  className={`group relative overflow-hidden rounded-full px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg min-h-[40px] md:min-h-[48px] flex items-center justify-center ${
                    getColorClasses(type.color, activeFilters.type === type.value)
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center gap-1 sm:gap-2 md:gap-3">
                    <span className="text-sm sm:text-base md:text-lg">{type.icon}</span>
                    <span className="text-center leading-tight">{type.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Estados - Responsive */}
          <div className="space-y-3 sm:space-y-4 filter-category">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Estado de Emisión</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 sm:gap-3 md:gap-4">
              {statuses.map((status, index) => (
                <button
                  key={status.value}
                  onClick={() => handleFilterChange('status', status.value)}
                  className={`group relative overflow-hidden rounded-full px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg min-h-[40px] md:min-h-[48px] flex items-center justify-center ${
                    getColorClasses(status.color, activeFilters.status === status.value)
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center gap-1 sm:gap-2 md:gap-3">
                    <span className="text-sm sm:text-base md:text-lg">{status.icon}</span>
                    <span className="text-center leading-tight">{status.label}</span>
                  </span>
                </button>
              ))}
            </div>
        </div>

          {/* Clasificaciones - Responsive */}
          <div className="space-y-3 sm:space-y-4 filter-category">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
              </svg>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Clasificación</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap gap-2 sm:gap-3 md:gap-4">
              {ratings.map((rating, index) => (
                <button
                  key={rating.value}
                  onClick={() => handleFilterChange('rating', rating.value)}
                  className={`group relative overflow-hidden rounded-full px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg min-h-[40px] md:min-h-[48px] flex items-center justify-center ${
                    getColorClasses(rating.color, activeFilters.rating === rating.value)
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center gap-1 sm:gap-2 md:gap-3">
                    <span className="text-sm sm:text-base md:text-lg">{rating.icon}</span>
                    <span className="text-center leading-tight">{rating.label}</span>
                  </span>
                </button>
              ))}
            </div>
        </div>

          {/* Temporadas - Responsive */}
          <div className="space-y-3 sm:space-y-4 filter-category">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Temporada</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 sm:gap-3 md:gap-4">
              {seasons.map((season, index) => (
                <button
                  key={season.value}
                  onClick={() => handleFilterChange('season', season.value)}
                  className={`group relative overflow-hidden rounded-full px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg min-h-[40px] md:min-h-[48px] flex items-center justify-center ${
                    getColorClasses(season.color, activeFilters.season === season.value)
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center gap-1 sm:gap-2 md:gap-3">
                    <span className="text-sm sm:text-base md:text-lg">{season.icon}</span>
                    <span className="text-center leading-tight">{season.label}</span>
                  </span>
                </button>
              ))}
            </div>
        </div>

          {/* Años con búsqueda - Responsive */}
          <div className="space-y-3 sm:space-y-4 filter-category">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Año de Emisión</h3>
              </div>
              <input
                type="text"
                placeholder="Buscar año..."
                value={searchQueries.year}
                onChange={(e) => setSearchQueries(prev => ({ ...prev, year: e.target.value }))}
                className="w-full sm:w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:flex xl:flex-wrap gap-2 sm:gap-3 md:gap-4 max-h-40 sm:max-h-36 md:max-h-40 overflow-y-auto filter-scroll">
              {filteredYears.slice(0, 20).map((year, index) => (
                <button
                  key={year.value}
                  onClick={() => handleFilterChange('year', year.value)}
                  className={`group relative overflow-hidden rounded-full px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg min-h-[32px] sm:min-h-[36px] md:min-h-[40px] flex items-center justify-center ${
                    getColorClasses(year.color, activeFilters.year === year.value)
                  }`}
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center gap-1 md:gap-2">
                    <span className="text-xs sm:text-sm md:text-base">{year.icon}</span>
                    <span className="leading-tight">{year.label}</span>
                  </span>
                </button>
              ))}
            </div>
        </div>

          {/* Géneros con búsqueda - Responsive */}
          <div className="space-y-3 sm:space-y-4 filter-category">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Géneros</h3>
              </div>
              <input
                type="text"
                placeholder="Buscar género..."
                value={searchQueries.genre}
                onChange={(e) => setSearchQueries(prev => ({ ...prev, genre: e.target.value }))}
                className="w-full sm:w-40 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap gap-2 sm:gap-3 md:gap-4">
              {filteredGenres.map((genre, index) => (
                <button
                  key={genre.value}
                  onClick={() => handleFilterChange('genre', genre.value)}
                  className={`group relative overflow-hidden rounded-full px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg min-h-[40px] md:min-h-[48px] flex items-center justify-center ${
                    getColorClasses(genre.color, activeFilters.genre === genre.value)
                  }`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center gap-1 sm:gap-2 md:gap-3">
                    <span className="text-sm sm:text-base md:text-lg">{genre.icon}</span>
                    <span className="text-center leading-tight">{genre.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FilterBar; 