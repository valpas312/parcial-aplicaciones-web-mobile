import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  gender: string;
  location: { name: string };
};

type ApiResponse = {
  info: {
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
};

const API_URL = 'https://rickandmortyapi.com/api/character';

export function useCharacters() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState(1);
  const [characters, setCharacters] = useState<Character[]>([]);
  const requestId = useRef(0);

  const fetchCharacters = useCallback(async (signal?: AbortSignal) => {
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ page: String(page) });
      const normalizedQuery = query.trim();
      if (normalizedQuery) {
        params.set('name', normalizedQuery);
      }

      const response = await fetch(`${API_URL}?${params.toString()}`, { signal });
      const json = (await response.json()) as ApiResponse | { error: string };

      if (!response.ok || 'error' in json) {
        throw new Error('error' in json ? json.error : 'Error al obtener datos');
      }

      if (requestId.current !== currentRequest) {
        return;
      }

      setCharacters(json.results);
      setPages(json.info.pages);
    } catch (fetchError) {
      if (signal?.aborted || requestId.current !== currentRequest) {
        return;
      }

      setCharacters([]);
      setPages(1);
      setError(fetchError instanceof Error ? fetchError.message : 'Error desconocido');
    } finally {
      if (requestId.current === currentRequest) {
        setLoading(false);
      }
    }
  }, [page, query]);

  useEffect(() => {
    const controller = new AbortController();
    fetchCharacters(controller.signal);

    return () => controller.abort();
  }, [fetchCharacters]);

  const canGoNext = useMemo(() => !loading && page < pages, [loading, page, pages]);
  const canGoPrevious = useMemo(() => !loading && page > 1, [loading, page]);

  const onSearch = useCallback((text: string) => {
    setPage(1);
    setQuery(text);
  }, []);

  const goToNextPage = useCallback(() => {
    setPage((currentPage) => Math.min(currentPage + 1, pages));
  }, [pages]);

  const goToPreviousPage = useCallback(() => {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  }, []);

  return {
    characters,
    loading,
    error,
    page,
    pages,
    query,
    canGoNext,
    canGoPrevious,
    setPage,
    onSearch,
    goToNextPage,
    goToPreviousPage,
    reload: () => fetchCharacters(),
  };
}
