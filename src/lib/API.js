const PROXY = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = '81c9cd1453319b07d45458b19eda065d';
const WEATHER_API_URL = `${PROXY}https://api.darksky.net/forecast/${API_KEY}/`;
const UNIT = 'si';

const getForecast = async (lat, lng) => {
  const response = await fetch(`${WEATHER_API_URL}${lat},${lng}?units=${UNIT}`);
  const result = await response.json();
  return result;
};

export default {
  getForecast,
};
