import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {getCurrentWeather} from '../services/weatherApi';

const WeatherContext = createContext(null);

// List + search. Forecast only on detail screen.
export const WeatherProvider = ({children}) => {
  const [savedCities, setSavedCities] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // City that matches selectedId.
  const current = useMemo(
    () => savedCities.find(c => c.id === selectedId) ?? null,
    [savedCities, selectedId],
  );

  // Search: add/update city, select it.
  const searchCity = useCallback(async city => {
    const q = typeof city === 'string' ? city.trim() : '';
    if (!q) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentWeather(q);

      setSavedCities(prev => {
        const idx = prev.findIndex(c => c.id === data.id);
        if (idx === -1) {
          return [...prev, data];
        }
        const next = [...prev];
        next[idx] = data;
        return next;
      });
      setSelectedId(data.id);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Highlight a city on the list
  const selectCity = useCallback(id => {
    setSelectedId(id);
  }, []);

  // Remove city; pick a new selection if needed.
  const removeCity = useCallback(id => {
    setSavedCities(prev => {
      const next = prev.filter(c => c.id !== id);
      setSelectedId(sel => {
        if (sel !== id) {
          return sel;
        }
        return next[0]?.id ?? null;
      });
      return next;
    });
  }, []);

  // Clear all cities.
  const clear = useCallback(() => {
    setError(null);
    setSavedCities([]);
    setSelectedId(null);
  }, []);

  // Stable context value (fewer re-renders).
  const value = useMemo(
    () => ({
      current,
      loading,
      error,
      savedCities,
      selectedId,
      searchCity,
      selectCity,
      removeCity,
      clear,
    }),
    [
      current,
      loading,
      error,
      savedCities,
      selectedId,
      searchCity,
      selectCity,
      removeCity,
      clear,
    ],
  );

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return ctx;
};
