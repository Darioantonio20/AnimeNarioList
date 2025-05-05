import React, { useState } from 'react';
import SaveToListModal from '../organisms/SaveToListModal';

const AnimeCard = ({ anime, onViewDetails }) => {
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    setShowSaveModal(true);
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:bg-gray-800">
        <div className="aspect-[2/3] w-full overflow-hidden">
          <img 
            src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || 'https://via.placeholder.com/300x450'} 
            alt={anime.title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <h3 className="mb-2 text-xl font-bold text-white line-clamp-2">
            {anime.title}
          </h3>
          
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {anime.type || 'TV'}
            </span>
            <span className="rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {anime.episodes || '?'} eps
            </span>
            {anime.score && (
              <span className="rounded-full bg-emerald-700/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                ★ {anime.score}
              </span>
            )}
          </div>

          {anime.synopsis && (
            <p className="mb-3 text-sm text-gray-200 line-clamp-3">
              {anime.synopsis}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              {anime.genres?.slice(0, 2).map((genre) => (
                <span
                  key={genre.mal_id}
                  className="rounded-full bg-emerald-400/20 px-2 py-1 text-xs text-emerald-100 backdrop-blur-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleSaveClick}
                className="rounded-full bg-emerald-500 p-2 text-white transition-colors hover:bg-emerald-600"
                title="Guardar en lista"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
              <button 
                onClick={() => onViewDetails(anime)}
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
              >
                Ver más
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSaveModal && (
        <SaveToListModal
          anime={anime}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </>
  );
};

export default AnimeCard; 