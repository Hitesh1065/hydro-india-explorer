import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';

interface WeatherOverlayProps {
  map: mapboxgl.Map | null;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ map }) => {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [openWeatherKey, setOpenWeatherKey] = useState('');

  // Mock weather data for Indian water bodies
  const mockWeatherData = [
    {
      id: 1,
      location: 'Ganges Delta',
      lat: 22.0,
      lng: 89.5,
      temperature: 28,
      humidity: 78,
      windSpeed: 12,
      condition: 'cloudy',
      fishingCondition: 'good'
    },
    {
      id: 2,
      location: 'Arabian Sea Coast',
      lat: 15.0,
      lng: 73.0,
      temperature: 30,
      humidity: 65,
      windSpeed: 18,
      condition: 'sunny',
      fishingCondition: 'excellent'
    },
    {
      id: 3,
      location: 'Bay of Bengal',
      lat: 15.0,
      lng: 88.0,
      temperature: 29,
      humidity: 82,
      windSpeed: 15,
      condition: 'rainy',
      fishingCondition: 'poor'
    }
  ];

  useEffect(() => {
    // In a real implementation, you would fetch weather data from OpenWeather API
    // This requires the API key to be stored securely in Supabase
    setWeatherData(mockWeatherData);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-4 w-4 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      default:
        return <Cloud className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFishingBadgeColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-yellow-500';
      case 'poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="absolute top-24 right-4 z-10 w-72">
      <Card className="p-4 bg-card/95 backdrop-blur-sm shadow-lg">
        <div className="flex items-center space-x-2 mb-3">
          <Cloud className="h-5 w-5 text-water-primary" />
          <h3 className="font-semibold text-foreground">Weather & Fishing</h3>
        </div>
        
        <div className="space-y-3">
          {weatherData.map((weather) => (
            <div 
              key={weather.id}
              className="p-3 bg-muted/50 rounded-lg border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm text-foreground">
                  {weather.location}
                </h4>
                {getWeatherIcon(weather.condition)}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                <div>Temp: {weather.temperature}°C</div>
                <div>Humidity: {weather.humidity}%</div>
                <div className="flex items-center">
                  <Wind className="h-3 w-3 mr-1" />
                  {weather.windSpeed} km/h
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Fishing:</span>
                <Badge 
                  className={`text-white ${getFishingBadgeColor(weather.fishingCondition)}`}
                >
                  {weather.fishingCondition}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-water-light/20 rounded-lg border border-water-primary/20">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Connect to Supabase to enable live weather data from OpenWeather API
          </p>
        </div>
      </Card>
    </div>
  );
};