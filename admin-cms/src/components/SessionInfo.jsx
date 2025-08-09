import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import useAuthStore from '../stores/authStore';

const SessionInfo = () => {
  const { lastActivity, checkSessionExpiry } = useAuthStore();
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    if (!lastActivity) return;

    const updateTimeRemaining = () => {
      const now = new Date().getTime();
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
      const timeSinceLastActivity = now - lastActivity;
      const remaining = threeDaysInMs - timeSinceLastActivity;

      if (remaining <= 0) {
        setTimeRemaining(0);
        checkSessionExpiry();
      } else {
        setTimeRemaining(remaining);
      }
    };

    // Update immediately
    updateTimeRemaining();

    // Update every minute
    const interval = setInterval(updateTimeRemaining, 60000);

    return () => clearInterval(interval);
  }, [lastActivity, checkSessionExpiry]);

  if (!timeRemaining) return null;

  const formatTime = (ms) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const isWarning = timeRemaining < 24 * 60 * 60 * 1000; // Less than 1 day

  return (
    <div className={`fixed bottom-4 right-4 p-3 rounded-lg shadow-lg z-50 ${
      isWarning ? 'bg-yellow-100 border border-yellow-300' : 'bg-blue-100 border border-blue-300'
    }`}>
      <div className="flex items-center space-x-2">
        {isWarning ? (
          <AlertTriangle size={16} className="text-yellow-600" />
        ) : (
          <Clock size={16} className="text-blue-600" />
        )}
        <span className={`text-sm font-medium ${
          isWarning ? 'text-yellow-800' : 'text-blue-800'
        }`}>
          Session expires in: {formatTime(timeRemaining)}
        </span>
      </div>
    </div>
  );
};

export default SessionInfo; 