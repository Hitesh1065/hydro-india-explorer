import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Waves, Ship } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SearchPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  map: mapboxgl.Map | null;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  map 
}) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search data - replace with actual data from your Excel sheet
  const mockWaterBodies = [
    { id: 1, name: 'Ganges River', type: 'river', lat: 25.3176, lng: 82.9739 },
    { id: 2, name: 'Brahmaputra River', type: 'river', lat: 26.2006, lng: 92.9376 },
    { id: 3, name: 'Dal Lake', type: 'lake', lat: 34.1688, lng: 74.8619 },
    { id: 4, name: 'Vembanad Lake', type: 'lake', lat: 9.5916, lng: 76.3847 },
    { id: 5, name: 'Arabian Sea', type: 'sea', lat: 15.0000, lng: 68.0000 },
    { id: 6, name: 'Bay of Bengal', type: 'sea', lat: 15.0000, lng: 88.0000 },
  ];

  const mockPorts = [
    { id: 1, name: 'Mumbai Port', lat: 18.9220, lng: 72.8347 },
    { id: 2, name: 'Kolkata Port', lat: 22.5726, lng: 88.3639 },
    { id: 3, name: 'Chennai Port', lat: 13.0827, lng: 80.2707 },
    { id: 4, name: 'Cochin Port', lat: 9.9312, lng: 76.2673 },
  ];

  const handleSearch = (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);

    if (query.length > 2) {
      // Filter mock data based on search query
      const waterBodyResults = mockWaterBodies.filter(wb => 
        wb.name.toLowerCase().includes(query.toLowerCase())
      );
      const portResults = mockPorts.filter(port => 
        port.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults([...waterBodyResults, ...portResults]);
    } else {
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  const handleResultClick = (result: any) => {
    if (map) {
      map.flyTo({
        center: [result.lng, result.lat],
        zoom: 10,
        duration: 2000
      });
    }
    setSearchResults([]);
    setSearchQuery(result.name);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'river':
      case 'lake':
      case 'sea':
        return <Waves className="h-4 w-4 text-water-primary" />;
      default:
        return <Ship className="h-4 w-4 text-ocean" />;
    }
  };

  return (
    <div className="absolute top-24 left-4 z-10 w-80">
      <Card className="p-4 bg-card/95 backdrop-blur-sm shadow-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rivers, lakes, seas, or ports..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        
        {searchResults.length > 0 && (
          <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
            {searchResults.map((result) => (
              <Button
                key={result.id}
                variant="ghost"
                className="w-full justify-start p-2 h-auto hover:bg-water-light/50"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-center space-x-3">
                  {getIcon(result.type)}
                  <div className="text-left">
                    <div className="font-medium text-sm">{result.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {result.type || 'port'}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
        
        <div className="mt-3 flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleSearch('Ganges')}
            className="text-xs"
          >
            Rivers
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleSearch('Lake')}
            className="text-xs"
          >
            Lakes
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleSearch('Port')}
            className="text-xs"
          >
            Ports
          </Button>
        </div>
      </Card>
    </div>
  );
};