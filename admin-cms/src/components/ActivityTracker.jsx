import { useEffect } from 'react';
import useAuthStore from '../stores/authStore';

const ActivityTracker = () => {
  const { updateActivity, checkSessionExpiry, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Update activity on user interactions
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    // Check session expiry every minute
    const sessionCheckInterval = setInterval(() => {
      const isExpired = checkSessionExpiry();
      if (isExpired) {
        console.log('Session expired due to inactivity');
      }
    }, 60000); // Check every minute

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initial activity update
    updateActivity();

    return () => {
      // Cleanup
      clearInterval(sessionCheckInterval);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [isAuthenticated, updateActivity, checkSessionExpiry]);

  return null; // This component doesn't render anything
};

export default ActivityTracker; 