import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimeListCard from '../molecules/AnimeListCard';
import CreateListModal from '../organisms/CreateListModal';
import ImportListModal from '../organisms/ImportListModal';
import { exportToExcel } from '../../utils/excelExport';
import { exportToTxt } from '../../utils/txtExport';

const MyAnimeLists = () => {
  const [lists, setLists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
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

  const handleImportCompleted = (newList) => {
    setLists(prev => [...prev, newList]);
    navigate(`/lists/${newList.id}`);
  };

  const handleDeleteList = (listId) => {
    const updatedLists = lists.filter(list => list.id !== listId);
    setLists(updatedLists);
    localStorage.setItem('animeLists', JSON.stringify(updatedLists));
  };

  const handleExportExcel = (list) => {
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

  const handleExportTxt = (list) => {
    exportToTxt(list.animes, `${list.name}_anime_list`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        
        {/* Header Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            
            {/* Botón Volver - Mobile First */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 w-fit min-h-[44px]"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
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
              <span className="hidden sm:inline">Volver</span>
              <span className="sm:hidden">Atrás</span>
            </button>

            {/* Título Responsive */}
            <h1 className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-xl sm:text-2xl lg:text-4xl font-bold text-transparent text-center sm:text-left order-first sm:order-none">
              <span className="hidden sm:inline">Mis Listas de Anime</span>
              <span className="sm:hidden">Mis Listas</span>
            </h1>

            {/* Botones de Acción - Mobile Optimized */}
            <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-start">
              
              {/* Botón Importar */}
              <button
                onClick={() => setShowImportModal(true)}
                className="rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-4 py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 shadow-md transition-all hover:scale-105 min-h-[44px] flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Importar</span>
              </button>

              {/* Botón Crear */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="rounded-full bg-emerald-500 px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:scale-105 min-h-[44px] flex items-center justify-center"
              >
                <svg className="w-4 h-4 sm:hidden mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Crear Nueva Lista</span>
                <span className="sm:hidden">Nueva Lista</span>
              </button>

            </div>
          </div>
        </div>

        {lists.length === 0 ? (
          <div className="flex min-h-[300px] sm:min-h-[400px] flex-col items-center justify-center text-center px-4">
            <div className="mb-6 sm:mb-8">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2">
                No tienes ninguna lista de anime creada
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 font-normal">
                Crea una lista o importa una desde tus archivos locales (.txt o .xlsx)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-6 py-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 shadow-md transition-all hover:scale-105 min-h-[44px] flex items-center gap-2 justify-center"
              >
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Importar Lista</span>
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="rounded-full bg-emerald-500 px-6 py-3 sm:px-8 sm:py-3 text-sm sm:text-base text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:scale-105 min-h-[44px] flex items-center gap-2 justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Crear Nueva Lista</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list, index) => (
              <AnimeListCard
                key={list.id}
                list={list}
                index={index}
                onDelete={() => handleDeleteList(list.id)}
                onExportExcel={() => handleExportExcel(list)}
                onExportTxt={() => handleExportTxt(list)}
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

        {showImportModal && (
          <ImportListModal
            onClose={() => setShowImportModal(false)}
            onImportCompleted={handleImportCompleted}
          />
        )}
      </div>
    </div>
  );
};

export default MyAnimeLists; 