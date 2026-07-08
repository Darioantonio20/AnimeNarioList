import React from 'react';
import { useNavigate } from 'react-router-dom';

const AnimeListCard = ({ list, onDelete, onExportExcel, onExportTxt, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <div className="group relative overflow-hidden rounded-2xl glass-panel p-5 sm:p-6 shadow-lg transition-all duration-500 ease-out hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] transform-style-3d hover:-translate-y-2 hover:rotate-x-2 hover:rotate-y-[-2deg] cursor-pointer transform-gpu border border-white/20 dark:border-gray-700/50"
         style={{
           animationDelay: `${index * 100}ms`,
         }}
    >
      <div className="mb-4 sm:mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between relative z-10">
        <h3 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white line-clamp-2 tracking-tight">
          {list.name}
        </h3>
        <span className="rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm w-fit">
          {list.animes.length} anime{list.animes.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="mb-4 relative z-10">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Creada el {new Date(list.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 relative z-10">
        {list.animes.slice(0, 3).map((anime) => (
          <div
            key={anime.mal_id}
            className="flex items-center gap-1.5 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md px-2 py-1 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-all hover:bg-white dark:hover:bg-gray-700"
          >
            <img
              src={anime.images?.jpg?.small_image_url}
              alt={anime.title}
              className="h-5 w-5 rounded-full object-cover shadow-sm"
            />
            <span className="truncate max-w-[100px]">{anime.title}</span>
          </div>
        ))}
        {list.animes.length > 3 && (
          <span className="flex items-center rounded-full bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50">
            +{list.animes.length - 3} más
          </span>
        )}
      </div>

      {/* Efecto de brillo diagonal en hover */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-transparent via-white/40 dark:via-white/5 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between relative z-10 pt-4 border-t border-gray-100 dark:border-gray-800/50">
        <button
          onClick={() => navigate(`/lists/${list.id}`)}
          className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95 flex items-center justify-center gap-2"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
          <span className="relative z-10 flex items-center gap-2">
            <span>Ver Colección</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
        
        <div className="flex gap-2 justify-center sm:justify-end">
          {/* Exportar a Excel */}
          <button
            onClick={onExportExcel}
            className="group/btn relative overflow-hidden rounded-full bg-gray-100 p-2 sm:p-3 text-gray-600 transition-all duration-300 hover:bg-emerald-100 hover:text-emerald-600 hover:scale-110 hover:shadow-lg dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-emerald-800 dark:hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="Exportar a Excel (.xlsx)"
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

          {/* Exportar a TXT */}
          <button
            onClick={onExportTxt}
            className="group/btn relative overflow-hidden rounded-full bg-gray-100 p-2 sm:p-3 text-gray-600 transition-all duration-300 hover:bg-blue-100 hover:text-blue-600 hover:scale-110 hover:shadow-lg dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-800 dark:hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="Exportar a Texto (.txt)"
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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