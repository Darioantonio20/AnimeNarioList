import React from 'react';
import { useNavigate } from 'react-router-dom';

const AnimeListCard = ({ list, onDelete, onExport, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white p-4 sm:p-6 shadow-lg transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 hover:scale-105 dark:bg-gray-800 cursor-pointer transform-gpu"
         style={{
           animationDelay: `${index * 100}ms`,
         }}
    >
      <div className="mb-3 sm:mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
          {list.name}
        </h3>
        <span className="rounded-full bg-emerald-100 px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 w-fit">
          {list.animes.length} anime{list.animes.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Creada el {new Date(list.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex flex-wrap gap-1 sm:gap-2">
        {list.animes.slice(0, 2).map((anime) => (
          <div
            key={anime.mal_id}
            className="flex items-center gap-1 sm:gap-2 rounded-full bg-gray-100 px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300 max-w-[140px] sm:max-w-none"
          >
            <img
              src={anime.images?.jpg?.small_image_url}
              alt={anime.title}
              className="h-4 w-4 sm:h-6 sm:w-6 rounded-full object-cover flex-shrink-0"
            />
            <span className="truncate text-xs sm:text-sm">{anime.title}</span>
          </div>
        ))}
        {list.animes.length > 2 && (
          <span className="rounded-full bg-gray-100 px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            +{list.animes.length - 2} más
          </span>
        )}
      </div>

      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

      <div className="mt-4 sm:mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between relative z-10">
        <button
          onClick={() => navigate(`/lists/${list.id}`)}
          className="group/btn relative overflow-hidden rounded-full bg-emerald-500 px-4 py-2 sm:px-6 sm:py-2 text-xs sm:text-sm font-medium text-white transition-all duration-300 hover:bg-emerald-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 active:scale-95 min-h-[40px] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
          <span className="relative z-10 flex items-center gap-1 sm:gap-2">
            <span className="hidden sm:inline">Ver Lista</span>
            <span className="sm:hidden">Ver</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
        
        <div className="flex gap-2 justify-center sm:justify-end">
          <button
            onClick={onExport}
            className="group/btn relative overflow-hidden rounded-full bg-gray-100 p-2 sm:p-3 text-gray-600 transition-all duration-300 hover:bg-emerald-100 hover:text-emerald-600 hover:scale-110 hover:shadow-lg dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-emerald-800 dark:hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="Exportar a Excel"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover/btn:rotate-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="group/btn relative overflow-hidden rounded-full bg-red-100 p-2 sm:p-3 text-red-600 transition-all duration-300 hover:bg-red-200 hover:scale-110 hover:shadow-lg dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="Eliminar lista"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover/btn:rotate-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimeListCard; 