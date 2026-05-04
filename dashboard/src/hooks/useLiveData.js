import { useState, useEffect, useCallback, useRef } from 'react';

export function useLiveData(fetchFn, intervalMs = 4000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const fnRef = useRef(fetchFn);
  fnRef.current = fetchFn;

  const fetch = useCallback(async (silent = false) => {
    if (!silent) setLoading(prev => prev);
    try {
      const result = await fnRef.current();
      setData(result);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch(false);
    const id = setInterval(() => fetch(true), intervalMs);
    return () => clearInterval(id);
  }, [fetch, intervalMs]);

  return { data, loading, error, refetch: () => fetch(false), lastUpdated };
}
