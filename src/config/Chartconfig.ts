// api/dashboardAPI.ts
import { ChartData } from "chart.js";

// API Base URL - adjust according to your setup
const API_BASE_URL = 'http://localhost:3000';

export interface DashboardStats {
  totalUsers: number;
  totalPendingVerification: number;
  totalVerifiedUsers: number;
  totalFailedVerification: number;
  totalIncompleteKYC: number;
}

export interface MonthlyKYCData {
  month: string;
  approved: number;
  pending: number;
  declined: number;
  totalLogins: number;
}

export interface ChartDataResponse {
  kycStatusChart: ChartData<'pie'>;
  monthlyTrendsChart: ChartData<'line'>;
  kycComparisonChart: ChartData<'bar'>;
  loginActivityChart: ChartData<'line'>;
}

export interface KYCBreakdown {
  totalUsers: number;
  breakdown: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  year?: number;
}

class DashboardAPI {
  private async fetchAPI<T>(endpoint: string): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: APIResponse<T> = await response.json();
      console.log(data)
      
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.fetchAPI<DashboardStats>('/stats');
    return response.data;
  }

  /**
   * Get monthly KYC trends
   */
  async getMonthlyKYCTrends(year?: number): Promise<{ data: MonthlyKYCData[]; year: number }> {
    const endpoint = year ? `/monthly-trends?year=${year}` : '/monthly-trends';
    const response = await this.fetchAPI<MonthlyKYCData[]>(endpoint);
    return {
      data: response.data,
      year: response.year || new Date().getFullYear()
    };
  }

  /**
   * Get KYC status breakdown
   */
  async getKYCStatusBreakdown(): Promise<KYCBreakdown> {
    const response = await this.fetchAPI<KYCBreakdown>('/kyc-breakdown');
    return response.data;
  }

  /**
   * Get all chart data
   */
  async getChartData(year?: number): Promise<{ data: ChartDataResponse; year: number }> {
    const endpoint = year ? `/chart-data?year=${year}` : '/chart-data';
    const response = await this.fetchAPI<ChartDataResponse>(endpoint);
    return {
      data: response.data,
      year: response.year || new Date().getFullYear()
    };
  }

  /**
   * Get complete dashboard data
   */
  async getCompleteDashboardData(year?: number): Promise<{
    data: {
      stats: DashboardStats;
      charts: ChartDataResponse;
    };
    year: number;
  }> {
    const endpoint = year ? `/complete?year=${year}` : '/complete';
    const response = await this.fetchAPI<{
      stats: DashboardStats;
      charts: ChartDataResponse;
    }>(endpoint);
    return {
      data: response.data,
      year: response.year || new Date().getFullYear()
    };
  }
}

// Export singleton instance
export const dashboardAPI = new DashboardAPI();

// Export individual functions for convenience
export const {
  getDashboardStats,
  getMonthlyKYCTrends,
  getKYCStatusBreakdown,
  getChartData,
  getCompleteDashboardData
} = dashboardAPI;