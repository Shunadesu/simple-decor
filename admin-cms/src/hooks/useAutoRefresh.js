import { useEffect, useRef } from 'react';
import useAuthStore from '../stores/authStore';

const useAutoRefresh = () => {
  const { token, refreshToken, isAuthenticated } = useAuthStore();
  const refreshTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    // Clear existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Set timeout to refresh token 1 hour before expiry (assuming 24h token)
    const refreshTime = 23 * 60 * 60 * 1000; // 23 hours in milliseconds
    
    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        const result = await refreshToken();
        if (!result.success) {
          console.log('Token refresh failed, user will be logged out');
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }, refreshTime);

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [token, isAuthenticated, refreshToken]);

  return null;
};

export default useAutoRefresh; 