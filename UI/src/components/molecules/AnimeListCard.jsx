import React from 'react';
import { useNavigate } from 'react-router-dom';

const AnimeListCard = ({ list, onDelete, onExport }) => {
  const navigate = useNavigate();

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {list.name}
        </h3>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
          {list.animes.length} animes
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Creada el {new Date(list.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {list.animes.slice(0, 3).map((anime) => (
          <div
            key={anime.mal_id}
            className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          >
            <img
              src={anime.images?.jpg?.small_image_url}
              alt={anime.title}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="truncate">{anime.title}</span>
          </div>
        ))}
        {list.animes.length > 3 && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            +{list.animes.length - 3} más
          </span>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => navigate(`/lists/${list.id}`)}
          className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-600"
        >
          Ver Lista
        </button>
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="rounded-full bg-gray-100 p-2 text-gray-600 transition-all hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            title="Exportar a Excel"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="rounded-full bg-red-100 p-2 text-red-600 transition-all hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
            title="Eliminar lista"
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