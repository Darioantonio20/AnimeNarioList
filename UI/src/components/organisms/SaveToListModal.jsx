import React, { useState, useEffect } from 'react';

const SaveToListModal = ({ anime, onClose }) => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');

  useEffect(() => {
    const storedLists = JSON.parse(localStorage.getItem('animeLists') || '[]');
    setLists(storedLists);
  }, []);

  const handleSave = () => {
    if (!selectedList) return;

    const updatedLists = lists.map(list => {
      if (list.id === parseInt(selectedList)) {
        // Verificar si el anime ya existe en la lista
        const animeExists = list.animes.some(a => a.mal_id === anime.mal_id);
        if (!animeExists) {
          return {
            ...list,
            animes: [...list.animes, anime]
          };
        }
      }
      return list;
    });

    setLists(updatedLists);
    localStorage.setItem('animeLists', JSON.stringify(updatedLists));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-md mx-4 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/40 dark:border-gray-600/40 p-6 shadow-2xl shadow-emerald-500/10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Guardar en Lista
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm p-2 text-gray-600 transition-all hover:bg-red-500 hover:text-white hover:scale-110 hover:rotate-90 dark:text-gray-300 focus:outline-none"
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
        </div>

        <div className="mb-6">
          <div className="mb-4 flex items-center gap-4">
            <img
              src={anime.images?.jpg?.small_image_url}
              alt={anime.title}
              className="h-16 w-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {anime.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {anime.type} • {anime.episodes} eps
              </p>
            </div>
          </div>

          <label
            htmlFor="listSelect"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Seleccionar Lista
          </label>
          <select
            id="listSelect"
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
            className="w-full rounded-xl border border-white/30 dark:border-gray-600/40 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm px-4 py-2.5 text-gray-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white"
          >
            <option value="">Selecciona una lista</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name} ({list.animes.length} animes)
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
              className="rounded-xl border border-white/30 dark:border-gray-600/40 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm px-5 py-2.5 text-gray-700 font-medium transition-all hover:bg-white/80 dark:text-gray-300 dark:hover:bg-gray-600/80"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!selectedList}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-white font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveToListModal; 