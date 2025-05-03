import { drivers } from "../../config/driverData";
import { FaCheckCircle } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import Pagination from "../Logindetails/Pagination";
import { useState } from "react";

const DriverDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const driversDetailsPerPage = 12;
  const totalPages = Math.ceil(drivers.length / driversDetailsPerPage);

  const startidx = (currentPage - 1) * driversDetailsPerPage;
  const currentDrivers = drivers.slice(startidx, startidx + driversDetailsPerPage); // show only 10 drivers

  return (

    <>
    <div className="overflow-x-auto p-4 styled-scrollbar  your-div">
    <div className="min-w-[2100px] h-[650px]  ">                                    
      <div className="grid grid-cols-[repeat(11,minmax(150px,1fr))] gap-x-12  font-semibold  w-full p-2 rounded-t text-nowrap bg-sky-50 ">
        <div>Driver Name</div>
        <div>Driver ID</div>
        <div>Email ID</div>
        <div>Address</div>
        <div>Ambulance Category</div>
        <div>Submission Date & Time</div>
        <div>L-Submission Date</div>
        <div>K-Submission Date</div>
        <div>V1 Status</div>
        <div>V2 Status</div>
        <div>Action</div>
      </div>

      {currentDrivers.map((driver, index) => (
        <div
          key={index}
          className="grid grid-cols-[repeat(11,minmax(150px,1fr))] gap-x-12  text-sm  p-3 items-center text-nowrap"
        >
          <div>{driver.name}</div>
          <div className="text-blue-600 flex gap-1 items-center">{driver.driverId} <FaCheckCircle className="text-green-600" /></div>
          <div className="text-blue-600 flex gap-1 items-center">{driver.email} <CiCircleCheck className="text-gray-500" size={15} />  </div> 
          <div className="text-blue-600 flex gap-1 items-center">{driver.address}  <CiCircleCheck className="text-gray-500" size={15} /> </div>
          <div className="text-blue-600 flex gap-5 items-center">{driver.ambulanceCategory} <CiCircleCheck className="text-gray-500" size={15} /></div>
          <div>{driver.submissionDate}</div>
          <div>{driver.lSubmissionDate}</div>
          <div>{driver.kSubmissionDate}</div>
          <div className="text-orange-400 border border-amber-500 rounded-md text-center w-16 p-0.5 bg-red-50">{driver.v1Status}</div>
          <div className="text-orange-400 border border-amber-500 rounded-md text-center w-16 p-0.5 bg-red-50">{driver.v2Status}</div>
          <div className="text-blue-600 cursor-pointer hover:underline">
            {driver.action}</div>
        </div>
      ))}

    </div>
    
  </div>

  <div className="flex justify-center lg:ml-40 xl:ml-[40rem]  2xl:ml-[70rem]  ">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          
        />
      </div>

  </>

  
  );
};

export default DriverDetails;
