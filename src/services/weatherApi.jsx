import axios from 'axios';
import {OPEN_WEATHERMAP_API_KEY,BASE_URL} from'@env';

console.log(`API_KEY: ${OPEN_WEATHERMAP_API_KEY}, BASE_URL: ${BASE_URL}`);

export const getCurrentWeather = async (city) => {
  const response = await axios.get(
    `${BASE_URL}/weather?q=${city}&appid=${OPEN_WEATHERMAP_API_KEY}&units=metric`
  );
  return response.data;
};

export const getForecast = async (city) => {
  const response = await axios.get(
    `${BASE_URL}/forecast?q=${city}&appid=${OPEN_WEATHERMAP_API_KEY}&units=metric`
  );
  return response.data;
};