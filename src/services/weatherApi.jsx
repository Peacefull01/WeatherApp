import axios from 'axios';
import {OPEN_WEATHERMAP_API_KEY, BASE_URL} from '@env';

// Shared API client.
const weatherHttp = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  params: {
    appid: OPEN_WEATHERMAP_API_KEY,
    units: 'metric',
  },
});

// Current weather for a city name.
export const getCurrentWeather = async city => {
  const {data} = await weatherHttp.get('/weather', {params: {q: city}});
  return data;
};

// 5-day forecast (3-hour steps).
export const getForecast = async city => {
  const {data} = await weatherHttp.get('/forecast', {params: {q: city}});
  return data;
};
