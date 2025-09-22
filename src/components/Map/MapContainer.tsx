import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Waves, Fish, Cloud } from 'lucide-react';
import { WeatherOverlay } from './WeatherOverlay';
import { WaterBodyInfo } from './WaterBodyInfo';
import { SearchPanel } from './SearchPanel';
import { NotificationPanel } from './NotificationPanel';

const MapContainer = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(78.9629); // Center of India
  const [lat, setLat] = useState(20.5937);
  const [zoom, setZoom] = useState(5);
  const [selectedWaterBody, setSelectedWaterBody] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWeather, setShowWeather] = useState(true);
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize Mapbox
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: zoom,
      maxBounds: [
        [68.1766451354, 7.96553477623], // Southwest coordinates
        [97.4025614766, 35.4940095078]  // Northeast coordinates (India bounds)
      ]
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add water bodies layer (this would be populated with actual data)
    map.current.on('load', () => {
      // Add Indian water bodies data source
      map.current?.addSource('indian-water-bodies', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [] // This would be populated with your Excel data
        }
      });

      // Add ports layer
      map.current?.addSource('indian-ports', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [] // Port locations
        }
      });

      // Style water bodies
      map.current?.addLayer({
        id: 'water-bodies',
        type: 'fill',
        source: 'indian-water-bodies',
        paint: {
          'fill-color': [
            'match',
            ['get', 'type'],
            'river', '#3b82f6',
            'lake', '#06b6d4',
            'sea', '#1e40af',
            'ocean', '#1e3a8a',
            '#0ea5e9'
          ],
          'fill-opacity': 0.6
        }
      });

      // Add ports layer
      map.current?.addLayer({
        id: 'ports',
        type: 'symbol',
        source: 'indian-ports',
        layout: {
          'icon-image': 'harbor-15',
          'icon-size': 1.5,
          'text-field': '{name}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 1.25],
          'text-anchor': 'top'
        }
      });
    });

    // Click handler for water bodies
    map.current.on('click', 'water-bodies', (e) => {
      if (e.features && e.features[0]) {
        setSelectedWaterBody(e.features[0]);
      }
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'water-bodies', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = 'pointer';
      }
    });

    map.current.on('mouseleave', 'water-bodies', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = '';
      }
    });

    return () => map.current?.remove();
  }, [mapboxToken]);

  if (!mapboxToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-water-light to-water-secondary flex items-center justify-center">
        <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Waves className="h-12 w-12 text-water-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground">Connect Your Mapbox</h2>
            <p className="text-muted-foreground mt-2">
              Enter your Mapbox public token to explore India's water bodies
            </p>
          </div>
          
          <div className="space-y-4">
            <Input
              placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJ5b3VyLXRva2VuIn0..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="font-mono text-sm"
            />
            <Button 
              onClick={() => {/* Token validation could happen here */}}
              className="w-full bg-gradient-to-r from-water-primary to-water-secondary hover:opacity-90"
            >
              Initialize Map
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Need a token?</strong> Get your free Mapbox public token from{' '}
              <a 
                href="https://account.mapbox.com/access-tokens/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-water-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-water-primary to-water-secondary p-2 rounded-lg">
              <Waves className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">India Water Bodies</h1>
              <p className="text-sm text-muted-foreground">Interactive Fishing & Weather Guide</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={showWeather ? "default" : "outline"}
              size="sm"
              onClick={() => setShowWeather(!showWeather)}
              className="bg-water-primary hover:bg-water-dark"
            >
              <Cloud className="h-4 w-4 mr-2" />
              Weather
            </Button>
          </div>
        </div>
      </div>

      {/* Search Panel */}
      <SearchPanel 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        map={map.current}
      />

      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 pt-20" />

      {/* Weather Overlay */}
      {showWeather && <WeatherOverlay map={map.current} />}

      {/* Water Body Info Panel */}
      {selectedWaterBody && (
        <WaterBodyInfo 
          waterBody={selectedWaterBody}
          onClose={() => setSelectedWaterBody(null)}
        />
      )}

      {/* Notification Panel */}
      <NotificationPanel />
    </div>
  );
};

export default MapContainer;