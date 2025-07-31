import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AnimeCard from '../atoms/AnimeCard';

const AnimeListDetail = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedLists = JSON.parse(localStorage.getItem('animeLists') || '[]');
    const currentList = storedLists.find(l => l.id === parseInt(listId));
    setList(currentList);
    setLoading(false);
  }, [listId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="flex min-h-[300px] sm:min-h-[400px] flex-col items-center justify-center text-center px-4">
            <div className="mb-6 sm:mb-8">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Lista no encontrada
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                La lista que buscas no existe o fue eliminada
              </p>
            </div>
            <button
              onClick={() => navigate('/my-lists')}
              className="rounded-full bg-emerald-500 px-6 py-3 sm:px-8 sm:py-3 text-sm sm:text-base text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:scale-105 min-h-[44px] flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Volver a Mis Listas</span>
              <span className="sm:hidden">Volver</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h1 className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-xl sm:text-2xl lg:text-4xl font-bold text-transparent break-words">
                {list.name}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Creada el {new Date(list.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => navigate('/my-lists')}
              className="rounded-full bg-emerald-500 px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:scale-105 min-h-[44px] flex items-center justify-center gap-2 w-fit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Volver a Mis Listas</span>
              <span className="sm:hidden">Volver</span>
            </button>
          </div>
        </div>

        {list.animes.length === 0 ? (
          <div className="flex min-h-[300px] sm:min-h-[400px] flex-col items-center justify-center text-center px-4">
            <div className="mb-6 sm:mb-8">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2">
                Esta lista está vacía
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Explora animes y agrégalos a esta lista
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="rounded-full bg-emerald-500 px-6 py-3 sm:px-8 sm:py-3 text-sm sm:text-base text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:scale-105 min-h-[44px] flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Explorar Animes</span>
              <span className="sm:hidden">Explorar</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {list.animes.map((anime, index) => (
              <AnimeCard
                key={anime.mal_id}
                anime={anime}
                index={index}
                onViewDetails={(anime) => {
                  // Implementar vista detallada si es necesario
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeListDetail; 