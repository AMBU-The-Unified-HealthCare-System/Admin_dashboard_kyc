import { ChartData, ChartOptions } from "chart.js";

export const chartData: ChartData<"line"> = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],

  datasets: [
    {
      label: "Approved",
      data: [30, 20, 40, 35, 70, 90, 50, 45, 40, 60, 75, 85],
      borderColor: "#22c55e",
      backgroundColor: " rgba(144, 238, 144, 0.1)",
      tension: 0.5,
      fill: true,
    },
    {
      label: "Pending",
      data: [20, 25, 30, 45, 50, 40, 55, 60, 65, 70, 60, 50],
      borderColor: "#facc15",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      tension: 0.5,
      fill: true,
    },
    {
      label: "Decline",
      data: [25, 20, 15, 30, 35, 20, 40, 35, 30, 25, 20, 15],
      borderColor: "#ef4444",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      tension: 0.5,
      fill: true,
    },
  ],
};

export const chartOptions: ChartOptions<'line'> = {
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
        display:false,
      },

    },
  }
};

