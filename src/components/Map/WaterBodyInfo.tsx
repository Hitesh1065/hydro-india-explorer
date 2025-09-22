import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Fish, Thermometer, Droplets, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface WaterBodyInfoProps {
  waterBody: any;
  onClose: () => void;
}

export const WaterBodyInfo: React.FC<WaterBodyInfoProps> = ({ waterBody, onClose }) => {
  // Mock data - replace with actual Excel sheet data
  const mockFishData = {
    species: ['Rohu', 'Catla', 'Mrigal', 'Hilsa', 'Prawns'],
    biodiversity: 85,
    waterQuality: 'Good',
    temperature: 26,
    pH: 7.2,
    oxygenLevel: 8.5,
    pollution: 'Low',
    fishingRecommendation: 'Excellent for fishing - ideal weather conditions'
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'fair':
        return 'bg-yellow-500';
      case 'poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-96 z-20">
      <Card className="bg-card/95 backdrop-blur-sm shadow-xl border border-border/50">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-foreground">
                {waterBody.properties?.name || 'Water Body'}
              </h3>
              <Badge variant="outline" className="mt-1 capitalize">
                {waterBody.properties?.type || 'Unknown'}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Fish Species */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Fish className="h-4 w-4 text-water-primary" />
              <span className="font-semibold text-sm">Fish Species</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {mockFishData.species.map((species, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {species}
                </Badge>
              ))}
            </div>
          </div>

          {/* Water Quality Metrics */}
          <div className="space-y-3 mb-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Biodiversity Index</span>
                <span className="text-sm font-medium">{mockFishData.biodiversity}%</span>
              </div>
              <Progress value={mockFishData.biodiversity} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-3 w-3 text-orange-500" />
                  <span className="text-xs text-muted-foreground">Temperature</span>
                </div>
                <div className="text-sm font-medium">{mockFishData.temperature}°C</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-muted-foreground">pH Level</span>
                </div>
                <div className="text-sm font-medium">{mockFishData.pH}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Activity className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-muted-foreground">Oxygen</span>
                </div>
                <div className="text-sm font-medium">{mockFishData.oxygenLevel} mg/L</div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Water Quality</span>
                <Badge className={getQualityColor(mockFishData.waterQuality)}>
                  {mockFishData.waterQuality}
                </Badge>
              </div>
            </div>
          </div>

          {/* Fishing Recommendation */}
          <div className="p-3 bg-gradient-to-r from-water-light/30 to-water-secondary/30 rounded-lg border border-water-primary/20">
            <div className="flex items-start space-x-2">
              <Fish className="h-4 w-4 text-water-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm text-foreground mb-1">
                  Fishing Recommendation
                </div>
                <div className="text-xs text-muted-foreground">
                  {mockFishData.fishingRecommendation}
                </div>
              </div>
            </div>
          </div>

          {/* Data Source Note */}
          <div className="mt-3 text-xs text-muted-foreground text-center">
            Data from Excel sheet + Live APIs • Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </Card>
    </div>
  );
};