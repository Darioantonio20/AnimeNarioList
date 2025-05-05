import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AnimeCard from '../atoms/AnimeCard';

const AnimeListDetail = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedLists = JSON.parse(localStorage.getItem('animeLists') || '[]');
    const currentList = storedLists.find(l => l.id === parseInt(listId));
    setList(currentList);
    setLoading(false);
  }, [listId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Lista no encontrada
            </h2>
            <button
              onClick={() => navigate('/my-lists')}
              className="rounded-full bg-emerald-500 px-6 py-2 text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600"
            >
              Volver a Mis Listas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-4xl font-bold text-transparent">
              {list.name}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Creada el {new Date(list.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => navigate('/my-lists')}
            className="rounded-full bg-emerald-500 px-6 py-2 text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600"
          >
            Volver a Mis Listas
          </button>
        </div>

        {list.animes.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Esta lista está vacía
            </p>
            <button
              onClick={() => navigate('/')}
              className="rounded-full bg-emerald-500 px-6 py-2 text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600"
            >
              Explorar Animes
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {list.animes.map((anime) => (
              <AnimeCard
                key={anime.mal_id}
                anime={anime}
                onViewDetails={(anime) => {
                  // Implementar vista detallada si es necesario
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeListDetail; 