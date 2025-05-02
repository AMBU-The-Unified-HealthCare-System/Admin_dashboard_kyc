import Chart from "../components/DashboardComponents/Chart";



const Dashboard=()=> {
  return (
    <>
      <div className="bg-gray-100">
      <div className=" bg-white w-full h-16 p-4 text-lg border-t border-gray-300  font-medium">
        Overview
      </div>

      <div className="grid grid-cols-2 gap-4 2xl:gap-14 2xl:mt-10 p-5 xl:ml-40 2xl:ml-80 ml-20  ">
        {/* box1 */}
        <div className="bg-white w-60 h-20  rounded-md border  border-gray-300  ">
         <div className="flex items-center gap-5 p-3  ">
         <div className="w-6 h-6  bg-green-500 rounded-full"></div>
          <div>
            <p className="text-gray-500 text-sm ">Total Approved Verification</p>
            <p className="text-lg   font-semibold">752</p>
          </div>
         </div>
        </div>
        {/* box2 */}
        <div className="bg-white w-60 h-20  rounded-md border border-gray-300  ">
        <div className="flex items-center gap-5 p-3  ">
         <div className="w-6 h-6  bg-red-500 rounded-full"></div>
          <div>
            <p className="text-gray-500 text-sm">Total Declined Verification</p>
            <p className="text-lg font-semibold">196</p>
          </div>
         </div>
        </div>

        {/* box3 */}
        <div className="bg-white w-60 h-20  rounded-md border  border-gray-300   ">
        <div className="flex items-center gap-5 p-3  ">
         <div className="w-6 h-6  bg-yellow-500 rounded-full"></div>
          <div>
            <p className="text-gray-500 text-sm">Total Pending Verification</p>
            <p className="text-lg font-semibold">552</p>
          </div>
         </div>
        </div>
        {/* box4 */}
        <div className="bg-white w-60 h-20  rounded-md border border-gray-300 ">
        <div className="flex items-center gap-5 p-3  ">
         <div className="w-6 h-6  bg-green-300 rounded-full"></div>
          <div>
            <p className="text-gray-500 text-sm">Total Login Drivers</p>
            <p className="text-lg font-semibold">752</p>
          </div>
         </div>
        </div>
       
      </div>

      <div className="overflow-hidden p-2 w-full your-div ">
      <Chart/>
      </div>

      </div>
          
      
    </>
  );
}

export default Dashboard;
