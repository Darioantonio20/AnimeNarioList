import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimeListCard from '../molecules/AnimeListCard';
import CreateListModal from '../organisms/CreateListModal';
import { exportToExcel } from '../../utils/excelExport';

const MyAnimeLists = () => {
  const [lists, setLists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedLists = JSON.parse(localStorage.getItem('animeLists') || '[]');
    setLists(storedLists);
  }, []);

  const handleCreateList = (listName) => {
    const newList = {
      id: Date.now(),
      name: listName,
      animes: [],
      createdAt: new Date().toISOString()
    };
    const updatedLists = [...lists, newList];
    setLists(updatedLists);
    localStorage.setItem('animeLists', JSON.stringify(updatedLists));
    setShowCreateModal(false);
  };

  const handleDeleteList = (listId) => {
    const updatedLists = lists.filter(list => list.id !== listId);
    setLists(updatedLists);
    localStorage.setItem('animeLists', JSON.stringify(updatedLists));
  };

  const handleExportList = (list) => {
    const data = list.animes.map((anime, index) => ({
      'Posición': index + 1,
      'Título': anime.title,
      'Tipo': anime.type,
      'Episodios': anime.episodes,
      'Puntuación': anime.score,
      'Estado': anime.status,
      'Año': anime.year,
      'Estudio': anime.studios?.map(s => s.name).join(', '),
      'Géneros': anime.genres?.map(g => g.name).join(', ')
    }));
    exportToExcel(data, `${list.name}_anime_list`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver
          </button>
          <h1 className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-4xl font-bold text-transparent">
            Mis Listas de Anime
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-full bg-emerald-500 px-6 py-2 text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600"
          >
            Crear Nueva Lista
          </button>
        </div>

        {lists.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              No tienes ninguna lista de anime creada
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-full bg-emerald-500 px-6 py-2 text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600"
            >
              Crear Mi Primera Lista
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <AnimeListCard
                key={list.id}
                list={list}
                onDelete={() => handleDeleteList(list.id)}
                onExport={() => handleExportList(list)}
              />
            ))}
          </div>
        )}

        {showCreateModal && (
          <CreateListModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateList}
          />
        )}
      </div>
    </div>
  );
};

export default MyAnimeLists; 