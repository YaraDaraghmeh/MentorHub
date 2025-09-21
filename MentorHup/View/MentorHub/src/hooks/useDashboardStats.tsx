import { useState, useEffect } from 'react';
import { dashboardService, type DashboardStats } from '../Services/dashboardService';
import { useAuth } from '../Context/AuthContext';

interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for managing dashboard statistics
 * Automatically fetches data when the component mounts and when auth changes
 */
export const useDashboardStats = (): UseDashboardStatsReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, isAuthenticated, roles } = useAuth();

  const fetchStats = async () => {
    if (!accessToken || !isAuthenticated || roles !== 'Mentee') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const dashboardStats = await dashboardService.getMenteeDashboardStats(accessToken);
      setStats(dashboardStats);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard statistics');
      
      // Set default values on error to prevent UI breaking
      setStats({
        myMentors: 0,
        scheduledSessions: 0,
        completedSessions: 0,
        learningHours: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats when component mounts or auth changes
  useEffect(() => {
    fetchStats();
  }, [accessToken, isAuthenticated, roles]);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refetch,
  };
};
