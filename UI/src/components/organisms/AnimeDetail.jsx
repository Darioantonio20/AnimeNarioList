import React, { useState, useEffect } from 'react';

const AnimeDetail = ({ anime, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Esperar a que termine la animación
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'bg-black/80 backdrop-blur-md' : 'bg-black/0 backdrop-blur-none'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`relative mx-4 max-h-[95vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl transform transition-all duration-500 ease-out dark:bg-gray-900/90 dark:border-gray-700/30 ${
        isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'
      }`}>
        {/* Header con gradiente y botón de cerrar mejorado */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-500/20 via-emerald-400/10 to-transparent" />
        
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 z-20 group rounded-full bg-white/80 backdrop-blur-sm p-3 text-gray-600 transition-all duration-300 hover:bg-red-500 hover:text-white hover:scale-110 hover:rotate-90 dark:bg-gray-800/80 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          title="Cerrar"
        >
          <svg
            className="h-5 w-5 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Contenido scrolleable */}
        <div className="max-h-[95vh] overflow-y-auto custom-scrollbar"
             style={{
               scrollbarWidth: 'thin',
               scrollbarColor: '#10b981 transparent'
             }}
        >

          <div className="p-8 pt-12">
            <div className="grid gap-8 lg:grid-cols-[350px,1fr]">
              {/* Imagen y badges mejorados */}
              <div className="space-y-6">
                <div className="group relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={anime.images?.jpg?.large_image_url}
                    alt={anime.title}
                    className={`w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 to-emerald-600 animate-pulse flex items-center justify-center">
                      <div className="text-white text-6xl">🎬</div>
                    </div>
                  )}
                  
                  {/* Overlay con score grande */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {anime.score && (
                    <div className="absolute bottom-4 right-4 group-hover:scale-110 transition-transform duration-300">
                      <div className="bg-emerald-500/90 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white font-bold text-lg">{anime.score}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags informativos mejorados */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <span className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <span className="relative">{anime.type || 'TV'}</span>
                    </span>
                    <span className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <span className="relative">{anime.episodes || '?'} episodios</span>
                    </span>
                  </div>
                  
                  {/* Estado y año */}
                  <div className="flex flex-wrap gap-3">
                    {anime.status && (
                      <span className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <span className="relative">{anime.status}</span>
                      </span>
                    )}
                    {anime.year && (
                      <span className="group relative overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <span className="relative">{anime.year}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Información adicional en cards */}
                <div className="space-y-4">
                  {anime.studios && anime.studios.length > 0 && (
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4z" clipRule="evenodd" />
                        </svg>
                        Estudio
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">{anime.studios.map(s => s.name).join(', ')}</p>
                    </div>
                  )}
                  
                  {anime.duration && (
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Duración
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">{anime.duration}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Información detallada mejorada */}
              <div className="space-y-8">
                {/* Títulos con animación */}
                <div className="space-y-4">
                  <div className="transform transition-all duration-500 hover:scale-[1.02]">
                    <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent leading-tight">
                      {anime.title}
                    </h2>
                    {anime.title_japanese && (
                      <p className="text-xl text-gray-600 dark:text-gray-400 mt-2 font-medium">
                        {anime.title_japanese}
                      </p>
                    )}
                    {anime.title_english && anime.title_english !== anime.title && (
                      <p className="text-lg text-gray-500 dark:text-gray-500 mt-1">
                        {anime.title_english}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sinopsis mejorada */}
                {anime.synopsis && (
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      Sinopsis
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {anime.synopsis}
                    </p>
                  </div>
                )}

                {/* Géneros con efectos */}
                {anime.genres && anime.genres.length > 0 && (
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Géneros
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {anime.genres.map((genre, idx) => (
                        <span
                          key={genre.mal_id}
                          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 px-4 py-2 text-sm font-medium text-emerald-800 dark:text-emerald-200 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default"
                          style={{
                            animationDelay: `${idx * 100}ms`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-emerald-300 dark:from-emerald-700 dark:to-emerald-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <span className="relative">{genre.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trailer mejorado */}
                {anime.trailer?.youtube_id && (
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Trailer
                    </h3>
                    <div className="aspect-video w-full overflow-hidden rounded-xl shadow-lg group">
                      <iframe
                        src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                        title="Trailer"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                )}

                {/* Información adicional en grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Rankings y popularity */}
                  {(anime.rank || anime.popularity) && (
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        Rankings
                      </h4>
                      <div className="space-y-2">
                        {anime.rank && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Ranking:</span> #{anime.rank}
                          </p>
                        )}
                        {anime.popularity && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Popularidad:</span> #{anime.popularity}
                          </p>
                        )}
                        {anime.members && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Miembros:</span> {anime.members.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Fechas */}
                  {(anime.aired?.from || anime.aired?.to) && (
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Emisión
                      </h4>
                      <div className="space-y-2">
                        {anime.aired?.from && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Inicio:</span> {new Date(anime.aired.from).toLocaleDateString()}
                          </p>
                        )}
                        {anime.aired?.to && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Final:</span> {new Date(anime.aired.to).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail; 