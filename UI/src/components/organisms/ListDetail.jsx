import React, { useState, useRef, useEffect } from 'react';
import Button from '../atoms/Button';
import Image from '../atoms/Image';
import Badge from '../atoms/Badge';
import { useLists } from '../../contexts/ListContext';
import { exportToExcel } from '../../services/exportService';

const ListDetail = ({ 
  listId, 
  onBack 
}) => {
  const { loadList, currentList, updateList, removeAnimeFromList, updateAnimePositions } = useLists();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [draggedAnime, setDraggedAnime] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  const [isExporting, setIsExporting] = useState(false);
  
  // Ref para mantener un seguimiento de las posiciones originales durante el arrastre
  const originalPositions = useRef([]);
  
  // Cargar los detalles de la lista solo una vez
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (!listId) return;
      
      try {
        const list = loadList(listId);
        
        if (isMounted) {
          if (list) {
            console.log("Lista cargada:", list);
          } else {
            console.error("No se pudo cargar la lista con ID:", listId);
          }
        }
      } catch (error) {
        console.error("Error al cargar la lista:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    setLoading(true);
    loadData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [listId]); // Eliminamos loadList para evitar re-renders
  
  // Inicializar el nombre editable cuando cambia la lista
  useEffect(() => {
    if (currentList) {
      setEditName(currentList.name);
    }
  }, [currentList]);
  
  // Función de exportación a Excel  
  const handleExportToExcel = () => {
    setIsExporting(true);
    try {
      if (!currentList || !currentList.animes || currentList.animes.length === 0) {
        throw new Error('No hay datos válidos para exportar');
      }
      
      exportToExcel(currentList);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert(`Hubo un error al exportar a Excel: ${error.message || 'Inténtalo de nuevo'}`);
    } finally {
      setIsExporting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }
  
  if (!currentList) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-xl p-8">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Lista no encontrada</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
          No pudimos encontrar la lista que estás buscando. Por favor, regresa a tus listas.
        </p>
        <Button
          variant="primary"
          onClick={onBack}
        >
          Volver a mis listas
        </Button>
      </div>
    );
  }
  
  const handleSaveNameEdit = () => {
    if (editName.trim()) {
      updateList({
        ...currentList,
        name: editName.trim()
      });
      setIsEditing(false);
    }
  };
  
  const handleRemoveAnime = (animeId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este anime de la lista?')) {
      removeAnimeFromList(currentList.id, animeId);
    }
  };
  
  // Gestión del Drag & Drop
  const handleDragStart = (anime) => {
    setDraggedAnime(anime);
    // Guardar las posiciones originales
    originalPositions.current = currentList.animes.map(a => ({ id: a.id, position: a.position }));
  };
  
  const handleDragEnd = () => {
    // Si hay cambios en las posiciones, guardarlos
    if (draggedAnime) {
      const updatedPositions = currentList.animes.map(a => ({ id: a.id, position: a.position }));
      updateAnimePositions(currentList.id, updatedPositions);
      
      setDraggedAnime(null);
      setDragOverIndex(null);
    }
  };
  
  // Manejar el dragOver solo cuando hay un anime siendo arrastrado
  const handleDragOver = (index) => {
    if (!draggedAnime || dragOverIndex === index) return;
    
    setDragOverIndex(index);
    
    // Reordenar la lista
    const draggedIndex = currentList.animes.findIndex(a => a.id === draggedAnime.id);
    if (draggedIndex !== -1 && draggedIndex !== index) {
      // Crear una copia ordenada de los animes
      const updatedAnimes = [...currentList.animes].sort((a, b) => a.position - b.position);
      
      // Eliminar el anime arrastrado de su posición actual
      const [movedAnime] = updatedAnimes.splice(draggedIndex, 1);
      
      // Insertar el anime en la nueva posición
      updatedAnimes.splice(index, 0, movedAnime);
      
      // Actualizar las posiciones
      updatedAnimes.forEach((anime, i) => {
        anime.position = i;
      });
      
      // Actualizar la lista
      updateList({
        ...currentList,
        animes: updatedAnimes
      });
    }
  };

  // Verificar si hay animes en la lista
  const hasAnimes = currentList.animes && currentList.animes.length > 0;
  
  // Renderizar un anime individual en modo lista
  const renderListItem = (anime, index) => (
    <div 
      key={anime.id}
      className={`relative flex bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200
        ${draggedAnime?.id === anime.id ? 'opacity-50' : ''}
        ${dragOverIndex === index ? 'border-2 border-emerald-500' : ''}
      `}
      onMouseOver={() => draggedAnime && handleDragOver(index)}
    >
      <div 
        className="absolute top-0 left-0 w-full h-6 cursor-move flex items-center justify-center opacity-0 hover:opacity-100 bg-gray-100 dark:bg-gray-700 transition-opacity"
        onMouseDown={() => handleDragStart(anime)}
        onMouseUp={handleDragEnd}
        onTouchStart={() => handleDragStart(anime)}
        onTouchEnd={handleDragEnd}
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
      
      <div className="w-24 h-36 flex-shrink-0">
        <Image 
          src={anime.image} 
          alt={anime.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-grow p-4 flex flex-col">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {anime.title}
          </h3>
          
          <button 
            onClick={() => handleRemoveAnime(anime.id)}
            className="p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors"
            aria-label="Quitar de la lista"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {anime.type && (
            <Badge color="emerald" size="sm">{anime.type}</Badge>
          )}
          {anime.score && (
            <div className="inline-flex items-center px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-md">
              <span className="text-yellow-500 mr-1">⭐</span>
              {anime.score}
            </div>
          )}
        </div>
        
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {anime.episodes && `${anime.episodes} episodios`}
        </div>
        
        <div className="mt-auto text-xs text-gray-500 dark:text-gray-500">
          Añadido: {anime.addedAt ? new Date(anime.addedAt).toLocaleDateString() : 'Desconocido'}
        </div>
      </div>
    </div>
  );
  
  // Renderizar un anime individual en modo grid
  const renderGridItem = (anime, index) => (
    <div 
      key={anime.id}
      className={`relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200
        ${draggedAnime?.id === anime.id ? 'opacity-50' : ''}
        ${dragOverIndex === index ? 'border-2 border-emerald-500' : ''}
      `}
      onMouseOver={() => draggedAnime && handleDragOver(index)}
    >
      <div 
        className="absolute top-0 left-0 w-full h-6 cursor-move flex items-center justify-center opacity-0 hover:opacity-100 bg-gray-100 dark:bg-gray-700 transition-opacity z-10"
        onMouseDown={() => handleDragStart(anime)}
        onMouseUp={handleDragEnd}
        onTouchStart={() => handleDragStart(anime)}
        onTouchEnd={handleDragEnd}
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
      
      <div className="relative aspect-[2/3] w-full">
        <Image 
          src={anime.image} 
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        
        {anime.score && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-sm px-2 py-1 rounded-md backdrop-blur-sm">
            ⭐ {anime.score}
          </div>
        )}
        
        <button 
          onClick={() => handleRemoveAnime(anime.id)}
          className="absolute top-2 left-2 p-1.5 bg-black/60 text-white rounded-full backdrop-blur-sm hover:bg-red-500/90 transition-colors"
          aria-label="Quitar de la lista"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
          {anime.title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1">
          {anime.type && <span>{anime.type}</span>}
          {anime.episodes && <span>• {anime.episodes} eps</span>}
        </div>
      </div>
    </div>
  );
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mr-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        
        {isEditing ? (
          <div className="flex items-center flex-grow">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-grow px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              autoFocus
            />
            <Button
              variant="ghost"
              onClick={() => setIsEditing(false)}
              className="ml-2"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveNameEdit}
              className="ml-2"
            >
              Guardar
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex-grow">
              {currentList.name}
            </h2>
            
            {!currentList.isDefault && (
              <Button
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="ml-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </Button>
            )}
          </>
        )}
      </div>
      
      {currentList.description && (
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {currentList.description}
        </p>
      )}
      
      {/* Botón de exportación */}
      {hasAnimes && (
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant="secondary"
            onClick={handleExportToExcel}
            disabled={isExporting}
            className="flex items-center text-sm"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar a Excel
          </Button>
        </div>
      )}
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {hasAnimes ? (
              `${currentList.animes.length} ${currentList.animes.length === 1 ? 'anime' : 'animes'} en esta lista`
            ) : (
              'No hay animes en esta lista'
            )}
          </h3>
          
          {hasAnimes && (
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                Arrastra y suelta para reordenar
              </div>
              
              <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  aria-label="Ver en cuadrícula"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  aria-label="Ver en lista"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {hasAnimes ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentList.animes
                .sort((a, b) => a.position - b.position)
                .map((anime, index) => renderGridItem(anime, index))}
            </div>
          ) : (
            <div className="space-y-3">
              {currentList.animes
                .sort((a, b) => a.position - b.position)
                .map((anime, index) => renderListItem(anime, index))}
            </div>
          )
        ) : (
          <div className="py-12 flex flex-col items-center justify-center bg-white dark:bg-gray-700 rounded-xl">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
              Esta lista está vacía. Explora animes y agrégalos a esta lista para comenzar a organizarlos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListDetail; 