import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AnimeCard from '../atoms/AnimeCard';
import AnimeDetail from '../organisms/AnimeDetail';

const AnimeListDetail = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [draggedOverIdx, setDraggedOverIdx] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('original'); // original, a-z, z-a
  const [selectedAnime, setSelectedAnime] = useState(null);

  const processedAnimes = React.useMemo(() => {
    if (!list || !list.animes) return [];
    let result = [...list.animes];

    // 1. Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(anime => 
        anime.title.toLowerCase().includes(query) ||
        (anime.title_english && anime.title_english.toLowerCase().includes(query)) ||
        (anime.title_japanese && anime.title_japanese.toLowerCase().includes(query))
      );
    }

    // 2. Ordenar
    if (sortOption === 'a-z') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'z-a') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [list, searchQuery, sortOption]);

  const isReorderEnabled = sortOption === 'original' && searchQuery === '';

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (index) => {
    setDraggedOverIdx(index);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDraggedOverIdx(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) return;

    const reorderedAnimes = [...list.animes];
    const [movedAnime] = reorderedAnimes.splice(draggedIdx, 1);
    reorderedAnimes.splice(targetIndex, 0, movedAnime);

    const updatedList = { ...list, animes: reorderedAnimes };
    setList(updatedList);

    const storedLists = JSON.parse(localStorage.getItem('animeLists') || '[]');
    const updatedLists = storedLists.map(l => l.id === list.id ? updatedList : l);
    localStorage.setItem('animeLists', JSON.stringify(updatedLists));

    setDraggedIdx(null);
    setDraggedOverIdx(null);
  };

  useEffect(() => {
    const storedLists = JSON.parse(localStorage.getItem('animeLists') || '[]');
    const currentList = storedLists.find(l => l.id === parseInt(listId));
    setList(currentList);
    setLoading(false);
  }, [listId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="flex min-h-[300px] sm:min-h-[400px] flex-col items-center justify-center text-center px-4">
            <div className="mb-6 sm:mb-8">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Lista no encontrada
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                La lista que buscas no existe o fue eliminada
              </p>
            </div>
            <button
              onClick={() => navigate('/my-lists')}
              className="rounded-full bg-emerald-500 px-6 py-3 sm:px-8 sm:py-3 text-sm sm:text-base text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:scale-105 min-h-[44px] flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Volver a Mis Listas</span>
              <span className="sm:hidden">Volver</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="sticky top-0 z-40 mb-6 sm:mb-8 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/40 p-4 sm:p-5 shadow-lg shadow-emerald-500/5 animate-fade-in">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/my-lists')}
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-emerald-50 dark:bg-gray-800 dark:hover:bg-emerald-900/30 transition-all duration-300 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-emerald-200 dark:hover:ring-emerald-800 shrink-0"
                title="Volver a Mis Listas"
              >
                <svg className="h-5 w-5 text-gray-500 group-hover:text-emerald-600 dark:text-gray-400 dark:group-hover:text-emerald-400 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex-1">
                <h1 className="bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-2xl sm:text-3xl lg:text-4xl font-black text-transparent break-words tracking-tight">
                  {list.name}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Creada el {new Date(list.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm w-fit">
                {list.animes.length} anime{list.animes.length !== 1 ? 's' : ''} en total
              </span>
            </div>
          </div>
        </div>

        {list.animes.length === 0 ? (
          <div className="flex min-h-[300px] sm:min-h-[400px] flex-col items-center justify-center text-center px-4">
            <div className="mb-6 sm:mb-8">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2">
                Esta lista está vacía
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Explora animes y agrégalos a esta lista
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="rounded-full bg-emerald-500 px-6 py-3 sm:px-8 sm:py-3 text-sm sm:text-base text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:scale-105 min-h-[44px] flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Explorar Animes</span>
              <span className="sm:hidden">Explorar</span>
            </button>
          </div>
        ) : (
          <>
            {/* Controles de Búsqueda y Ordenamiento */}
            <div className="sticky top-[88px] z-30 mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-2xl border border-white/30 dark:border-gray-700/40 shadow-lg shadow-emerald-500/5 animate-fade-in">
              {/* Buscador */}
              <div className="relative w-full md:max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-700 pl-10 pr-10 py-2.5 text-sm text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Buscar anime en esta lista..."
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Ordenamiento e Indicador */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-450 uppercase tracking-wider whitespace-nowrap">Ordenar por:</label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full sm:w-auto rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="original">Orden Original (Arrastrar)</option>
                    <option value="a-z">Alfabético A-Z</option>
                    <option value="z-a">Alfabético Z-A</option>
                  </select>
                </div>
                
                {/* Mensaje informativo sobre Drag & Drop */}
                <div className="text-xs text-gray-450 font-medium sm:text-right shrink-0">
                  {isReorderEnabled ? (
                    <span className="text-emerald-500 font-semibold flex items-center justify-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Arrastre activado
                    </span>
                  ) : (
                    <span className="text-amber-500 font-semibold flex items-center justify-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Arrastre desactivado
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Cuadrícula o Mensaje Vacío */}
            {processedAnimes.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-sm animate-fade-in">
                <span className="text-4xl mb-3">🔍</span>
                <p className="text-lg font-bold text-gray-700 dark:text-gray-300">No se encontraron resultados para tu búsqueda</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Intenta buscar con términos diferentes o borra el filtro.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 animate-fade-in">
                {processedAnimes.map((anime, index) => {
                  const originalIndex = list.animes.findIndex(a => a.mal_id === anime.mal_id);
                  return (
                    <div
                      key={anime.mal_id}
                      draggable={isReorderEnabled}
                      onDragStart={(e) => handleDragStart(e, originalIndex)}
                      onDragOver={handleDragOver}
                      onDragEnter={() => handleDragEnter(originalIndex)}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => handleDrop(e, originalIndex)}
                      className={`relative transition-all duration-300 ${
                        isReorderEnabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                      } ${
                        draggedIdx === originalIndex ? 'opacity-30 scale-95' : ''
                      } ${
                        draggedOverIdx === originalIndex ? 'ring-4 ring-emerald-500 rounded-2xl scale-[1.02] z-10 shadow-lg' : ''
                      }`}
                    >
                      <AnimeCard
                        anime={anime}
                        index={index}
                        onViewDetails={(anime) => setSelectedAnime(anime)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {selectedAnime && (
          <AnimeDetail
            anime={selectedAnime}
            onClose={() => setSelectedAnime(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AnimeListDetail; 