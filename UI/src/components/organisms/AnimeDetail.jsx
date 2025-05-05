import React from 'react';

const AnimeDetail = ({ anime, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
        >
          <svg
            className="h-6 w-6"
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

        <div className="grid gap-8 md:grid-cols-[300px,1fr]">
          {/* Imagen y badges */}
          <div className="space-y-4">
            <img
              src={anime.images?.jpg?.large_image_url}
              alt={anime.title}
              className="w-full rounded-xl shadow-lg"
            />
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-sm text-white">
                {anime.type}
              </span>
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-sm text-white">
                {anime.episodes} eps
              </span>
              {anime.score && (
                <span className="rounded-full bg-emerald-700 px-3 py-1 text-sm text-white">
                  ★ {anime.score}
                </span>
              )}
            </div>
          </div>

          {/* Información detallada */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                {anime.title}
              </h2>
              {anime.title_japanese && (
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {anime.title_japanese}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Sinopsis
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {anime.synopsis}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Información
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>
                      <span className="font-medium">Estado:</span> {anime.status}
                    </li>
                    <li>
                      <span className="font-medium">Año:</span>{' '}
                      {anime.year || 'N/A'}
                    </li>
                    <li>
                      <span className="font-medium">Estudio:</span>{' '}
                      {anime.studios?.map((s) => s.name).join(', ') || 'N/A'}
                    </li>
                    <li>
                      <span className="font-medium">Duración:</span>{' '}
                      {anime.duration}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Géneros
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres?.map((genre) => (
                      <span
                        key={genre.mal_id}
                        className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {anime.trailer?.youtube_id && (
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Trailer
                  </h3>
                  <div className="aspect-video w-full overflow-hidden rounded-xl">
                    <iframe
                      src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                      title="Trailer"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail; 