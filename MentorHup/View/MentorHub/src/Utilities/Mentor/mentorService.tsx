import axios from 'axios';
import urlMentor from './urlMentor';

interface MentorApiResponse {
  items?: any[];
  data?: any[];
  totalCount?: number;
  total?: number;
  totalPages?: number;
  totalItemsCount?: number; // Add this field
  itemsFrom?: number;
  itemsTo?: number;
}

class MentorService {
  private getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }

  async getMentors(pageNumber: number = 1, pageSize: number = 5, token: string): Promise<{
    mentors: any[];
    totalItems: number;
    totalPages: number;
    success: boolean;
    error?: string;
  }> {
    try {
      const apiUrl = urlMentor.GET_ALL_MENTORS;

      // Validate and provide fallback URL
      const validApiUrl = apiUrl || (import.meta.env.MODE === "development"
        ? "/api/mentors"
        : "https://mentor-hub.runasp.net/api/mentors");

      console.log('🔍 MentorService: Environment mode:', import.meta.env.MODE);
      console.log('🔍 MentorService: API URL from config:', apiUrl);
      console.log('🔍 MentorService: Using API URL:', validApiUrl);

      // Validate URL before constructing
      if (!validApiUrl || typeof validApiUrl !== 'string') {
        throw new Error(`Invalid API URL: ${validApiUrl}`);
      }

      const url = new URL(validApiUrl);

      url.searchParams.append('PageNumber', pageNumber.toString());
      url.searchParams.append('PageSize', pageSize.toString());

      console.log('🔍 MentorService: Making request to:', url.toString());

      const response = await axios.get(url.toString(), {
        headers: this.getAuthHeaders(token),
        timeout: 10000, // 10 second timeout
      });

      console.log('🔍 MentorService: Response received:', {
        status: response.status,
        dataType: typeof response.data,
        hasItems: response.data?.items !== undefined,
        hasData: response.data?.data !== undefined,
        isArray: Array.isArray(response.data)
      });

      if (!response.data) {
        throw new Error('Empty response from server');
      }

      const data = response.data as MentorApiResponse;

      let mentors: any[] = [];
      let totalItems = 0;
      let totalPages = 0;

      // Handle different response structures
      if (data.items && Array.isArray(data.items)) {
        // Current API response structure
        mentors = data.items;
        totalItems = data.totalItemsCount || data.totalCount || data.total || mentors.length;
        totalPages = data.totalPages || Math.ceil(totalItems / pageSize);
      } else if (data.data && Array.isArray(data.data)) {
        // Another possible structure
        mentors = data.data;
        totalItems = data.totalCount || data.total || mentors.length;
        totalPages = data.totalPages || Math.ceil(totalItems / pageSize);
      } else if (Array.isArray(data)) {
        // Fallback for non-paginated response
        mentors = data;
        totalItems = mentors.length;
        totalPages = Math.ceil(totalItems / pageSize);
      } else {
        console.warn('Unexpected response structure:', data);
        mentors = [];
        totalItems = 0;
        totalPages = 0;
      }

      // Validate and clean mentor data
      const validMentors = mentors
        .filter((mentor: any) => {
          return mentor &&
                 typeof mentor.id === 'number' &&
                 typeof mentor.name === 'string' &&
                 typeof mentor.field === 'string';
        })
        .map((mentor: any) => ({
          ...mentor,
          experience: mentor.experiences || mentor.experience || 0,
          reviewCount: mentor.reviewCount || 0,
          availabilities: mentor.availabilities || [],
          userName: mentor.userName || mentor.name || mentor.email || `user${mentor.id}`
        }));

      return {
        mentors: validMentors,
        totalItems,
        totalPages,
        success: true
      };

    } catch (error: any) {
      console.error('❌ MentorService: Error fetching mentors:', error);

      let errorMessage = 'Unknown error occurred';

      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        switch (status) {
          case 401:
            errorMessage = 'Authentication failed - please log in again';
            break;
          case 403:
            errorMessage = 'Access denied - insufficient permissions';
            break;
          case 404:
            errorMessage = 'Mentors endpoint not found';
            break;
          case 500:
            errorMessage = 'Server error - please try again later';
            break;
          default:
            errorMessage = `Server error (${status}) - please try again`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error - please check your connection';
      } else {
        // Request setup error
        errorMessage = error.message || 'Request failed';
      }

      return {
        mentors: [],
        totalItems: 0,
        totalPages: 0,
        success: false,
        error: errorMessage
      };
    }
  }

  // Test method to verify API connectivity
  async testApiConnection(token: string): Promise<{
    success: boolean;
    error?: string;
    responseTime?: number;
    responseSize?: number;
  }> {
    const startTime = Date.now();

    try {
      const apiUrl = urlMentor.GET_ALL_MENTORS;

      // Validate and provide fallback URL
      const validApiUrl = apiUrl || (import.meta.env.MODE === "development"
        ? "/api/mentors"
        : "https://mentor-hub.runasp.net/api/mentors");

      console.log('🔍 MentorService: Testing API connection URL:', validApiUrl);

      // Validate URL before constructing
      if (!validApiUrl || typeof validApiUrl !== 'string') {
        throw new Error(`Invalid API URL: ${validApiUrl}`);
      }

      const url = new URL(validApiUrl);
      url.searchParams.append('PageNumber', '1');
      url.searchParams.append('PageSize', '1');

      console.log('🔍 MentorService: Testing API connection to:', url.toString());

      const response = await axios.get(url.toString(), {
        headers: this.getAuthHeaders(token),
        timeout: 5000,
      });

      const responseTime = Date.now() - startTime;
      const responseSize = JSON.stringify(response.data).length;

      console.log('✅ MentorService: API test successful:', {
        responseTime,
        responseSize,
        status: response.status
      });

      return {
        success: true,
        responseTime,
        responseSize
      };

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      console.error('❌ MentorService: API test failed:', error);

      return {
        success: false,
        error: error.message || 'Unknown error',
        responseTime
      };
    }
  }
}

export const mentorService = new MentorService();
export default mentorService;
