import React, { useState, useEffect, useRef } from 'react';
import AnimeHeader from '../organisms/AnimeHeader';
import SearchBar from '../molecules/SearchBar';
import FilterBar from '../molecules/FilterBar';
import AnimeGrid from '../organisms/AnimeGrid';
import AnimeDetail from '../organisms/AnimeDetail';

// ──────────────────────────────────────────────
// AniList GraphQL — API principal (rápida, estable, tiene hentai)
// ──────────────────────────────────────────────
const ANILIST_URL = 'https://graphql.anilist.co';

const buildAniListQuery = ({ page, limit, search, type, genreTag }) => {
  const vars = { page, perPage: limit };
  const argParts = ['$page:Int', '$perPage:Int'];
  const mediaParts = ['type:ANIME'];

  if (search) {
    vars.search = search;
    argParts.push('$search:String');
    mediaParts.push('search:$search');
  } else {
    mediaParts.push('sort:POPULARITY_DESC');
  }

  if (type) {
    const formatMap = { tv: 'TV', movie: 'MOVIE', ova: 'OVA', ona: 'ONA', special: 'SPECIAL' };
    const f = formatMap[type];
    if (f) {
      vars.format = f;
      argParts.push('$format:MediaFormat');
      mediaParts.push('format:$format');
    }
  }

  if (genreTag) {
    vars.genre = genreTag;
    argParts.push('$genre:String');
    mediaParts.push('genre:$genre');
  }

  const query = `
    query (${argParts.join(',')}) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage currentPage lastPage total }
        media(${mediaParts.join(',')}) {
          id
          title { romaji english native }
          coverImage { large medium }
          bannerImage
          episodes
          status
          averageScore
          description
          seasonYear
          season
          format
          genres
          studios(isMain:true) { nodes { name } }
          isAdult
        }
      }
    }
  `;
  return { query, variables: vars };
};

const mapAniListToCommon = (item) => ({
  mal_id: item.id,
  title: item.title?.english || item.title?.romaji || 'Sin título',
  title_english: item.title?.english || '',
  title_japanese: item.title?.native || '',
  images: {
    jpg: {
      image_url: item.coverImage?.large || item.coverImage?.medium || '',
      small_image_url: item.coverImage?.medium || '',
      large_image_url: item.coverImage?.large || ''
    }
  },
  type: item.format || 'TV',
  episodes: item.episodes || null,
  status: item.status === 'FINISHED' ? 'Finished Airing'
    : item.status === 'RELEASING' ? 'Currently Airing'
    : item.status || '',
  score: item.averageScore ? (item.averageScore / 10).toFixed(1) : null,
  synopsis: item.description?.replace(/<[^>]*>/g, '') || '',
  year: item.seasonYear || null,
  season: item.season?.toLowerCase() || null,
  genres: (item.genres || []).map((g, i) => ({ mal_id: `al-${item.id}-${i}`, name: g })),
  studios: (item.studios?.nodes || []).map(s => ({ name: s.name })),
  is_adult: item.isAdult || false,
  source: 'anilist'
});

const AnimePage = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filters, setFilters] = useState({ type: '', genres: '' });
  const abortRef = useRef(null);

  // Mapeo de IDs de género a nombres para AniList
  const genreIdToName = {
    '1': 'Action', '2': 'Adventure', '4': 'Comedy', '8': 'Drama',
    '10': 'Fantasy', '22': 'Romance', '24': 'Sci-Fi',
    '9': 'Ecchi', '12': 'Hentai'
  };

  const fetchAnimes = async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const genreName = filters.genres ? genreIdToName[filters.genres] : '';

      const { query, variables } = buildAniListQuery({
        page: currentPage,
        limit: 20,
        search: searchQuery.trim() || null,
        type: filters.type || null,
        genreTag: genreName || null
      });

      const response = await fetch(ANILIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ query, variables }),
        signal: controller.signal
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Demasiadas peticiones. Espera unos segundos.');
        }
        throw new Error('Error al cargar los animes');
      }

      const json = await response.json();

      if (json.errors) {
        throw new Error(json.errors[0]?.message || 'Error en la consulta');
      }

      const page = json.data?.Page;
      const results = (page?.media || []).map(mapAniListToCommon);

      setAnimes(results);
      setHasNextPage(page?.pageInfo?.hasNextPage || false);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      setAnimes([]);
    } finally {
      setLoading(false);
    }
  };

  // Efecto unificado
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnimes();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, filters, currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setSearchQuery('');
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleViewDetails = (anime) => {
    setSelectedAnime(anime);
  };

  const handleCloseDetails = () => {
    setSelectedAnime(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <AnimeHeader />
        <div className="mb-6 sm:mb-8">
          <SearchBar onSearch={handleSearch} value={searchQuery} />
        </div>
        <FilterBar onFilterChange={handleFilterChange} />

        {error && (
          <div className="mb-6 sm:mb-8 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 animate-fadeIn">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm text-red-700 dark:text-red-200 font-medium flex-1">{error}</span>
            <button
              onClick={() => { setError(null); fetchAnimes(); }}
              className="shrink-0 rounded-full bg-red-500 hover:bg-red-600 text-white px-5 py-2 text-xs font-bold transition-all active:scale-95 shadow-md"
            >
              Reintentar
            </button>
          </div>
        )}

        <AnimeGrid
          animes={animes}
          loading={loading}
          onViewDetails={handleViewDetails}
        />

        {!loading && animes.length > 0 && (
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-full sm:w-auto rounded-lg bg-white px-4 py-2 text-sm sm:text-base text-gray-700 shadow-md transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 min-h-[44px] flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            <span className="flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm sm:text-base text-white shadow-md font-medium min-h-[44px]">
              Página {currentPage}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className="w-full sm:w-auto rounded-lg bg-white px-4 py-2 text-sm sm:text-base text-gray-700 shadow-md transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 min-h-[44px] flex items-center justify-center"
            >
              Siguiente
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {selectedAnime && (
          <AnimeDetail
            anime={selectedAnime}
            onClose={handleCloseDetails}
          />
        )}
      </div>
    </div>
  );
};

export default AnimePage;