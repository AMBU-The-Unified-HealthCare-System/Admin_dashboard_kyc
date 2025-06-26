import { LayoutDashboard, UsersRound } from "lucide-react";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [kyc , setkyc] = useState(false);
  const location = useLocation();

  return (
    <div className="w-56 min-w-[14rem] h-screen border-r border-gray-200 flex-shrink-0 overflow-y-auto">
      {/* dashboard */}

      <Link
        to="/dashboard"
        className={`flex gap-3 items-center mt-14 cursor-pointer pl-2 p-4 
        ${
          location.pathname === "/dashboard"
            ? "bg-gray-100  text-red-500"
            : "text-black"
        } `}
      >
        <LayoutDashboard size={17}
          className={`${
            location.pathname === "/dashboard"
              ? "text-red-500  "
              : "text-black"
          } text-black font-normal`}
        />

        <h4 className="font-normal text-nowrap">Dashboard</h4>
      </Link>

      {/* rakshaks - login details */}

      <Link
        to="/dashboard/logindetails"
        className={`flex gap-3 items-center cursor-pointer pl-2 p-4 hover:bg-gray-100
        ${
          location.pathname === "/dashboard/logindetails"
            ? "bg-gray-100  text-red-500"
            : "text-black"
        } `}
      >
        <UsersRound size={17} />
        <h4 className="font-normal text-nowrap">Rakshaks</h4>
      </Link>

      {/* vehicle details */}

      <Link
        to="/dashboard/vehicledetails"
        className={`flex gap-3 items-center cursor-pointer pl-2 p-4 hover:bg-gray-100
        ${
          location.pathname === "/dashboard/vehicledetails"
            ? "bg-gray-100  text-red-500"
            : "text-black"
        } `}
      >
        <UsersRound size={17} />
        <h4 className="font-normal text-nowrap">Vehicle Details</h4>
      </Link>

     {/* kyc details */}

     <div className="mt-2">

      <div className="flex items-center justify-between pl-2 pr-2 p-4 cursor-pointer text-black hover:bg-gray-100" 
      onClick={()=>setkyc(!kyc)}>

        <div className="flex items-center gap-3">

          <UsersRound size={17}/>
          <h4 className="font-normal text-nowrap">KYC Details</h4>

        </div>
        <IoIosArrowDown className={`transition-transform ${kyc ? 'rotate-180' : ''}`} />

      </div>

      {kyc && (
          <div className="mt-2 space-y-2">
            <Link
              to="/dashboard/pending"
              className={`flex gap-3 items-center hover:bg-gray-100 cursor-pointer pl-8 p-4 
        ${
          location.pathname === "/dashboard/pending"
            ? "bg-gray-100  text-red-500"
            : "text-black"
        } `}
            >
              <h4 className="font-normal text-nowrap">Pending</h4>
            </Link>
          </div>
        )}
      {kyc && (
          <div className="space-y-2">
            <Link
              to="/dashboard/approved"
              className={`flex gap-3 items-center hover:bg-gray-100 cursor-pointer pl-8 p-4 
        ${
          location.pathname === "/dashboard/approved"
            ? "bg-gray-100  text-red-500"
            : "text-black"
        } `}
            >
              <h4 className="font-normal text-nowrap">Approved</h4>
            </Link>
          </div>
        )}
      {kyc && (
          <div className="space-y-2">
            <Link
              to="/dashboard/hold"
              className={`flex gap-3 items-center hover:bg-gray-100 cursor-pointer pl-8 p-4 
        ${
          location.pathname === "/dashboard/hold"
            ? "bg-gray-100  text-red-500"
            : "text-black"
        } `}
            >
              <h4 className="font-normal text-nowrap">Hold</h4>
            </Link>
          </div>
        )}

     </div>

    </div>
  );
};

export default Sidebar;
