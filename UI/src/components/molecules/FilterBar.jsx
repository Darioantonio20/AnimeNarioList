import React, { useState } from 'react';

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

  const types = [
    { value: 'tv', label: 'TV' },
    { value: 'movie', label: 'Película' },
    { value: 'ova', label: 'OVA' },
    { value: 'ona', label: 'ONA' },
    { value: 'special', label: 'Especial' }
  ];

  const statuses = [
    { value: 'airing', label: 'En emisión' },
    { value: 'complete', label: 'Completado' },
    { value: 'upcoming', label: 'Próximamente' }
  ];

  const ratings = [
    { value: 'g', label: 'G - Todos los públicos' },
    { value: 'pg', label: 'PG - Guía parental' },
    { value: 'pg13', label: 'PG-13 - Mayores de 13' },
    { value: 'r17', label: 'R - Mayores de 17' },
    { value: 'r', label: 'R+ - Contenido adulto' }
  ];

  const years = Array.from({ length: 24 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const seasons = [
    { value: 'winter', label: 'Invierno' },
    { value: 'spring', label: 'Primavera' },
    { value: 'summer', label: 'Verano' },
    { value: 'fall', label: 'Otoño' }
  ];

  const genres = [
    { value: 'action', label: 'Acción' },
    { value: 'adventure', label: 'Aventura' },
    { value: 'comedy', label: 'Comedia' },
    { value: 'drama', label: 'Drama' },
    { value: 'fantasy', label: 'Fantasía' },
    { value: 'horror', label: 'Terror' },
    { value: 'mystery', label: 'Misterio' },
    { value: 'romance', label: 'Romance' },
    { value: 'sci-fi', label: 'Ciencia Ficción' },
    { value: 'slice-of-life', label: 'Slice of Life' },
    { value: 'sports', label: 'Deportes' },
    { value: 'supernatural', label: 'Sobrenatural' },
    { value: 'hentai', label: 'Hentai' }
  ];

  const handleFilterChange = (category, value) => {
    const newFilters = {
      ...activeFilters,
      [category]: value
    };
    
    // Si se selecciona Hentai, desactivar SFW
    if (category === 'genre' && value === 'hentai') {
      newFilters.sfw = 'false';
    } else if (category === 'genre' && value !== 'hentai') {
      newFilters.sfw = 'true';
    }
    
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

  return (
    <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filtros</h2>
        <button
          onClick={clearFilters}
          className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 transition-all hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Limpiar Filtros
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo
          </label>
          <select
            value={activeFilters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos los tipos</option>
            {types.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Estado
          </label>
          <select
            value={activeFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos los estados</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Clasificación
          </label>
          <select
            value={activeFilters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas las clasificaciones</option>
            {ratings.map((rating) => (
              <option key={rating.value} value={rating.value}>
                {rating.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Año
          </label>
          <select
            value={activeFilters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos los años</option>
            {years.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Temporada
          </label>
          <select
            value={activeFilters.season}
            onChange={(e) => handleFilterChange('season', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas las temporadas</option>
            {seasons.map((season) => (
              <option key={season.value} value={season.value}>
                {season.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Género
          </label>
          <select
            value={activeFilters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos los géneros</option>
            {genres.map((genre) => (
              <option key={genre.value} value={genre.value}>
                {genre.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar; 