import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Bell, X, Fish, CloudRain, Sun, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'weather' | 'fishing' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
}

export const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          id: Date.now().toString(),
          type: 'fishing' as const,
          title: 'Great Fishing Alert',
          message: 'Excellent fishing conditions detected at Dal Lake. Water temperature perfect for Trout fishing.',
          timestamp: new Date(),
          priority: 'medium' as const
        },
        {
          id: Date.now().toString(),
          type: 'weather' as const,
          title: 'Weather Update',
          message: 'Clear skies and calm winds forecast for the next 4 hours - ideal for fishing.',
          timestamp: new Date(),
          priority: 'low' as const
        },
        {
          id: Date.now().toString(),
          type: 'alert' as const,
          title: 'High Wind Warning',
          message: 'Strong winds expected in coastal areas. Exercise caution while fishing.',
          timestamp: new Date(),
          priority: 'high' as const
        }
      ];

      // Add random notification every 30 seconds
      if (Math.random() > 0.7) {
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        setNotifications(prev => [randomNotification, ...prev].slice(0, 5));
      }
    }, 30000);

    // Add initial notifications
    setNotifications([
      {
        id: '1',
        type: 'fishing',
        title: 'Welcome to India Water Bodies',
        message: 'Click on any water body to get detailed fishing information and weather conditions.',
        timestamp: new Date(),
        priority: 'medium'
      }
    ]);

    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'fishing': return <Fish className="h-4 w-4 text-green-500" />;
      case 'weather': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50/10';
      case 'medium': return 'border-yellow-500 bg-yellow-50/10';
      case 'low': return 'border-green-500 bg-green-50/10';
      default: return 'border-border';
    }
  };

  return (
    <>
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 right-20 z-30 bg-card/95 backdrop-blur-sm shadow-lg"
        onClick={() => setShowPanel(!showPanel)}
      >
        <Bell className="h-4 w-4" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </Button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="fixed top-16 right-4 z-30 w-80 max-h-96 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPanel(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {notifications.map((notification) => (
                  <Alert
                    key={notification.id}
                    className={`relative ${getPriorityColor(notification.priority)}`}
                  >
                    <div className="flex items-start space-x-2">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <AlertTitle className="text-sm font-medium">
                          {notification.title}
                        </AlertTitle>
                        <AlertDescription className="text-xs mt-1">
                          {notification.message}
                        </AlertDescription>
                        <div className="text-xs text-muted-foreground mt-2">
                          {notification.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNotification(notification.id)}
                        className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};