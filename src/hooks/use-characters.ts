import { useCallback, useEffect, useMemo, useState } from 'react';

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

export function useCharacters() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState(1);
  const [characters, setCharacters] = useState<Character[]>([]);

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (query.trim()) {
        params.set('name', query.trim());
      }

      const response = await fetch(`https://rickandmortyapi.com/api/character?${params.toString()}`);
      const json = (await response.json()) as ApiResponse | { error: string };

      if (!response.ok) {
        throw new Error('error' in json ? json.error : 'Error al obtener datos');
      }

      setCharacters(json.results);
      setPages(json.info.pages);
    } catch (fetchError) {
      setCharacters([]);
      setPages(1);
      setError(fetchError instanceof Error ? fetchError.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  const canGoNext = useMemo(() => page < pages, [page, pages]);
  const canGoPrevious = useMemo(() => page > 1, [page]);

  const onSearch = useCallback((text: string) => {
    setPage(1);
    setQuery(text);
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
    reload: fetchCharacters,
  };
}
