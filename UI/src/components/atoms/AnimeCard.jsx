import React, { useState } from 'react';
import SaveToListModal from '../organisms/SaveToListModal';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const AnimeCard = ({ anime, onViewDetails, index = 0 }) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { ref, isVisible, hasRendered, delay, duration } = useScrollReveal();

  const handleSaveClick = (e) => {
    e.stopPropagation();
    setShowSaveModal(true);
  };

  const handleCardClick = () => {
    onViewDetails(anime);
  };

  // Usar imagen mediana para carga rápida en lugar de large
  const imageSrc = anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url || '';

  return (
    <>
      <div 
        ref={ref}
        className="perspective-1000 w-full h-full cursor-pointer transform-gpu will-change-transform"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
          filter: isVisible ? 'blur(0px)' : 'blur(6px)',
          transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${isVisible ? delay : 0}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${isVisible ? delay : 0}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${isVisible ? delay : 0}ms`,
        }}
        onClick={handleCardClick}
      >
        {hasRendered ? (
          <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg transition-shadow duration-500 ease-out hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] transform-style-3d">
          
          {/* Shimmer Effect en Hover */}
          <div className="absolute inset-0 z-30 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
          
          {/* Imagen principal con spinner */}
          <div className="aspect-[2/3] w-full relative overflow-hidden bg-gray-200 dark:bg-gray-700">

            {/* Spinner de carga premium */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="anime-spinner mb-3" />
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wide uppercase animate-pulse">
                  Cargando...
                </span>
              </div>
            )}

            {!imageError ? (
              <img 
                src={imageSrc} 
                alt={anime.title} 
                className={`h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-75 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-emerald-500 to-teal-700 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-4xl mb-2">🎬</span>
                <span className="text-white font-bold text-sm sm:text-base">{anime.title}</span>
              </div>
            )}
            
            {/* Gradiente Inferior Fijo (siempre visible para que el título se lea bien) */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
            
            {/* Gradiente Superior (Hover) para oscurecer el fondo */}
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* Puntuación Top Right */}
            {anime.score && (
              <div className="absolute top-3 right-3 z-20">
                <div className="glass-panel rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-lg transform transition-transform duration-300 hover:scale-110">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white text-xs sm:text-sm font-bold tracking-wide">{anime.score}</span>
                </div>
              </div>
            )}
            
            {/* Adult Badge */}
            {anime.is_adult && (
              <div className="absolute top-3 left-3 z-20">
                <div className="bg-red-500/90 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-lg border border-red-400/50">
                  <span className="text-white text-[10px] sm:text-xs font-black uppercase tracking-wider">18+</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Contenido Inferior Fijo */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end z-20 h-full pointer-events-none">
            
            {/* Título - Siempre visible, pero se mueve ligeramente en hover */}
            <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight line-clamp-2 drop-shadow-lg mb-2">
                {anime.title}
              </h3>
              
              {/* Tags básicos - Siempre visibles */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pointer-events-auto">
                <span className="rounded bg-white/20 backdrop-blur-md px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white border border-white/10 shadow-sm">
                  {anime.type || 'TV'}
                </span>
                {anime.episodes && (
                  <span className="rounded bg-emerald-500/80 backdrop-blur-md px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-sm">
                    {anime.episodes} eps
                  </span>
                )}
                {anime.year && (
                  <span className="rounded bg-white/20 backdrop-blur-md px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white border border-white/10 shadow-sm">
                    {anime.year}
                  </span>
                )}
              </div>
            </div>

            {/* Contenido Extra - Solo visible en Hover */}
            <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-3 transition-all duration-500 ease-out overflow-hidden pointer-events-auto">
              
              {/* Géneros */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {anime.genres?.slice(0, 3).map((genre) => (
                  <span
                    key={genre.mal_id || genre.name}
                    className="rounded-full bg-black/50 backdrop-blur-md px-2 py-0.5 text-[10px] sm:text-xs text-gray-200 border border-white/10"
                  >
                    {genre.name}
                  </span>
                ))}
                {anime.genres?.length > 3 && (
                  <span className="rounded-full bg-black/50 backdrop-blur-md px-2 py-0.5 text-[10px] sm:text-xs text-gray-200 border border-white/10">
                    +{anime.genres.length - 3}
                  </span>
                )}
              </div>

              {/* Botón de Guardar */}
              <button 
                onClick={handleSaveClick}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/50 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Guardar en lista
              </button>
            </div>
          </div>
        </div>
        ) : (
          <div className="aspect-[2/3] w-full rounded-2xl bg-gray-200 dark:bg-gray-800/50 animate-pulse border border-white/10" />
        )}
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

export default React.memo(AnimeCard);