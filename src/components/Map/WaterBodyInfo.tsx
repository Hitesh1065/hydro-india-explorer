import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Fish, Droplets, Clock, Info, Waves } from 'lucide-react';

interface WaterBodyInfoProps {
  waterBody: any;
  onClose: () => void;
}

export const WaterBodyInfo = ({ waterBody, onClose }: WaterBodyInfoProps) => {
  const properties = waterBody.properties;
  
  // Calculate fishing score based on multiple factors
  const calculateFishingScore = () => {
    let score = 0;
    if (properties.waterQuality === 'Good') score += 30;
    if (properties.waterQuality === 'Moderate') score += 20;
    if (properties.fishTypes && properties.fishTypes.length > 3) score += 25;
    if (properties.depth && parseInt(properties.depth) > 5) score += 20;
    score += Math.min(properties.fishTypes?.length * 5 || 0, 25);
    return Math.min(score, 100);
  };

  const fishingScore = calculateFishingScore();
  const scoreColor = fishingScore >= 80 ? 'text-green-500' : 
                    fishingScore >= 60 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="absolute bottom-4 left-4 z-20 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border max-w-sm">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg text-foreground">{properties.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{properties.type}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Fishing Score */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <div className="flex items-center space-x-2">
              <Fish className={`h-5 w-5 ${scoreColor}`} />
              <span className="font-semibold">Fishing Score</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on water quality, fish diversity & depth
            </p>
          </div>
          <div className={`text-2xl font-bold ${scoreColor}`}>
            {fishingScore}/100
          </div>
        </div>

        {/* Water Details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Water Quality:</span>
            <span className="text-sm text-muted-foreground">{properties.waterQuality}</span>
          </div>
          
          {properties.depth && (
            <div className="flex items-center space-x-2">
              <Waves className="h-4 w-4 text-water-primary" />
              <span className="text-sm font-medium">Depth:</span>
              <span className="text-sm text-muted-foreground">{properties.depth}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Best Time:</span>
            <span className="text-sm text-muted-foreground">{properties.bestFishingTime}</span>
          </div>
        </div>

        {/* Fish Types */}
        {properties.fishTypes && properties.fishTypes.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Fish className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Fish Species ({properties.fishTypes.length})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {properties.fishTypes.map((fish: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {fish}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Fishing Tips */}
        <div className="p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Fishing Tips</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {fishingScore >= 80 
                  ? "Excellent spot! Try live bait near the deeper areas during recommended hours."
                  : fishingScore >= 60 
                  ? "Good fishing potential. Check weather conditions and use appropriate tackle."
                  : "Challenging conditions. Consider alternative locations or wait for better weather."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};