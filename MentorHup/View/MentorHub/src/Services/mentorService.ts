// src/Services/mentorService.ts

const API_BASE_URL = 'https://mentor-hub.runasp.net/api';

interface ApiResponse {
  items?: any[];
  totalCount?: number;
  total?: number;
  totalItemsCount?: number;
  totalPages?: number;
  itemsFrom?: number;
  itemsTo?: number;
  currentPage?: number;
  pageSize?: number;
}

interface MentorServiceResponse {
  success: boolean;
  mentors?: any[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  itemsFrom?: number;
  itemsTo?: number;
  error?: string;
}

export interface MentorFilters {
  skillName?: string;
  experiences?: number;
  field?: string;
  minPrice?: number;
  maxPrice?: number;
}

class MentorService {
  async getMentors(
    pageNumber: number, 
    pageSize: number, 
    token: string,
    filters?: MentorFilters
  ): Promise<MentorServiceResponse> {
    try {
      console.log('🔧 MentorService: Making API request...', { 
        pageNumber, 
        pageSize,
        filters
      });
      
      // Build query parameters
      const params = new URLSearchParams({
        PageNumber: pageNumber.toString(),
        PageSize: pageSize.toString(),
        ...(filters?.skillName && { SkillName: filters.skillName }),
        ...(filters?.experiences && { Experiences: filters.experiences.toString() }),
        ...(filters?.field && { Field: filters.field }),
        ...(filters?.minPrice && { MinPrice: filters.minPrice.toString() }),
        ...(filters?.maxPrice && { MaxPrice: filters.maxPrice.toString() })
      });
      
      const url = `${API_BASE_URL}/mentors?${params.toString()}`;
      console.log('🔧 MentorService: Request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('🔧 MentorService: Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔧 MentorService: HTTP error:', response.status, errorText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          mentors: [],
          totalItems: 0,
          totalPages: 0,
        };
      }

      const data: ApiResponse = await response.json();
      console.log('🔧 MentorService: Raw API data:', data);

      // Handle different response formats
      let items = [];
      let totalCount = 0;
      let totalPagesFromApi = 0;
      let itemsFrom = 0;
      let itemsTo = 0;

      if (Array.isArray(data)) {
        // API returns array directly
        items = data;
        totalCount = data.length;
      } else if (data.items && Array.isArray(data.items)) {
        // API returns paginated response with items property
        items = data.items;
        totalCount = data.totalCount || data.total || data.totalItemsCount || items.length;
        totalPagesFromApi = data.totalPages || Math.ceil(totalCount / pageSize);
        itemsFrom = data.itemsFrom || 0;
        itemsTo = data.itemsTo || items.length;
      } else if (data.totalItemsCount && data.totalPages) {
        // API returns response with totalItemsCount, totalPages, itemsFrom, itemsTo
        items = data.items || [];
        totalCount = data.totalItemsCount;
        totalPagesFromApi = data.totalPages;
        itemsFrom = data.itemsFrom || 0;
        itemsTo = data.itemsTo || items.length;
      } else {
        // Fallback
        items = [];
        totalCount = 0;
      }

      const totalPages = totalPagesFromApi || Math.ceil(totalCount / pageSize);

      return {
        success: true,
        mentors: items,
        totalItems: totalCount,
        totalPages,
        currentPage: pageNumber,
        itemsFrom: itemsFrom,
        itemsTo: itemsTo,
      };

    } catch (error: any) {
      console.error('🔧 MentorService: Fetch error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred',
        mentors: [],
        totalItems: 0,
        totalPages: 0,
      };
    }
  }

  async getMentorsWithParams(params: any, token: string): Promise<MentorServiceResponse> {
    try {
      console.log('🔧 MentorService: Making API request with custom params...', params);

      let url = `${API_BASE_URL}/mentors`;
      const queryParams = new URLSearchParams();

      // Add parameters based on what's provided
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      console.log('🔧 MentorService: Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('🔧 MentorService: Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔧 MentorService: HTTP error:', response.status, errorText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          mentors: [],
          totalItems: 0,
          totalPages: 0,
        };
      }

      const data: ApiResponse = await response.json();
      console.log('🔧 MentorService: Raw API data:', data);

      // Handle different response formats
      let items = [];
      let totalCount = 0;

      if (Array.isArray(data)) {
        // API returns array directly
        items = data;
        totalCount = data.length;
      } else if (data.items && Array.isArray(data.items)) {
        // API returns paginated response with items property
        items = data.items;
        totalCount = data.totalCount || data.total || items.length;
      } else {
        // Fallback
        items = [];
        totalCount = 0;
      }

      return {
        success: true,
        mentors: items,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / (params.pageSize || params.PageSize || 10)),
        currentPage: params.page || params.PageNumber || 1,
      };

    } catch (error: any) {
      console.error('🔧 MentorService: Fetch error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred',
        mentors: [],
        totalItems: 0,
        totalPages: 0,
      };
    }
  }

  async getAllMentors(token: string): Promise<MentorServiceResponse> {
    try {
      console.log('🔧 MentorService: Fetching all mentors without pagination...');

      const url = `${API_BASE_URL}/mentors`;
      console.log('🔧 MentorService: Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('🔧 MentorService: Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔧 MentorService: HTTP error:', response.status, errorText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          mentors: [],
          totalItems: 0,
          totalPages: 0,
        };
      }

      const data: ApiResponse = await response.json();
      console.log('🔧 MentorService: Raw API data:', data);

      // Handle different response formats
      let items = [];

      if (Array.isArray(data)) {
        // API returns array directly
        items = data;
      } else if (data.items && Array.isArray(data.items)) {
        // API returns paginated response with items property
        items = data.items;
      }

      return {
        success: true,
        mentors: items,
        totalItems: items.length,
        totalPages: 1,
        currentPage: 1,
      };

    } catch (error: any) {
      console.error('🔧 MentorService: Fetch error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred',
        mentors: [],
        totalItems: 0,
        totalPages: 0,
      };
    }
  }

  async testApiConnection(token: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      console.log('🔧 MentorService: Testing API connection...');

      const url = `${API_BASE_URL}/mentors`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return {
          success: true,
          message: 'API connection successful'
        };
      } else {
        return {
          success: false,
          error: `API connection failed: HTTP ${response.status}`
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: `API connection failed: ${error.message}`
      };
    }
  }
}

// Export the MentorFilters interface
export interface MentorFilters {
  skillName?: string;
  experiences?: number;
  field?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Create and export a singleton instance
const mentorService = new MentorService();
export default mentorService;