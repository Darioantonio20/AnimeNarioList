import React, { useState, useEffect, useCallback } from 'react';
import AnimeLayout from '../templates/AnimeLayout';
import AnimeDetail from '../organisms/AnimeDetail';

const AnimePage = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [error, setError] = useState(null);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [availableFilters, setAvailableFilters] = useState([]);

  // Función debounce para la búsqueda
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const fetchAnimes = async () => {
    try {
      setLoading(true);
      setError(null);
      const type = activeFilter === 'all' ? '' : `&type=${activeFilter}`;
      const query = searchQuery ? `&q=${searchQuery}` : '';
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?sfw&limit=20${type}${query}`
      );
      
      if (!response.ok) {
        throw new Error('Error al cargar los animes');
      }
      
      const data = await response.json();
      setAnimes(data.data);
      
      // Actualizar filtros disponibles basados en los resultados
      const types = [...new Set(data.data.map(anime => anime.type))];
      setAvailableFilters(types);
    } catch (error) {
      console.error('Error fetching animes:', error);
      setError('No se pudieron cargar los animes. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const searchAnimes = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const type = activeFilter === 'all' ? '' : `&type=${activeFilter}`;
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${query}&sfw&limit=20${type}`
      );
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      
      const data = await response.json();
      setAnimes(data.data);
      
      // Actualizar filtros disponibles basados en los resultados de búsqueda
      const types = [...new Set(data.data.map(anime => anime.type))];
      setAvailableFilters(types);
    } catch (error) {
      console.error('Error searching animes:', error);
      setError('Error en la búsqueda. Por favor, espera un momento antes de intentar de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Implementar debounce en la búsqueda
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length >= 3) {
        searchAnimes(query);
      } else if (query.length === 0) {
        fetchAnimes();
      }
    }, 500),
    [activeFilter]
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (searchQuery) {
      searchAnimes(searchQuery);
    } else {
      fetchAnimes();
    }
  };

  const handleViewDetails = (anime) => {
    setSelectedAnime(anime);
  };

  const handleCloseDetails = () => {
    setSelectedAnime(null);
  };

  useEffect(() => {
    fetchAnimes();
  }, [activeFilter]);

  return (
    <>
      <AnimeLayout
        animes={animes}
        loading={loading}
        onSearch={handleSearch}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        error={error}
        availableFilters={availableFilters}
        onViewDetails={handleViewDetails}
      />
      {selectedAnime && (
        <AnimeDetail
          anime={selectedAnime}
          onClose={handleCloseDetails}
        />
      )}
    </>
  );
};

export default AnimePage; 