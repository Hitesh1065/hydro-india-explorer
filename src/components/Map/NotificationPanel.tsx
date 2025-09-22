import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  location?: string;
}

export const NotificationPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Mock notifications - replace with real-time data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Excellent Fishing Conditions',
        message: 'Weather and water conditions are ideal for fishing in Ganges Delta region.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        location: 'Ganges Delta'
      },
      {
        id: '2',
        type: 'warning',
        title: 'High Wind Alert',
        message: 'Strong winds (25+ km/h) detected in Arabian Sea coastal areas. Exercise caution.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        location: 'Arabian Sea'
      },
      {
        id: '3',
        type: 'info',
        title: 'Seasonal Migration',
        message: 'Hilsa fish migration season has started in Bay of Bengal region.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        location: 'Bay of Bengal'
      }
    ];

    setNotifications(mockNotifications);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: Math.random() > 0.7 ? 'warning' : Math.random() > 0.5 ? 'success' : 'info',
        title: 'Live Update',
        message: 'Weather conditions updated for monitored water bodies.',
        timestamp: new Date(),
        location: 'Multiple Locations'
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500';
      case 'success':
        return 'bg-green-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      {/* Notification Bell */}
      <div className="absolute top-24 right-80 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-card/95 backdrop-blur-sm"
        >
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500">
              {notifications.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute top-36 right-4 z-20 w-80">
          <Card className="bg-card/95 backdrop-blur-sm shadow-xl border border-border/50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No notifications
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 border-b border-border/30 last:border-b-0 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between space-x-2">
                        <div className="flex items-start space-x-2 flex-1">
                          {getIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-sm text-foreground truncate">
                                {notification.title}
                              </h4>
                              <Badge 
                                className={`text-white text-xs ${getBadgeColor(notification.type)}`}
                              >
                                {notification.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{notification.location}</span>
                              <span>{formatTime(notification.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="h-6 w-6 p-0 flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};