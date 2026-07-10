import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';

// Función para normalizar cadenas de texto (para comparar coincidencias)
const normalizeString = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^a-z0-9]/g, '') // Mantener solo letras y números
    .trim();
};

// Algoritmo de Levenshtein para calcular la distancia de edición
const getLevenshteinDistance = (a, b) => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // sustitución
          matrix[i][j - 1] + 1,     // inserción
          matrix[i - 1][j] + 1      // eliminación
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

// Obtiene la similitud entre 0.0 y 1.0
const getSimilarity = (s1, s2) => {
  const len = Math.max(s1.length, s2.length);
  if (len === 0) return 1.0;
  const dist = getLevenshteinDistance(s1, s2);
  return (len - dist) / len;
};

// Valida si un anime devuelto por Jikan coincide con el query buscado
const checkAnimeMatch = (query, anime) => {
  const normQuery = normalizeString(query);
  if (!normQuery) return { score: 0, type: 'none' };

  const candidateTitles = [];
  if (anime.title) candidateTitles.push(anime.title);
  if (anime.title_english) candidateTitles.push(anime.title_english);
  if (anime.title_japanese) candidateTitles.push(anime.title_japanese);
  if (Array.isArray(anime.titles)) {
    anime.titles.forEach(t => {
      if (t.title) candidateTitles.push(t.title);
    });
  }

  let maxScore = 0;
  let bestTitle = '';

  for (const title of candidateTitles) {
    const normTitle = normalizeString(title);
    if (!normTitle) continue;

    // Coincidencia exacta
    if (normTitle === normQuery) {
      return { score: 1.0, type: 'exact', matchedTitle: title };
    }

    // Calcular similitud
    const score = getSimilarity(normQuery, normTitle);
    if (score > maxScore) {
      maxScore = score;
      bestTitle = title;
    }
  }

  if (maxScore > 0.85) {
    return { score: maxScore, type: 'high', matchedTitle: bestTitle };
  } else if (maxScore > 0.6) {
    return { score: maxScore, type: 'medium', matchedTitle: bestTitle };
  }

  return { score: maxScore, type: 'low', matchedTitle: bestTitle };
};

// Limpieza de títulos inteligente para mejorar búsquedas
const cleanTitleForSearch = (title) => {
  let query = title.trim();
  
  // Eliminar palabras descriptivas comunes
  query = query.replace(/\b(la película|película|pelicula|la pelicula|movie|film|ova|ona)\b/gi, '');
  query = query.replace(/\b(arco de|arco|arc)\s+\w+/gi, '');
  
  // Capturar texto entre paréntesis o corchetes
  const parenthesized = query.match(/\(([^)]+)\)/);
  const brackets = query.match(/\[([^\]]+)\]/);
  
  let cleaned = query.replace(/\([^)]+\)/g, '').replace(/\[[^\]]+\]/g, '');
  
  // Limpiar guiones o dos puntos al final o al principio
  cleaned = cleaned.replace(/[\-:\s]+$/, '').replace(/^[\-:\s]+/, '').replace(/\s+/g, ' ').trim();
  
  if (!cleaned) cleaned = title;
  
  return {
    main: cleaned,
    alternative: parenthesized ? parenthesized[1].trim() : (brackets ? brackets[1].trim() : null)
  };
};

// Convierte un objeto anime de Kitsu al formato esperado por Jikan en la app
const mapKitsuToJikan = (kitsuAnime) => {
  const attr = kitsuAnime.attributes || {};
  
  const imageUrl = attr.posterImage?.small || attr.posterImage?.medium || attr.posterImage?.original;
  const largeImageUrl = attr.posterImage?.original || attr.posterImage?.large || imageUrl;
  
  const title = attr.canonicalTitle || '';
  const titleEnglish = attr.titles?.en || attr.titles?.en_jp || '';
  const titleJapanese = attr.titles?.ja_jp || '';
  
  const titlesList = [];
  if (title) titlesList.push({ type: 'Default', title });
  if (attr.titles) {
    Object.entries(attr.titles).forEach(([lang, val]) => {
      if (val) titlesList.push({ type: lang.toUpperCase(), title: val });
    });
  }
  if (Array.isArray(attr.abbreviatedTitles)) {
    attr.abbreviatedTitles.forEach(t => {
      titlesList.push({ type: 'Synonym', title: t });
    });
  }

  return {
    mal_id: parseInt(kitsuAnime.id) || kitsuAnime.id,
    title: title,
    title_english: titleEnglish,
    title_japanese: titleJapanese,
    titles: titlesList,
    images: {
      jpg: {
        image_url: imageUrl,
        small_image_url: attr.posterImage?.tiny || imageUrl,
        large_image_url: largeImageUrl
      }
    },
    type: attr.subtype || attr.showType || 'TV',
    episodes: attr.episodeCount || 0,
    score: attr.averageRating ? parseFloat((attr.averageRating / 10).toFixed(2)) : null,
    synopsis: attr.synopsis || attr.description || '',
    year: attr.startDate ? new Date(attr.startDate).getFullYear() : null,
    genres: []
  };
};

// Buscar en AniList GraphQL y mapear al formato Jikan
const searchAniList = async (searchText) => {
  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 10) {
        media(search: $search, type: ANIME) {
          id
          title { romaji english native }
          coverImage { large medium }
          episodes
          status
          averageScore
          description
          seasonYear
          format
          genres
          isAdult
        }
      }
    }
  `;
  const res = await fetch('https://graphql.anilist.co/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query, variables: { search: searchText } })
  });
  if (!res.ok) return [];
  const json = await res.json();
  if (json.errors) return [];
  const media = json.data?.Page?.media || [];
  return media.map(item => ({
    mal_id: item.id,
    title: item.title?.english || item.title?.romaji || '',
    title_english: item.title?.english || '',
    title_japanese: item.title?.native || '',
    titles: [
      item.title?.romaji && { type: 'Default', title: item.title.romaji },
      item.title?.english && { type: 'English', title: item.title.english },
      item.title?.native && { type: 'Japanese', title: item.title.native }
    ].filter(Boolean),
    images: {
      jpg: {
        image_url: item.coverImage?.large || item.coverImage?.medium || '',
        small_image_url: item.coverImage?.medium || '',
        large_image_url: item.coverImage?.large || ''
      }
    },
    type: item.format || 'TV',
    episodes: item.episodes || 0,
    score: item.averageScore ? parseFloat((item.averageScore / 10).toFixed(2)) : null,
    synopsis: (item.description || '').replace(/<[^>]*>/g, ''),
    year: item.seasonYear || null,
    genres: (item.genres || []).map((g, i) => ({ mal_id: `al-${item.id}-${i}`, name: g })),
    is_adult: item.isAdult || false
  }));
};

// Realiza la búsqueda de anime: AniList → Kitsu → Jikan (con fallbacks)
const fetchAnimeWithFallback = async (queryTitle) => {
  const { main: cleanTitle, alternative: altTitle } = cleanTitleForSearch(queryTitle);
  
  // 1. AniList (principal — rápida, estable, incluye hentai)
  try {
    const aniListResults = await searchAniList(cleanTitle);
    if (aniListResults.length > 0) {
      return { status: 'success', results: aniListResults, source: 'anilist' };
    }
  } catch (err) {
    console.warn("AniList falló. Probando Kitsu...", err);
  }

  // 2. Fallback a Kitsu API
  try {
    const kitsuRes = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(cleanTitle)}`);
    if (kitsuRes.ok) {
      const data = await kitsuRes.json();
      const kitsuResults = data.data || [];
      if (kitsuResults.length > 0) {
        const mappedResults = kitsuResults.map(mapKitsuToJikan);
        return { status: 'success', results: mappedResults, source: 'kitsu' };
      }
    }
  } catch (kitsuErr) {
    console.warn("Kitsu falló. Probando Jikan...", kitsuErr);
  }

  // 3. Jikan (último recurso)
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(cleanTitle)}`);
    if (res.status === 429) {
      return { status: 'rate_limited' };
    }
    if (res.ok) {
      const data = await res.json();
      const results = data.data || [];
      if (results.length > 0) {
        return { status: 'success', results, source: 'jikan' };
      }
    }
  } catch (err) {
    console.warn("Jikan falló.", err);
  }

  // 4. Título alternativo (texto entre paréntesis)
  if (altTitle) {
    console.log(`Probando título alternativo: "${altTitle}"...`);
    try {
      const altResults = await searchAniList(altTitle);
      if (altResults.length > 0) {
        return { status: 'success', results: altResults, source: 'anilist_alt' };
      }
    } catch (err) {}

    try {
      const kitsuResAlt = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(altTitle)}`);
      if (kitsuResAlt.ok) {
        const data = await kitsuResAlt.json();
        const kitsuResults = data.data || [];
        if (kitsuResults.length > 0) {
          const mappedResults = kitsuResults.map(mapKitsuToJikan);
          return { status: 'success', results: mappedResults, source: 'kitsu_alt' };
        }
      }
    } catch (err) {}
  }

  return { status: 'not_found', results: [] };
};

const ImportListModal = ({ onClose, onImportCompleted }) => {
  const [step, setStep] = useState(1); // 1: Carga de archivo, 2: Validación y revisión
  const [listName, setListName] = useState('');
  const [fileName, setFileName] = useState('');
  const [itemsToValidate, setItemsToValidate] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Estados de control de la validación
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Búsqueda manual en filas
  const [manualSearchRowIdx, setManualSearchRowIdx] = useState(null);
  const [manualSearchQuery, setManualSearchQuery] = useState('');
  const [manualSearchResults, setManualSearchResults] = useState([]);
  const [manualSearchLoading, setManualSearchLoading] = useState(false);

  // Estados para filtros, zoom de imagen y drag-and-drop
  const [statusFilter, setStatusFilter] = useState('all'); // all, success, suggested, not_found, duplicated
  const [previewImage, setPreviewImage] = useState(null); // { url, title }
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [draggedOverIdx, setDraggedOverIdx] = useState(null);
  const [tableSearchQuery, setTableSearchQuery] = useState('');

  // Helper para verificar si un anime es duplicado de uno anterior en la cola
  const isDuplicateOfPrevious = (item, index) => {
    if (!item.matchedAnime) return false;
    const malId = item.matchedAnime.mal_id;
    for (let i = 0; i < index; i++) {
      const prevItem = itemsToValidate[i];
      if (prevItem.status !== 'ignored' && prevItem.matchedAnime && prevItem.matchedAnime.mal_id === malId) {
        return true;
      }
    }
    return false;
  };

  // Helper para verificar si un elemento coincide con el filtro activo
  const matchesFilter = (item, index) => {
    if (item.status === 'ignored') return false;

    // Filtro por búsqueda de texto
    if (tableSearchQuery.trim()) {
      const q = tableSearchQuery.toLowerCase().trim();
      const matchOrig = item.originalTitle.toLowerCase().includes(q);
      const matchFound = item.matchedAnime && (
        item.matchedAnime.title.toLowerCase().includes(q) ||
        (item.matchedAnime.title_english && item.matchedAnime.title_english.toLowerCase().includes(q)) ||
        (item.matchedAnime.title_japanese && item.matchedAnime.title_japanese.toLowerCase().includes(q))
      );
      if (!matchOrig && !matchFound) return false;
    }

    if (statusFilter === 'all') return true;

    const isDup = isDuplicateOfPrevious(item, index);
    if (statusFilter === 'duplicated') {
      return isDup && (item.status === 'success' || item.status === 'suggested');
    }

    // Si es duplicado, lo excluimos de otros filtros para no mezclar
    if (isDup) return false;

    if (statusFilter === 'success') return item.status === 'success';
    if (statusFilter === 'suggested') return item.status === 'suggested';
    if (statusFilter === 'not_found') return item.status === 'not_found';
    return false;
  };

  // Manejadores de eventos para Drag & Drop
  const handleDragStartRow = (e, index) => {
    if (isValidating) return;
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget);
  };

  const handleDragOverRow = (e) => {
    e.preventDefault();
  };

  const handleDragEnterRow = (index) => {
    if (isValidating) return;
    setDraggedOverIdx(index);
  };

  const handleDragEndRow = () => {
    setDraggedIdx(null);
    setDraggedOverIdx(null);
  };

  const handleDropRow = (e, targetIndex) => {
    e.preventDefault();
    if (isValidating || draggedIdx === null || draggedIdx === targetIndex) return;

    setItemsToValidate(prev => {
      const next = [...prev];
      const [movedItem] = next.splice(draggedIdx, 1);
      next.splice(targetIndex, 0, movedItem);
      return next;
    });

    setDraggedIdx(null);
    setDraggedOverIdx(null);
  };

  const fileInputRef = useRef(null);
  const resultsEndRef = useRef(null);

  // Auto-scroll en la tabla de validación
  useEffect(() => {
    if (isValidating && resultsEndRef.current) {
      resultsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentIndex, isValidating]);

  // COLA DE VALIDACIÓN CON CONTROL DE RATE LIMIT Y FALLBACKS
  useEffect(() => {
    let timer;
    if (isValidating && !isPaused && currentIndex < itemsToValidate.length) {
      const currentItem = itemsToValidate[currentIndex];

      // Si el item ya fue resuelto manualmente o se omitió, pasar al siguiente
      if (currentItem.status === 'success' || currentItem.status === 'suggested' || currentItem.status === 'ignored') {
        setCurrentIndex(prev => prev + 1);
        return;
      }

      const processItem = async () => {
        try {
          const result = await fetchAnimeWithFallback(currentItem.originalTitle);
          
          if (result.status === 'rate_limited') {
            console.warn("Rate limit triggered (429). Retrying in 5 seconds...");
            setItemsToValidate(prev => {
              const next = [...prev];
              next[currentIndex] = { ...next[currentIndex], status: 'waiting_retry' };
              return next;
            });
            timer = setTimeout(processItem, 5000);
            return;
          }

          if (result.status === 'not_found' || !result.results || result.results.length === 0) {
            setItemsToValidate(prev => {
              const next = [...prev];
              next[currentIndex] = {
                ...next[currentIndex],
                status: 'not_found',
                matchedAnime: null,
                matchType: 'none'
              };
              return next;
            });
          } else {
            const results = result.results;
            // Encontrar el mejor match del top 5
            let bestMatch = results[0];
            let bestScore = 0;
            let matchType = 'low';

            for (const anime of results.slice(0, 5)) {
              const matchResult = checkAnimeMatch(currentItem.originalTitle, anime);
              if (matchResult.score > bestScore) {
                bestScore = matchResult.score;
                bestMatch = anime;
                matchType = matchResult.type;
              }
            }

            const finalStatus = (matchType === 'exact' || matchType === 'high') ? 'success' : 'suggested';

            setItemsToValidate(prev => {
              const next = [...prev];
              next[currentIndex] = {
                ...next[currentIndex],
                status: finalStatus,
                matchedAnime: bestMatch,
                matchType: matchType
              };
              return next;
            });
          }
          
          setCurrentIndex(prev => prev + 1);
        } catch (err) {
          console.error("Error al validar anime:", err);
          setItemsToValidate(prev => {
            const next = [...prev];
            next[currentIndex] = {
              ...next[currentIndex],
              status: 'error',
              error: err.message || 'Error de conexión'
            };
            return next;
          });
          setCurrentIndex(prev => prev + 1);
        }
      };

      // AniList permite 90 req/min — más rápido que Jikan
      timer = setTimeout(processItem, 700);
    } else if (currentIndex >= itemsToValidate.length && itemsToValidate.length > 0 && isValidating) {
      setIsValidating(false);

      // Contar duplicados
      const duplicateCount = itemsToValidate.filter((item, idx) => 
        (item.status === 'success' || item.status === 'suggested') && 
        item.matchedAnime && 
        isDuplicateOfPrevious(item, idx)
      ).length;

      if (duplicateCount > 0) {
        setTimeout(() => {
          const confirmRemove = window.confirm(
            `¡Validación finalizada!\nSe han encontrado ${duplicateCount} animes repetidos (duplicados) en tu lista.\n\n¿Deseas eliminar automáticamente los elementos duplicados de la tabla?`
          );
          if (confirmRemove) {
            setItemsToValidate(prev => {
              const seenIds = new Set();
              return prev.map(item => {
                if (item.status === 'ignored') return item;
                if ((item.status === 'success' || item.status === 'suggested') && item.matchedAnime) {
                  const malId = item.matchedAnime.mal_id;
                  if (seenIds.has(malId)) {
                    return { ...item, status: 'ignored' };
                  }
                  seenIds.add(malId);
                }
                return item;
              });
            });
          }
        }, 400);
      }
    }

    return () => clearTimeout(timer);
  }, [isValidating, isPaused, currentIndex, itemsToValidate.length]);

  // PARSERS
  const handleFileParse = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();

    setFileName(file.name);
    // Remover extensión para el nombre sugerido de la lista
    const suggestedListName = file.name.replace(/\.[^/.]+$/, "");
    setListName(suggestedListName);

    if (fileExtension === 'txt') {
      reader.onload = (e) => {
        const text = e.target.result;
        const titles = parseTxt(text);
        initializeItems(titles);
      };
      reader.readAsText(file);
    } else if (fileExtension === 'xlsx') {
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const titles = parseXlsx(arrayBuffer);
        initializeItems(titles);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Formato de archivo no soportado. Por favor sube un .txt o .xlsx");
    }
  };

  const parseTxt = (text) => {
    return text
      .split('\n')
      .map(line => {
        let clean = line.trim();
        // Eliminar viñetas y numeraciones comunes: -, *, 1., 2), [ ], [x]
        clean = clean.replace(/^([\-\*\+]\s*|\[\s*\]\s*|\[[xX]\]\s*|\d+[\.\)\s]\s*)/, '');
        return clean.trim();
      })
      .filter(line => line.length > 0 && !line.startsWith('#') && !line.startsWith('//'));
  };

  const parseXlsx = (arrayBuffer) => {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (rows.length === 0) return [];
    
    // Intentar buscar una columna que coincida con nombres de título
    const firstRow = rows[0].map(cell => String(cell || '').toLowerCase().trim());
    const titleHeaders = ['titulo', 'título', 'title', 'nombre', 'name', 'anime', 'animes'];
    let titleColIndex = -1;

    for (let i = 0; i < firstRow.length; i++) {
      if (titleHeaders.includes(firstRow[i])) {
        titleColIndex = i;
        break;
      }
    }

    // Fallback: si no hay cabecera explícita, usar la primera columna con valores
    if (titleColIndex === -1) {
      titleColIndex = 0;
    }

    const titles = [];
    // Si detectamos cabecera, empezamos en la fila 1, si no, en la 0
    const startRow = (titleColIndex !== -1 && rows[0][titleColIndex] && titleHeaders.includes(firstRow[titleColIndex])) ? 1 : 0;

    for (let i = startRow; i < rows.length; i++) {
      const cellValue = rows[i][titleColIndex];
      if (cellValue !== undefined && cellValue !== null) {
        const clean = String(cellValue).trim();
        if (clean.length > 0) {
          titles.push(clean);
        }
      }
    }
    return titles;
  };

  const initializeItems = (titles) => {
    if (titles.length === 0) {
      alert("No se encontraron títulos en el archivo.");
      return;
    }
    const formatted = titles.map((title, index) => ({
      id: index,
      originalTitle: title,
      status: 'pending', // pending, success, suggested, not_found, error, waiting_retry, ignored
      matchedAnime: null,
      matchType: 'none',
      error: null
    }));
    setItemsToValidate(formatted);
    setStep(2);
    // Comenzar validación automáticamente
    setIndexControl(0);
    setIsValidating(true);
    setIsPaused(false);
  };

  const setIndexControl = (idx) => {
    setCurrentIndex(idx);
  };

  // Drag & Drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileParse(e.dataTransfer.files[0]);
    }
  };

  // BÚSQUEDA MANUAL POR FILA
  const handleOpenManualSearch = (rowIdx, originalTitle) => {
    setManualSearchRowIdx(rowIdx);
    setManualSearchQuery(originalTitle);
    setManualSearchResults([]);
    setManualSearchLoading(false);
  };

  const handleExecuteManualSearch = async () => {
    if (!manualSearchQuery.trim()) return;
    try {
      setManualSearchLoading(true);
      const result = await fetchAnimeWithFallback(manualSearchQuery.trim());
      if (result.status === 'rate_limited') {
        alert("Límite de velocidad de la API alcanzado. Por favor, espera unos segundos e intenta buscar de nuevo.");
        return;
      }
      setManualSearchResults(result.results || []);
    } catch (err) {
      console.error(err);
      alert("Error al buscar el anime.");
    } finally {
      setManualSearchLoading(false);
    }
  };

  const handleSelectManualMatch = (anime) => {
    setItemsToValidate(prev => {
      const next = [...prev];
      next[manualSearchRowIdx] = {
        ...next[manualSearchRowIdx],
        status: 'success',
        matchedAnime: anime,
        matchType: 'exact',
        error: null
      };
      return next;
    });
    setManualSearchRowIdx(null);
  };

  const handleRemoveRow = (rowIdx) => {
    setItemsToValidate(prev => {
      const next = [...prev];
      next[rowIdx] = {
        ...next[rowIdx],
        status: 'ignored'
      };
      return next;
    });
    // Si eliminamos la fila actual que se está validando, avanzamos la cola
    if (rowIdx === currentIndex) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // IMPORTACIÓN FINAL A LOCAL STORAGE
  const handleFinalImport = () => {
    if (!listName.trim()) {
      alert("Por favor ingresa un nombre para la lista.");
      return;
    }

    // Filtrar solo los animes que fueron emparejados exitosamente sin duplicados de mal_id
    const importedAnimes = [];
    const seenIds = new Set();

    itemsToValidate.forEach(item => {
      if ((item.status === 'success' || item.status === 'suggested') && item.matchedAnime) {
        const malId = item.matchedAnime.mal_id;
        if (!seenIds.has(malId)) {
          seenIds.add(malId);
          importedAnimes.push(item.matchedAnime);
        }
      }
    });

    if (importedAnimes.length === 0) {
      alert("No hay ningún anime válido para importar.");
      return;
    }

    const storedLists = JSON.parse(localStorage.getItem('animeLists') || '[]');
    
    // Crear la nueva lista
    const newList = {
      id: Date.now(),
      name: listName.trim(),
      animes: importedAnimes,
      createdAt: new Date().toISOString()
    };

    const updatedLists = [...storedLists, newList];
    localStorage.setItem('animeLists', JSON.stringify(updatedLists));

    if (onImportCompleted) {
      onImportCompleted(newList);
    }
    onClose();
  };



  // Estadísticas rápidas
  const countSuccess = itemsToValidate.filter(i => i.status === 'success').length;
  const countSuggested = itemsToValidate.filter(i => i.status === 'suggested').length;
  const countNotFound = itemsToValidate.filter(i => i.status === 'not_found').length;
  const countPending = itemsToValidate.filter(i => i.status === 'pending' || i.status === 'waiting_retry').length;
  const countTotal = itemsToValidate.filter(i => i.status !== 'ignored').length;
  
  // Contar cuántos animes únicos finales se importarán
  const getUniqueImportCount = () => {
    const seenIds = new Set();
    let uniqueCount = 0;
    itemsToValidate.forEach((item) => {
      if ((item.status === 'success' || item.status === 'suggested') && item.matchedAnime) {
        const malId = item.matchedAnime.mal_id;
        if (!seenIds.has(malId)) {
          seenIds.add(malId);
          uniqueCount++;
        }
      }
    });
    return uniqueCount;
  };
  const countImported = getUniqueImportCount();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4 overflow-y-auto transform-gpu transition-all duration-300">
      
      {/* Estilos locales para animaciones premium */}
      <style>{`
        @keyframes row-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-row {
          animation: row-fade-in 0.3s ease-out forwards;
        }
        @keyframes progressbar-stripes {
          from { background-position: 1rem 0; }
          to { background-position: 0 0; }
        }
        .progress-bar-animated {
          background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);
          background-size: 1rem 1rem;
          animation: progressbar-stripes 1s linear infinite;
        }
        @keyframes scale-up {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up {
          animation: scale-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes radar-pulse {
          0% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .radar-pulse-ring {
          animation: radar-pulse 1.8s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
        }
      `}</style>

      <div className="w-full max-w-4xl rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/40 dark:border-gray-600/40 shadow-2xl shadow-emerald-500/10 flex flex-col max-h-[90vh] reveal overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-150 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-emerald-50/40 to-emerald-100/10 dark:from-emerald-950/20 dark:to-gray-800/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <span className="hidden sm:inline-block p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </span>
              Importar Lista de Anime
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Sube tus archivos de listas y el motor inteligente buscará y validará las coincidencias.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 dark:bg-gray-700 p-2 text-gray-500 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-600 hover:rotate-90 duration-300"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
          
          {/* PASO 1: SELECCIÓN DE ARCHIVO */}
          {step === 1 && (
            <div className="flex flex-col gap-6 animate-scale-up">
              <div 
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-500 flex flex-col items-center justify-center min-h-[280px] group relative overflow-hidden ${
                  isDragging 
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 scale-[1.01] shadow-emerald-500/10 shadow-xl' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-emerald-400 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/10 dark:to-gray-800/30 hover:from-emerald-50/10 dark:hover:from-emerald-950/5'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileParse(e.target.files[0])}
                  accept=".txt,.xlsx"
                  className="hidden" 
                />
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="mb-5 bg-emerald-100 dark:bg-emerald-950/50 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/20">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-emerald-500">
                  Arrastra tu archivo aquí o haz clic para explorar
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6 leading-relaxed">
                  Soporta listas en formato de texto plano <strong className="text-emerald-500 dark:text-emerald-400">.txt</strong> (un anime por línea) o libros de Excel <strong className="text-emerald-500 dark:text-emerald-400">.xlsx</strong>.
                </p>

                <button
                  type="button"
                  className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm px-6 py-2.5 shadow-md shadow-emerald-500/25 transition-all duration-300 group-hover:scale-105"
                >
                  Seleccionar Archivo
                </button>
              </div>

              {/* Explicación de formatos premium */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="p-4 rounded-xl border border-gray-150 dark:border-gray-700/60 bg-gray-55/30 dark:bg-gray-900/10 hover:border-emerald-300 dark:hover:border-emerald-900/40 transition-all duration-300 flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-950 dark:text-white">Formato de Texto (.txt)</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">Un título por línea. Se limpia automáticamente viñetas y números.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-gray-150 dark:border-gray-700/60 bg-gray-55/30 dark:bg-gray-900/10 hover:border-emerald-300 dark:hover:border-emerald-900/40 transition-all duration-300 flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V7m0 0h-5a2 2 0 00-2 2v5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-950 dark:text-white">Libro de Excel (.xlsx)</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">Detecta automáticamente columnas con nombres como "Título" o "Nombre".</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: VALIDACIÓN Y LISTA DE RESULTADOS */}
          {step === 2 && (
            <div className="flex flex-col gap-6 animate-scale-up">
              
              {/* Ajustes de Nombre de la Lista */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end bg-gray-50 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-150 dark:border-gray-700/50 backdrop-blur-sm">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Nombre de la Lista a Crear
                  </label>
                  <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Ej: Mis Animes de Acción"
                  />
                </div>
                <div className="text-xs sm:text-sm text-gray-550 dark:text-gray-400 w-full sm:w-auto text-right mb-1">
                  Archivo de origen: <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">{fileName}</span>
                </div>
              </div>

              {/* Barra de progreso de la validación */}
              <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                      {isValidating && (
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                      )}
                      {isValidating ? 'Validando con la Base de Datos...' : isPaused ? 'Validación Pausada' : 'Validación Finalizada'}
                    </span>
                    {isValidating && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                        Buscando: <span className="font-bold text-emerald-500">"{itemsToValidate[currentIndex]?.originalTitle}"</span>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    {isValidating ? (
                      <button
                        onClick={() => setIsPaused(true)}
                        className="w-full sm:w-auto rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 min-h-[36px] shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                        Pausar
                      </button>
                    ) : (
                      currentIndex < itemsToValidate.length && (
                        <button
                          onClick={() => { setIsPaused(false); setIsValidating(true); }}
                          className="w-full sm:w-auto rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 min-h-[36px] shadow-md shadow-emerald-500/20"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          Reanudar Búsqueda
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3.5 mb-5 overflow-hidden relative shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end progress-bar-animated shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                    style={{ width: `${(currentIndex / itemsToValidate.length) * 100}%` }}
                  />
                </div>

                {/* Estadísticas en cuadrícula de diseño */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-2.5 rounded-xl text-emerald-800 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-950/40 hover:scale-[1.02] transition-transform">
                    <span className="block font-extrabold text-xl mb-0.5">{countSuccess}</span>
                    Coincidencias
                  </div>
                  <div className="bg-yellow-50/60 dark:bg-yellow-950/20 p-2.5 rounded-xl text-yellow-800 dark:text-yellow-400 border border-yellow-100/50 dark:border-yellow-950/40 hover:scale-[1.02] transition-transform">
                    <span className="block font-extrabold text-xl mb-0.5">{countSuggested}</span>
                    Sugeridos
                  </div>
                  <div className="bg-red-50/60 dark:bg-red-950/20 p-2.5 rounded-xl text-red-800 dark:text-red-400 border border-red-100/50 dark:border-red-950/40 hover:scale-[1.02] transition-transform">
                    <span className="block font-extrabold text-xl mb-0.5">{countNotFound}</span>
                    No Encontrados
                  </div>
                  <div className="bg-blue-50/60 dark:bg-blue-950/20 p-2.5 rounded-xl text-blue-800 dark:text-blue-400 border border-blue-100/50 dark:border-blue-950/40 hover:scale-[1.02] transition-transform">
                    <span className="block font-extrabold text-xl mb-0.5">{countPending}</span>
                    Pendientes
                  </div>
                  <div className="col-span-2 sm:col-span-1 bg-gray-50 dark:bg-gray-700/60 p-2.5 rounded-xl text-gray-800 dark:text-gray-300 border border-gray-150 dark:border-gray-700/40 hover:scale-[1.02] transition-transform">
                    <span className="block font-extrabold text-xl mb-0.5 text-emerald-500">{countImported} <span className="text-xs font-normal text-gray-500">/ {countTotal}</span></span>
                    Listos
                  </div>
                </div>
              </div>

              {/* FILTROS DE ESTADO Y BUSCADOR DE TABLA */}
              <div className="flex flex-col gap-3 mb-2 pb-2 border-b border-gray-150 dark:border-gray-700/50">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-1 sm:mr-2">Filtrar por:</span>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border ${
                      statusFilter === 'all'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                        : 'bg-white text-gray-700 border-gray-250 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-350 dark:border-gray-700 dark:hover:bg-gray-750'
                    }`}
                  >
                    Todos ({countTotal})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('success')}
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      statusFilter === 'success'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40 dark:hover:bg-emerald-950/40'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Coincidencias ({countSuccess})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('suggested')}
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      statusFilter === 'suggested'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200/60 hover:bg-yellow-100 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/40 dark:hover:bg-yellow-950/40'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Sugeridos ({countSuggested})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('not_found')}
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      statusFilter === 'not_found'
                        ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20'
                        : 'bg-red-50 text-red-750 border-red-200/60 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40 dark:hover:bg-red-950/40'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    No Encontrados ({countNotFound})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('duplicated')}
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      statusFilter === 'duplicated'
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                        : 'bg-orange-50 text-orange-700 border-orange-200/60 hover:bg-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/40 dark:hover:bg-orange-950/40'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    Repetidos ({itemsToValidate.filter((item, idx) => (item.status === 'success' || item.status === 'suggested') && item.matchedAnime && isDuplicateOfPrevious(item, idx)).length})
                  </button>
                </div>

                {/* Input de Búsqueda */}
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-gray-250 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 pl-9 pr-9 py-2 text-xs text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                    placeholder="Filtrar por título original de la lista o nombre encontrado..."
                  />
                  {tableSearchQuery && (
                    <button
                      onClick={() => setTableSearchQuery('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* LISTADO DE ANIMES CARGADOS */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800/40 shadow-sm max-h-[350px] overflow-auto custom-scrollbar">
                <table className="w-full min-w-[750px] text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-50/80 dark:bg-gray-900/60 border-b border-gray-250 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-bold sticky top-0 backdrop-blur-sm z-10">
                      <th className="p-3.5 w-10 text-center"></th>
                      <th className="p-3.5 pl-4">Título Original</th>
                      <th className="p-3.5">Resultado Encontrado</th>
                      <th className="p-3.5">Confianza</th>
                      <th className="p-3.5 pr-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsToValidate.map((item, idx) => {
                      if (!matchesFilter(item, idx)) return null;
                      
                      const isCurrent = idx === currentIndex && isValidating;
                      const isDraggedOver = draggedOverIdx === idx;
                      const isDraggingThis = draggedIdx === idx;

                      return (
                        <tr 
                          key={item.id}
                          draggable={!isValidating}
                          onDragStart={(e) => handleDragStartRow(e, idx)}
                          onDragOver={handleDragOverRow}
                          onDragEnter={() => handleDragEnterRow(idx)}
                          onDragEnd={handleDragEndRow}
                          onDrop={(e) => handleDropRow(e, idx)}
                          className={`border-b border-gray-100 dark:border-gray-700/50 transition-all duration-300 animate-row ${
                            isCurrent ? 'bg-emerald-500/5 dark:bg-emerald-500/5 shadow-[inset_4px_0_0_0_#10b981]' : 'hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                          } ${isDraggedOver ? 'border-t-2 border-emerald-500 bg-emerald-500/5' : ''} ${isDraggingThis ? 'opacity-30' : ''}`}
                          style={{ animationDelay: `${(idx % 10) * 40}ms` }}
                        >
                          {/* Botón de arrastre */}
                          <td className="p-3.5 text-center">
                            <div 
                              className={`text-gray-400 dark:text-gray-600 transition-colors ${!isValidating ? 'cursor-grab hover:text-emerald-500 dark:hover:text-emerald-400 active:cursor-grabbing' : 'opacity-30 cursor-not-allowed'}`}
                              title={!isValidating ? "Arrastra para reordenar" : "Validando..."}
                            >
                              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                              </svg>
                            </div>
                          </td>

                          {/* Título en Archivo */}
                          <td className="p-3.5 pl-4 font-semibold text-gray-700 dark:text-gray-300 break-words max-w-[200px]">
                            {item.originalTitle}
                            {isCurrent && (
                              <div className="flex items-center gap-1.5 mt-1 text-emerald-500 font-bold text-[10px] tracking-wider uppercase">
                                <span className="relative flex h-1.5 w-1.5 shrink-0">
                                  <span className="radar-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                </span>
                                Buscando...
                              </div>
                            )}
                          </td>

                          {/* Anime Coincidente */}
                          <td className="p-3.5">
                            {item.matchedAnime ? (
                              <div className="flex items-center gap-3 transition-opacity duration-300">
                                <img
                                  src={item.matchedAnime.images?.jpg?.small_image_url || item.matchedAnime.images?.jpg?.image_url}
                                  alt={item.matchedAnime.title}
                                  className="h-12 w-9 object-cover rounded shadow-md shrink-0 hover:scale-110 transition-transform cursor-zoom-in"
                                  onClick={() => setPreviewImage({
                                    url: item.matchedAnime.images?.jpg?.large_image_url || item.matchedAnime.images?.jpg?.image_url,
                                    title: item.matchedAnime.title
                                  })}
                                />
                                <div className="min-w-0">
                                  <div className="font-bold text-gray-900 dark:text-white line-clamp-1 leading-snug">
                                    {item.matchedAnime.title}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex flex-wrap items-center gap-1.5">
                                    <span className="text-[9px] bg-gray-150 dark:bg-gray-700 px-1.5 py-0.5 rounded font-bold uppercase text-gray-600 dark:text-gray-300">
                                      {item.matchedAnime.type}
                                    </span>
                                    <span>{item.matchedAnime.episodes || '?'} eps</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5 font-semibold text-amber-500">
                                      ★ {item.matchedAnime.score || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : item.status === 'pending' || item.status === 'waiting_retry' ? (
                              <span className="text-gray-400 dark:text-gray-500 italic">Esperando en cola...</span>
                            ) : item.status === 'not_found' ? (
                              <span className="text-red-500 dark:text-red-400 font-semibold flex items-center gap-1">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Sin resultado
                              </span>
                            ) : (
                              <span className="text-red-450 italic">Error de búsqueda</span>
                            )}
                          </td>

                          {/* Estado / Confianza */}
                          <td className="p-3.5">
                            {isDuplicateOfPrevious(item, idx) ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/25 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400" title="Este anime ya coincide con una fila anterior de esta lista y será omitido para evitar duplicados.">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Duplicado
                              </span>
                            ) : (
                              <>
                                {item.status === 'success' && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Match Exacto
                                  </span>
                                )}
                                {item.status === 'suggested' && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400" title="Verifica si esta sugerencia es la correcta.">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    Sugerido
                                  </span>
                                )}
                                {item.status === 'not_found' && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 dark:bg-red-500/20 px-2.5 py-1 text-xs font-bold text-red-600 dark:text-red-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    No Encontrado
                                  </span>
                                )}
                                {item.status === 'waiting_retry' && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                                    Reintentando...
                                  </span>
                                )}
                                {item.status === 'pending' && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-750 px-2.5 py-1 text-xs font-bold text-gray-500 dark:text-gray-400">
                                    En Espera
                                  </span>
                                )}
                                {item.status === 'error' && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 dark:bg-red-500/20 px-2.5 py-1 text-xs font-bold text-red-500 dark:text-red-400">
                                    Error ({item.error || 'Red'})
                                  </span>
                                )}
                              </>
                            )}
                          </td>

                          {/* Acciones por fila */}
                          <td className="p-3.5 pr-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleOpenManualSearch(idx, item.originalTitle)}
                                className="rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 text-xs font-bold transition-colors"
                                title="Buscar Manualmente"
                              >
                                Cambiar
                              </button>
                              <button
                                onClick={() => handleRemoveRow(idx)}
                                className="rounded-lg bg-gray-100 hover:bg-red-500/10 dark:bg-gray-700/60 dark:hover:bg-red-500/25 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 px-3 py-1.5 text-xs font-bold transition-colors"
                                title="Excluir anime"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Elemento de referencia para auto-scroll */}
                    <tr ref={resultsEndRef} />
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BUSCADOR MANUAL FLOTANTE / IN-ROW */}
          {manualSearchRowIdx !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
              <div className="w-full max-w-lg rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/40 dark:border-gray-600/40 p-6 shadow-2xl shadow-emerald-500/10 flex flex-col max-h-[80vh] animate-scale-up transform-gpu">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                    Corregir: <span className="text-emerald-500 font-semibold">"{itemsToValidate[manualSearchRowIdx]?.originalTitle}"</span>
                  </h4>
                  <button 
                    onClick={() => setManualSearchRowIdx(null)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Formulario de búsqueda */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={manualSearchQuery}
                    onChange={(e) => setManualSearchQuery(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Buscar por título en inglés o japonés..."
                    onKeyDown={(e) => e.key === 'Enter' && handleExecuteManualSearch()}
                  />
                  <button
                    onClick={handleExecuteManualSearch}
                    disabled={manualSearchLoading}
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-emerald-500/25 transition-transform active:scale-95"
                  >
                    {manualSearchLoading ? (
                      <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : 'Buscar'}
                  </button>
                </div>

                {/* Resultados manuales */}
                <div className="flex-1 overflow-y-auto min-h-[220px] border border-gray-150 dark:border-gray-700/60 rounded-xl p-2 bg-gray-50/50 dark:bg-gray-900/10 custom-scrollbar">
                  {manualSearchLoading ? (
                    <div className="flex items-center justify-center h-full min-h-[200px]">
                      <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent"></div>
                    </div>
                  ) : manualSearchResults.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-12 px-4 leading-relaxed">
                      Escribe el nombre del anime y presiona buscar para consultar candidatos en tiempo real.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {manualSearchResults.map(anime => (
                        <div 
                          key={anime.mal_id}
                          onClick={() => handleSelectManualMatch(anime)}
                          className="flex items-center gap-3 p-2.5 hover:bg-emerald-500/5 hover:border-emerald-500/40 dark:hover:bg-emerald-950/20 border border-gray-150 dark:border-gray-750 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.01]"
                        >
                          <img
                            src={anime.images?.jpg?.small_image_url || anime.images?.jpg?.image_url}
                            alt={anime.title}
                            className="h-14 w-10 object-cover rounded-lg shadow shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-extrabold text-sm text-gray-900 dark:text-white truncate leading-snug">
                              {anime.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                              {anime.title_english && `EN: ${anime.title_english}`}
                            </div>
                            <div className="text-xs font-semibold text-gray-650 dark:text-gray-300 mt-1 flex items-center gap-2">
                              <span className="bg-gray-205 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-gray-600 dark:text-gray-300">{anime.type}</span>
                              <span>• {anime.episodes || '?'} eps</span>
                              <span>• ⭐ {anime.score || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                  <button
                    onClick={() => setManualSearchRowIdx(null)}
                    className="border border-gray-300 dark:border-gray-650 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/45 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-150 dark:border-gray-700 flex justify-between bg-gray-50/50 dark:bg-gray-900/30">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-600 min-h-[42px]"
          >
            {step === 1 ? 'Cancelar' : 'Salir sin Guardar'}
          </button>
          
          {step === 2 && (
            <button
              onClick={handleFinalImport}
              disabled={isValidating || countImported === 0}
              className="rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 text-white px-6 py-2.5 text-sm font-bold transition-all shadow-md shadow-emerald-500/25 min-h-[42px] flex items-center gap-2"
            >
              {isValidating ? (
                <>
                  <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Validando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Importar {countImported} Animes
                </>
              )}
            </button>
          )}
        </div>

      </div>

      {/* Modal flotante de vista previa de imagen grande */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-lg w-full max-h-[90vh] flex flex-col items-center justify-center animate-scale-up" 
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white transition-all hover:rotate-90 duration-300"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={previewImage.url}
              alt={previewImage.title}
              className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
            />
            <p className="text-white font-bold text-center mt-4 text-base px-4 truncate max-w-full drop-shadow-md">
              {previewImage.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportListModal;
