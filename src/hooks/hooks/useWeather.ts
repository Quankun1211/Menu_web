import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface WeatherState {
  temperature: number;
  condition: string;
  loading: boolean;
  error: string | null;
}

const API_KEY = '6dac6e3742d03bfe2c3ba3fb2dce1dd8'; 

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherState>({
    temperature: 25, 
    condition: 'Clear',
    loading: true,
    error: null
  });

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setWeatherData(prev => ({ ...prev, loading: false, error: 'Permission denied' }));
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        setWeatherData({
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          loading: false,
          error: null
        });
      } catch (err) {
        setWeatherData(prev => ({ ...prev, loading: false, error: 'Failed to fetch' }));
      }
    })();
  }, []);

  return weatherData;
};