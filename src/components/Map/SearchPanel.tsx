import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, MapPin, Fish, Navigation } from 'lucide-react';

interface SearchPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  map: mapboxgl.Map | null;
}

// Sample search data - replace with your Excel data
const searchData = [
  { name: 'Ganges River', type: 'river', coords: [78.9629, 25.3176] },
  { name: 'Dal Lake', type: 'lake', coords: [74.8370, 34.1218] },
  { name: 'Vembanad Lake', type: 'lake', coords: [76.3868, 9.5916] },
  { name: 'Mumbai Port', type: 'port', coords: [72.8777, 18.9220] },
  { name: 'Chennai Port', type: 'port', coords: [80.2707, 13.0827] },
  { name: 'Kolkata Port', type: 'port', coords: [88.3639, 22.5726] },
  { name: 'Yamuna River', type: 'river', coords: [77.2090, 28.6139] },
  { name: 'Brahmaputra River', type: 'river', coords: [91.7362, 26.1445] },
  { name: 'Chilika Lake', type: 'lake', coords: [85.4978, 19.7179] },
  { name: 'Wular Lake', type: 'lake', coords: [74.6006, 34.3667] }
];

export const SearchPanel = ({ searchQuery, setSearchQuery, map }: SearchPanelProps) => {
  const [searchResults, setSearchResults] = useState<typeof searchData>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchQuery]);

  const handleLocationSelect = (coords: number[], name: string) => {
    if (map) {
      map.flyTo({
        center: [coords[0], coords[1]],
        zoom: 10,
        duration: 2000
      });
    }
    setShowResults(false);
    setSearchQuery(name);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'river': return <Navigation className="h-4 w-4 text-blue-500" />;
      case 'lake': return <Fish className="h-4 w-4 text-water-primary" />;
      case 'port': return <MapPin className="h-4 w-4 text-orange-500" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="absolute top-20 left-4 z-20 w-80">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rivers, lakes, ports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/95 backdrop-blur-sm border-water-primary/20 shadow-lg"
          />
        </div>

        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border max-h-64 overflow-y-auto">
            <div className="p-2 space-y-1">
              {searchResults.map((result, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 hover:bg-muted"
                  onClick={() => handleLocationSelect(result.coords, result.name)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    {getTypeIcon(result.type)}
                    <div className="text-left">
                      <div className="font-medium text-sm">{result.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{result.type}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {showResults && searchResults.length === 0 && (
          <div className="absolute top-full mt-2 w-full bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border">
            <Alert>
              <Search className="h-4 w-4" />
              <AlertDescription>
                No results found for "{searchQuery}"
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};