import React, { createContext, useContext, useState, useCallback } from 'react';
import { getCurrentWeather, getForecast } from '../services/weatherApi';

const WeatherContext = createContext(null);

export const WeatherProvider = ({ children }) => {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentWeather(city);
      console.log('Data:', data);

      setCurrent(data);
      // optionally fetch forecast
      try {
        const f = await getForecast(city);
      console.log('Forecast Data:', f);
        setForecast(f);
      } catch (fErr) {
        // don't fail the whole flow if forecast fails
        setForecast(null);
      }
    } catch (err) {
      setError(err);
      setCurrent(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = () => {
    setCurrent(null);
    setForecast(null);
    setError(null);
  };

  return (
    <WeatherContext.Provider
      value={{ current, forecast, loading, error, searchCity, clear }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather must be used within a WeatherProvider');
  return ctx;
};