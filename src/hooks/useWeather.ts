import { useState, useEffect } from 'react';

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
    if (!navigator.geolocation) {
      setWeatherData(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Geolocation is not supported by your browser' 
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          
          if (!response.ok) throw new Error('Weather data fetch failed');
          
          const data = await response.json();

          setWeatherData({
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].main,
            loading: false,
            error: null
          });
        } catch (err) {
          setWeatherData(prev => ({ ...prev, loading: false, error: 'Failed to fetch weather' }));
        }
      },
      (error) => {
        setWeatherData(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message || 'Permission denied' 
        }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  return weatherData;
};