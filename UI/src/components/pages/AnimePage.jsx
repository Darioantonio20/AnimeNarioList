import React, { useState, useEffect } from 'react';
import AnimeHeader from '../organisms/AnimeHeader';
import SearchBar from '../molecules/SearchBar';
import FilterBar from '../molecules/FilterBar';
import AnimeGrid from '../organisms/AnimeGrid';
import AnimeDetail from '../organisms/AnimeDetail';

const AnimePage = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    rating: '',
    year: '',
    season: '',
    genre: '',
    sfw: 'true'
  });

  const fetchAnimes = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir la URL con los parámetros
      const queryParams = new URLSearchParams({
        page: params.page || currentPage,
        limit: 20,
        ...params
      }).toString();

      const response = await fetch(`https://api.jikan.moe/v4/anime?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los animes');
      }

      const data = await response.json();
      setAnimes(data.data);
      setHasNextPage(data.pagination.has_next_page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchAnimes({ q: searchQuery, page: 1 });
        setCurrentPage(1);
      } else {
        fetchAnimes({ page: 1 });
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    // Aplicar filtros solo si hay al menos uno activo
    const activeFilters = Object.entries(filters).filter(([_, value]) => value !== '');
    if (activeFilters.length > 0) {
      const filterParams = activeFilters.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
      fetchAnimes({ ...filterParams, page: 1 });
      setCurrentPage(1);
    }
  }, [filters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (anime) => {
    setSelectedAnime(anime);
  };

  const handleCloseDetails = () => {
    setSelectedAnime(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const activeFilters = Object.entries(filters).filter(([_, value]) => value !== '');
    const filterParams = activeFilters.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
    
    if (searchQuery) {
      fetchAnimes({ ...filterParams, q: searchQuery, page: newPage });
    } else {
      fetchAnimes({ ...filterParams, page: newPage });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <AnimeHeader />
        <div className="mb-6 sm:mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        <FilterBar onFilterChange={handleFilterChange} />

        {error && (
          <div className="mb-6 sm:mb-8 rounded-lg bg-red-100 p-3 sm:p-4 text-red-700 dark:bg-red-900 dark:text-red-100 text-sm sm:text-base">
            {error}
          </div>
        )}

        <AnimeGrid 
          animes={animes}
          loading={loading}
          onViewDetails={handleViewDetails}
        />

        {!loading && animes.length > 0 && (
          /* Paginación Responsive */
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-full sm:w-auto rounded-lg bg-white px-4 py-2 text-sm sm:text-base text-gray-700 shadow-md transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 min-h-[44px] flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
            
            <span className="flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm sm:text-base text-white shadow-md font-medium min-h-[44px]">
              Página {currentPage}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className="w-full sm:w-auto rounded-lg bg-white px-4 py-2 text-sm sm:text-base text-gray-700 shadow-md transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 min-h-[44px] flex items-center justify-center"
            >
              Siguiente
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {selectedAnime && (
          <AnimeDetail
            anime={selectedAnime}
            onClose={handleCloseDetails}
          />
        )}
      </div>
    </div>
  );
};

export default AnimePage; 