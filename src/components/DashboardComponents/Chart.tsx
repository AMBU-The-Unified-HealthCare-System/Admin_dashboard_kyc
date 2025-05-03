import { Line } from "react-chartjs-2";
import { chartData, chartOptions } from "../../config/Chartconfig";

const Chart = () => {
  return (
    <div className="bg-white p-4  rounded-md shadow-sm h-100 2xl:h-[500px] xl:w-[950px] 2xl:w-[1600px] 2xl:mt-24 overflow-hidden  xl:ml-6      ">
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
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-300 rounded-full"></span>
            <span className="text-sm font-medium">Total Login Drivers</span>
          </div>
          <select className="text-sm px-2 py-1 rounded ">
            <option>Year</option>
            <option>Month</option>
            <option>Day</option>
          </select>
        </div>
      </div>

      {/* Responsive Chart Container */}
      <div className=" h-10/11   py-4 px-4   ">
        <Line data={chartData} options={chartOptions} className="h-full w-full"/>
      </div>
    </div>
  );
};

export default Chart;
