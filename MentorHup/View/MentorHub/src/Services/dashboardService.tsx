// Dashboard Stats API Service
const API_BASE_URL_PRODUCTION = "https://mentor-hub.runasp.net/api";
const API_BASE_URL_DEV_PROXY = "/api";

// Environment-aware base URL
const getBaseUrl = () => {
  return import.meta.env.MODE === "development" ? API_BASE_URL_DEV_PROXY : API_BASE_URL_PRODUCTION;
};

// Dashboard stats interface
export interface DashboardStats {
  myMentors: number;
  scheduledSessions: number;
  completedSessions: number;
  learningHours: number;
}

// API response interface
interface DashboardStatsResponse {
  myMentors: number;
  scheduledSessions: number;
  completedSessions: number;
  learningHours: number;
}

// Service class for dashboard operations
class DashboardService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getBaseUrl();
  }

  /**
   * Fetch dashboard statistics for mentee
   * @param accessToken - JWT access token for authentication
   * @returns Promise<DashboardStats>
   */
  async getMenteeDashboardStats(accessToken: string): Promise<DashboardStats> {
    try {
      const response = await fetch(`${this.baseUrl}/mentees/dashboard-stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DashboardStatsResponse = await response.json();
      
      return {
        myMentors: data.myMentors,
        scheduledSessions: data.scheduledSessions,
        completedSessions: data.completedSessions,
        learningHours: data.learningHours,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get formatted dashboard stats for display
   * @param stats - Raw dashboard stats
   * @returns Formatted stats with string values
   */
  formatDashboardStats(stats: DashboardStats) {
    return {
      myMentors: stats.myMentors.toString(),
      scheduledSessions: stats.scheduledSessions.toString(),
      completedSessions: stats.completedSessions.toString(),
      learningHours: stats.learningHours.toString(),
    };
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
export default dashboardService;
