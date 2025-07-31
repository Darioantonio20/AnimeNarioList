import React from 'react';
import AnimeCard from '../atoms/AnimeCard';

const AnimeGrid = ({ animes, loading, onViewDetails }) => {
    if (loading) {
    return (
      <div className="grid gap-3 sm:gap-4 md:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="aspect-[2/3] rounded-xl bg-gray-200 dark:bg-gray-700 relative overflow-hidden"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Skeleton animado mejorado - Responsive */}
            <div className="absolute inset-0">
              {/* Imagen placeholder */}
              <div className="aspect-[2/3] bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 relative overflow-hidden">
                {/* Efecto shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                {/* Icono placeholder responsive */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-gray-400 dark:text-gray-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Contenido placeholder responsive */}
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="space-y-1 sm:space-y-2">
                  <div className="h-3 sm:h-4 md:h-5 bg-white/20 rounded animate-pulse" />
                  <div className="h-2 sm:h-3 md:h-4 bg-white/15 rounded w-3/4 animate-pulse" />
                  <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3">
                    <div className="h-4 sm:h-5 md:h-6 w-8 sm:w-10 md:w-12 bg-white/10 rounded-full animate-pulse" />
                    <div className="h-4 sm:h-5 md:h-6 w-10 sm:w-12 md:w-16 bg-white/10 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!animes?.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl text-gray-300 dark:text-gray-600">🔍</div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            No se encontraron animes
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Intenta con otra búsqueda o términos diferentes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 md:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {animes.map((anime, index) => (
        <AnimeCard 
          key={anime.mal_id} 
          anime={anime} 
          onViewDetails={onViewDetails}
          index={index}
        />
      ))}
    </div>
  );
};

export default AnimeGrid; 