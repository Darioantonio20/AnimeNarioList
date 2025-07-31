import React, { useState, useEffect } from 'react';
import SaveToListModal from '../organisms/SaveToListModal';

const AnimeCard = ({ anime, onViewDetails, index = 0 }) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Animación de entrada escalonada
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    setShowSaveModal(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = () => {
    onViewDetails(anime);
  };

  return (
    <>
      <div 
        className={`group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 hover:rotate-1 dark:bg-gray-800 cursor-pointer transform-gpu ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{
          transitionDelay: `${index * 50}ms`,
        }}
        onClick={handleCardClick}
      >
        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-20" />
        
        {/* Indicador de clickeable - Responsive */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
          <div className="bg-emerald-500/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
        
        {/* Contenedor de imagen con mejor manejo de errores */}
        <div className="aspect-[2/3] w-full overflow-hidden relative">
          {!imageError ? (
            <img 
              src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || 'https://via.placeholder.com/300x450'} 
              alt={anime.title} 
              className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-[0.85]"
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <div className="text-center text-white p-2 sm:p-3 md:p-4 lg:p-5">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-1 sm:mb-2 md:mb-3">🎬</div>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium line-clamp-2 leading-tight">{anime.title}</p>
              </div>
            </div>
          )}
          
          {/* Overlay gradiente mejorado */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 transition-all duration-500 ease-out group-hover:opacity-90" />
          
          {/* Indicador de puntuación flotante - Responsive Completo */}
          {anime.score && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 lg:top-5 lg:right-5 transform transition-all duration-300 group-hover:scale-110 z-20">
              <div className="bg-emerald-500/90 backdrop-blur-sm rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold">{anime.score}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Contenido superpuesto mejorado - Responsive Completo */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 sm:p-3 md:p-4 transform transition-all duration-500 ease-out opacity-0 group-hover:opacity-100">
          <h3 className="mb-1.5 sm:mb-2 md:mb-3 text-sm sm:text-base md:text-lg font-bold text-white line-clamp-2 leading-tight">
            {anime.title}
          </h3>
          
          {/* Tags informativos con animaciones - Responsive Completo */}
          <div className="mb-1.5 sm:mb-2 md:mb-3 flex flex-wrap gap-1 sm:gap-1.5">
            <span className="rounded-full bg-emerald-500/90 px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 text-[10px] sm:text-xs font-medium text-white backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:bg-emerald-400/90">
              {anime.type || 'TV'}
            </span>
            <span className="rounded-full bg-blue-500/90 px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 text-[10px] sm:text-xs font-medium text-white backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:bg-blue-400/90">
              {anime.episodes || '?'} eps
            </span>
            {anime.year && (
              <span className="rounded-full bg-purple-500/90 px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 text-[10px] sm:text-xs font-medium text-white backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:bg-purple-400/90">
                {anime.year}
              </span>
            )}
          </div>

          {/* Sinopsis con mejor legibilidad - Responsive Completo */}
          {anime.synopsis && (
            <p className="mb-1.5 sm:mb-2 md:mb-3 text-[10px] sm:text-xs md:text-sm text-gray-100 line-clamp-2 sm:line-clamp-2 md:line-clamp-3 leading-relaxed">
              {anime.synopsis.length > 100 ? `${anime.synopsis.substring(0, 100)}...` : anime.synopsis}
            </p>
          )}

          {/* Géneros con animación de entrada - Responsive Completo */}
          <div className="mb-2 sm:mb-3 md:mb-4 flex flex-wrap gap-1 sm:gap-1.5">
            {/* Mobile: 2 géneros, Tablet: 3 géneros, Desktop: 4 géneros */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5 sm:hidden">
              {anime.genres?.slice(0, 2).map((genre, idx) => (
                <span
                  key={genre.mal_id}
                  className="rounded-full bg-black/40 backdrop-blur-sm px-1.5 py-0.5 text-[10px] text-white border border-white/20 transform transition-all duration-300 hover:scale-105 hover:bg-black/60"
                  style={{
                    transitionDelay: `${idx * 100}ms`,
                  }}
                >
                  {genre.name}
                </span>
              ))}
              {anime.genres?.length > 2 && (
                <span className="rounded-full bg-black/40 backdrop-blur-sm px-1.5 py-0.5 text-[10px] text-white border border-white/20">
                  +{anime.genres.length - 2}
                </span>
              )}
            </div>
            
            <div className="hidden sm:flex md:hidden flex-wrap gap-1.5">
              {anime.genres?.slice(0, 3).map((genre, idx) => (
                <span
                  key={genre.mal_id}
                  className="rounded-full bg-black/40 backdrop-blur-sm px-2 py-0.5 text-xs text-white border border-white/20 transform transition-all duration-300 hover:scale-105 hover:bg-black/60"
                  style={{
                    transitionDelay: `${idx * 100}ms`,
                  }}
                >
                  {genre.name}
                </span>
              ))}
              {anime.genres?.length > 3 && (
                <span className="rounded-full bg-black/40 backdrop-blur-sm px-2 py-0.5 text-xs text-white border border-white/20">
                  +{anime.genres.length - 3}
                </span>
              )}
            </div>
            
            <div className="hidden md:flex flex-wrap gap-1.5">
              {anime.genres?.slice(0, 4).map((genre, idx) => (
                <span
                  key={genre.mal_id}
                  className="rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-sm text-white border border-white/20 transform transition-all duration-300 hover:scale-105 hover:bg-black/60"
                  style={{
                    transitionDelay: `${idx * 100}ms`,
                  }}
                >
                  {genre.name}
                </span>
              ))}
              {anime.genres?.length > 4 && (
                <span className="rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-sm text-white border border-white/20">
                  +{anime.genres.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Botones de acción mejorados - Responsive Completo */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex gap-1.5 sm:gap-2">
              <button 
                onClick={handleSaveClick}
                className="group/btn relative overflow-hidden rounded-full bg-black/40 backdrop-blur-sm p-1.5 sm:p-2 text-white transition-all duration-300 hover:bg-black/60 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-95 min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] md:min-h-[40px] md:min-w-[40px]"
                title="Guardar en lista"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                <svg
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 relative z-10 transition-transform duration-300 group-hover/btn:rotate-12"
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
                onClick={(e) => {
                  e.stopPropagation(); // Prevenir que se active el click de la card
                  onViewDetails(anime);
                }}
                className="group/btn relative overflow-hidden rounded-full bg-black/40 backdrop-blur-sm px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 text-xs sm:text-sm font-bold text-white transition-all duration-300 hover:bg-black/60 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-95 border border-white/20 min-h-[32px] sm:min-h-[36px] md:min-h-[40px]"
              >
                {/* Efecto de brillo animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out" />
                
                {/* Pulso de fondo */}
                <div className="absolute inset-0 rounded-full bg-emerald-400/20 opacity-0 group-hover/btn:opacity-20 group-hover/btn:animate-ping" />
                
                <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-all duration-300 group-hover/btn:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>                  
                  <span className="hidden sm:inline md:hidden">Detalles</span>
                  <span className="sm:hidden">Ver</span>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
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