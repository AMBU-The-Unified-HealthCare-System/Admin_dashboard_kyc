import { Pendingkyc } from "../../config/pendingdata";
import { CiCircleCheck } from "react-icons/ci";
import Pagination from "../Logindetails/Pagination";
import { useState } from "react";
import { FaEye } from "react-icons/fa";

const DriverDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pendingdetails = 12;
  const totalPages = Math.ceil(Pendingkyc.length / pendingdetails);

  const startidx = (currentPage - 1) * pendingdetails;
  const PendingKyc = Pendingkyc.slice(startidx, startidx + pendingdetails); // show only 10 drivers

  return (

    <>
    <div className="overflow-x-auto p-4 styled-scrollbar  your-div">
    <div className="min-w-[2100px] h-[650px]  ">                                    
      <div className="grid grid-cols-[repeat(11,minmax(150px,1fr))] gap-x-12  font-semibold  w-full p-2 rounded-t text-nowrap bg-sky-50 ">
        <div>Driver Name</div>
        <div>Aadhar ID</div>
        <div>PAN ID</div>
        <div>DL Number</div>
        <div>License ID</div>
        <div>Bank Account</div>
        <div>Registration Cert..</div>
        <div>Vehicle Number</div>
        <div>Document</div>
        <div>V2 Status</div>
        <div>Action</div>
      </div>

      {PendingKyc.map((Pendingkyc, index) => (
        <div
          key={index}
          className="grid grid-cols-[repeat(11,minmax(150px,1fr))] gap-x-12  text-sm  p-3 items-center text-nowrap"
        >
          <div>{Pendingkyc.name}</div>
          <div className="text-blue-600 flex gap-1 items-center">{Pendingkyc.aadharId} <CiCircleCheck className="text-gray-500" size={15} />  </div>
          <div className="text-blue-600 flex gap-1 items-center">{Pendingkyc.panId} <CiCircleCheck className="text-gray-500" size={15} />  </div> 
          <div className="text-blue-600 flex gap-1 items-center">{Pendingkyc.Dlnumber}  <CiCircleCheck className="text-gray-500" size={15} /> </div>
          <div className="text-blue-600 flex gap-5 items-center">{Pendingkyc.LicenseId} <CiCircleCheck className="text-gray-500" size={15} /></div>
          <div className="flex gap-4 items-center cursor-pointer">{Pendingkyc.BankAccount}<FaEye  /></div>
          <div className="text-blue-600 flex gap-7 items-center cursor-pointer">{Pendingkyc.RegistrationCert} <FaEye className="text-black"  /></div>
          <div>{Pendingkyc.VehicleNumber}</div>
          <div className="text-orange-400 border border-amber-500 rounded-md text-center w-16 p-0.5 bg-red-50 cursor-pointer">{Pendingkyc.Document}</div>
          <div className="text-orange-400 border border-amber-500 rounded-md text-center w-16 p-0.5 bg-red-50">{Pendingkyc.V2Status}</div>
          <div className="text-blue-600 cursor-pointer hover:underline">
            {Pendingkyc.action}</div>
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
