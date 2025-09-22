import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Cloud, Thermometer, Droplets, Wind, Eye } from 'lucide-react';

interface WeatherOverlayProps {
  map: mapboxgl.Map | null;
  apiKey: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  description: string;
  isFishingFriendly: boolean;
  fishingAdvice: string;
}

export const WeatherOverlay = ({ map, apiKey }: WeatherOverlayProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchWeatherData = async (lat: number, lng: number) => {
    if (!apiKey) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) throw new Error('Weather data unavailable');
      
      const data = await response.json();
      
      // Calculate fishing friendliness
      const temp = data.main.temp;
      const windSpeed = data.wind.speed;
      const humidity = data.main.humidity;
      
      const isFishingFriendly = temp >= 15 && temp <= 30 && windSpeed < 5 && humidity > 40;
      
      let fishingAdvice = '';
      if (isFishingFriendly) {
        fishingAdvice = 'Excellent fishing conditions! Perfect temperature and calm waters.';
      } else if (temp < 15) {
        fishingAdvice = 'Cold water - fish may be less active. Try deeper areas.';
      } else if (temp > 30) {
        fishingAdvice = 'Hot weather - fish early morning or evening for best results.';
      } else if (windSpeed >= 5) {
        fishingAdvice = 'Windy conditions - fishing may be challenging from shore.';
      } else {
        fishingAdvice = 'Moderate conditions - adjust your fishing strategy accordingly.';
      }
      
      setWeatherData({
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        visibility: Math.round(data.visibility / 1000), // Convert to km
        description: data.weather[0].description,
        isFishingFriendly,
        fishingAdvice
      });
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!map || !apiKey) return;

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      fetchWeatherData(e.lngLat.lat, e.lngLat.lng);
    };

    map.on('click', handleMapClick);
    
    // Fetch weather for center of India on load
    fetchWeatherData(20.5937, 78.9629);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, apiKey]);

  if (!map) return null;

  return (
    <div className="absolute top-20 right-4 z-20 space-y-2">
      {loading && (
        <Alert className="bg-card/95 backdrop-blur-sm border-water-primary/20 shadow-lg">
          <Cloud className="h-4 w-4 animate-spin" />
          <AlertDescription>Loading weather data...</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="bg-card/95 backdrop-blur-sm shadow-lg">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {weatherData && (
        <>
          <Alert className={`bg-card/95 backdrop-blur-sm shadow-lg border-2 ${
            weatherData.isFishingFriendly 
              ? 'border-green-500 bg-green-50/10' 
              : 'border-orange-500 bg-orange-50/10'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Weather Conditions</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  weatherData.isFishingFriendly 
                    ? 'bg-green-500 text-white' 
                    : 'bg-orange-500 text-white'
                }`}>
                  {weatherData.isFishingFriendly ? 'Great for Fishing' : 'Moderate Conditions'}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Thermometer className="h-3 w-3 text-red-500" />
                  <span>{weatherData.temperature}°C</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Droplets className="h-3 w-3 text-blue-500" />
                  <span>{weatherData.humidity}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Wind className="h-3 w-3 text-gray-500" />
                  <span>{weatherData.windSpeed} km/h</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3 text-purple-500" />
                  <span>{weatherData.visibility} km</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground capitalize">
                {weatherData.description}
              </p>
            </div>
          </Alert>
          
          <Alert className="bg-card/95 backdrop-blur-sm border-water-primary/20 shadow-lg">
            <AlertDescription className="text-xs">
              <strong>Fishing Advice:</strong> {weatherData.fishingAdvice}
            </AlertDescription>
          </Alert>
        </>
      )}
      
      <Alert className="bg-card/95 backdrop-blur-sm border-water-primary/20 shadow-lg">
        <AlertDescription className="text-xs text-muted-foreground">
          Click anywhere on the map to check local weather conditions
        </AlertDescription>
      </Alert>
    </div>
  );
};