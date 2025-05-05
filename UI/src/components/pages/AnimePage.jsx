import React, { useState, useEffect } from 'react';
import AnimeHeader from '../organisms/AnimeHeader';
import SearchBar from '../molecules/SearchBar';
import FilterBar from '../molecules/FilterBar';
import AnimeCard from '../atoms/AnimeCard';
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
      <div className="container mx-auto px-4 py-8">
        <AnimeHeader />
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        <FilterBar onFilterChange={handleFilterChange} />

        {error && (
          <div className="mb-8 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {animes.map((anime) => (
                <AnimeCard
                  key={anime.mal_id}
                  anime={anime}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Paginación */}
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg bg-white px-4 py-2 text-gray-700 shadow-md transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Anterior
              </button>
              <span className="flex items-center rounded-lg bg-white px-4 py-2 text-gray-700 shadow-md dark:bg-gray-800 dark:text-gray-300">
                Página {currentPage}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="rounded-lg bg-white px-4 py-2 text-gray-700 shadow-md transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Siguiente
              </button>
            </div>
          </>
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