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
        <div className="mb-6 sm:mb-8 rounded-2xl glass-panel p-4 sm:p-5 shadow-lg relative z-10 animate-fade-in">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            
            {/* Título y Botón Volver */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-emerald-50 dark:bg-gray-800 dark:hover:bg-emerald-900/30 transition-all duration-300 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-emerald-200 dark:hover:ring-emerald-800 shrink-0"
                title="Volver"
              >
                <svg className="h-5 w-5 text-gray-500 group-hover:text-emerald-600 dark:text-gray-400 dark:group-hover:text-emerald-400 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h1 className="bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-2xl sm:text-3xl lg:text-4xl font-black text-transparent tracking-tight">
                Mis Listas
              </h1>
            </div>

            {/* Botones de Acción - Mobile Optimized */}
            <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
              
              {/* Botón Importar */}
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center justify-center gap-2 rounded-full bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-700 px-5 py-2.5 text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 ring-1 ring-gray-200/50 dark:ring-gray-700/50 shadow-sm transition-all hover:shadow-md hover:scale-105 active:scale-95 flex-1 sm:flex-none"
              >
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Importar</span>
              </button>

              {/* Botón Crear */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 px-6 py-2.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-500/50 transition-all hover:scale-105 hover:shadow-emerald-500/50 active:scale-95 flex-1 sm:flex-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Nueva Lista</span>
                <span className="sm:hidden">Crear</span>
              </button>
            </div>
          </div>
        </div>

        {lists.length === 0 ? (
          <div className="flex min-h-[300px] sm:min-h-[400px] flex-col items-center justify-center text-center px-4 animate-fade-in">
            <div className="mb-6 sm:mb-8 relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
              <svg className="w-20 h-20 sm:w-28 sm:h-28 text-gray-300 dark:text-gray-600 mx-auto mb-6 relative z-10 animate-float drop-shadow-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-gray-700 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-2">
                Tu biblioteca está vacía
              </h2>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto">
                Crea tu primera lista personalizada o importa tu colección desde un archivo .txt o .xlsx
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
              <button
                onClick={() => setShowImportModal(true)}
                className="group relative overflow-hidden rounded-full bg-white dark:bg-gray-800 px-8 py-3.5 text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-700 shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gray-50 dark:bg-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg className="w-5 h-5 text-emerald-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="relative z-10">Importar Lista</span>
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 px-8 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-emerald-500/30 ring-2 ring-emerald-500/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="relative z-10">Crear Nueva Lista</span>
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