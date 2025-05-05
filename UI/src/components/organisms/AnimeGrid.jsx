import React from 'react';
import AnimeCard from '../atoms/AnimeCard';

const AnimeGrid = ({ animes, loading, onViewDetails }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="aspect-[2/3] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>
    );
  }

  if (!animes?.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-center text-gray-500 dark:text-gray-400">
          No se encontraron animes. Intenta con otra búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {animes.map((anime) => (
        <AnimeCard 
          key={anime.mal_id} 
          anime={anime} 
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default AnimeGrid; 