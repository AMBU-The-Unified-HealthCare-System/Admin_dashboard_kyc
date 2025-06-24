import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js";
import { dashboardAPI } from '../../config/Chartconfig'; 

const Chart = () => {
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Chart options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    }
  };

  // Fetch chart data from backend
  const fetchChartData = async (year: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await dashboardAPI.getChartData(year);
      console.log(result)
      setChartData(result.data.monthlyTrendsChart);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when year changes
  useEffect(() => {
    fetchChartData(selectedYear);
  }, [selectedYear]);

  // Handle year selection change
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(event.target.value);
    setSelectedYear(year);
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear; year >= currentYear - 5; year--) {
    yearOptions.push(year);
  }

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm h-100 2xl:h-[500px] xl:w-[950px] 2xl:w-[1600px] 2xl:mt-24 overflow-hidden xl:ml-6">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm h-100 2xl:h-[500px] xl:w-[950px] 2xl:w-[1600px] 2xl:mt-24 overflow-hidden xl:ml-6">
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-sm h-100 2xl:h-[500px] xl:w-[950px] 2xl:w-[1600px] 2xl:mt-24 overflow-hidden xl:ml-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-lg font-semibold">Verification</h2>

        <div className="flex flex-wrap gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500 rounded-full"></span>
            <span className="text-sm font-medium">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-400 rounded-full"></span>
            <span className="text-sm font-medium">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500 rounded-full"></span>
            <span className="text-sm font-medium">Decline</span>
          </div>
          <select 
            className="text-sm px-2 py-1 rounded border"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-10/11 py-4 px-4">
        {chartData ? (
          <Line data={chartData} options={chartOptions} className="h-full w-full" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">No chart data available</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;