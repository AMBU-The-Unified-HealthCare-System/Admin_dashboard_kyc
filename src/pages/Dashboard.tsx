import React from 'react';
import Chart from '../components/DashboardComponents/Chart';

interface DashboardStats {
  totalVerifiedUsers?: number;
  totalFailedVerification?: number;
  totalPendingVerification?: number;
  totalUsers?: number;
  totalApprovedVerification?: number;
  totalDeclinedVerification?: number;
  totalLoginDrivers?: number;
}

interface StatCardProps {
  title: string;
  value?: number;
  bgColor: string;
  loading: boolean;
}

const useDashboardStats = () => {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL = 'http://localhost:3000';
      
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch dashboard statistics');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Dashboard stats fetch error:', err);
      
      // Mock data for demo purposes (remove in production)
      setStats({
        totalApprovedVerification: 752,
        totalDeclinedVerification: 196,
        totalPendingVerification: 552,
        totalLoginDrivers: 1500
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};

// Loading component
const StatCard: React.FC<StatCardProps> = ({ title, value, bgColor, loading }) => (
  <div className="bg-white w-60 h-20 rounded-md border border-gray-300">
    <div className="flex items-center gap-5 p-3">
      <div className={`w-6 h-6 ${bgColor} rounded-full`}></div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-lg font-semibold">
          {loading ? (
            <span className="animate-pulse bg-gray-200 h-6 w-16 rounded inline-block"></span>
          ) : (
            value?.toLocaleString() || '0'
          )}
        </p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { stats, loading, error, refetch } = useDashboardStats();

  // Auto-refresh every 30 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white w-full h-16 p-4 text-lg border-t border-gray-300 font-medium flex items-center justify-between">
        <span>Overview</span>
        {error && (
          <div className="text-red-500 text-sm">
            <span>Error loading data. </span>
            <button 
              onClick={refetch}
              className="text-blue-500 hover:underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Main Content Container - Centered */}
      <div className="flex flex-col items-center justify-center w-full px-5 py-8">
        
        {/* Stats Cards Grid - Centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 gap-6 mb-8 max-w-6xl w-full justify-items-center">
          <StatCard
            title="Total Approved Verification"
            value={stats?.totalVerifiedUsers}
            bgColor="bg-green-500"
            loading={loading}
          />
          
          <StatCard
            title="Total Declined Verification"
            value={stats?.totalFailedVerification}
            bgColor="bg-red-500"
            loading={loading}
          />
          
          <StatCard
            title="Total Pending Verification"
            value={stats?.totalPendingVerification}
            bgColor="bg-yellow-500"
            loading={loading}
          />
          
          <StatCard
            title="Total Login Drivers"
            value={stats?.totalUsers}
            bgColor="bg-green-300"
            loading={loading}
          />
        </div>

        {/* Chart Section - Centered */}
        <div className="w-full max-w-6xl flex justify-center">
          <Chart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;