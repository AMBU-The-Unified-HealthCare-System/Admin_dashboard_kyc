import { LayoutDashboard, UsersRound } from "lucide-react";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [driverdatails, setdriverdetails] = useState(false);
  const [kyc , setkyc] = useState(false);
  const location = useLocation();

  return (
    <div className="w-56 h-screen  shadow-md      ">
      {/* dashboard */}

      <Link
        to="/dashboard"
        className={`flex gap-3 items-center  mt-14  cursor-pointer pl-2 p-4 
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

        <h4 className="font-normal">Dashboard</h4>
      </Link>

      {/* driver details */}

      <div className="">
        <div
          className="flex items-center justify-between p-2 cursor-pointer text-black 
         
         "
          onClick={() => setdriverdetails(!driverdatails)}
        >
          <div className="flex place-items-center gap-3">
            <UsersRound size={17} />
            <h4 className="font-normal">Driver Details</h4>
          </div>

          <IoIosArrowDown
            className={`transition-transform ${
              driverdatails ? "rotate-180" : ""
            }`}
          />
        </div>

        {driverdatails && (
          <div className="  space-y-2">
            <Link
              to="/dashboard/logindetails"
              className={`flex gap-3 items-center cursor-pointer p-4  hover:bg-gray-100
        ${
          location.pathname === "/dashboard/logindetails"
            ? "bg-gray-100  text-red-500"
            : "text-black"
        } `}
            >
              <h4 className="ml-6"> Login Details</h4>
            </Link>
          </div>
        )}
      </div>

     {/* kyc details */}

     <div className="mt-2">

      <div className="flex items-center justify-between p-2 cursor-pointer text-black " 
      onClick={()=>setkyc(!kyc)}>

        <div className="flex items-center gap-3">

          <UsersRound size={17}/>
          <h4>KYC Details</h4>

        </div>
        <IoIosArrowDown className={`transition-transform ${kyc ? 'rotate-180' : ''}`} />

      </div>

      {kyc && (
          <div className=" mt-2 space-y-2">
            <Link
              to="/dashboard/pending"
              className={`flex gap-3 items-center    hover:bg-gray-100 cursor-pointer p-4 
        ${
          location.pathname === "/dashboard/pending"
            ? "bg-gray-100  text-red-500"
            : "text-black"
        } `}
            >
              <h4 className="ml-6">Pending</h4>
            </Link>
          </div>
        )}
      {kyc && (
          <div className="  space-y-2">
            <Link
              to="/dashboard/approved"
              className={`flex gap-3 items-center  hover:bg-gray-100    cursor-pointer p-4 
        ${
          location.pathname === "/dashboard/approved"
            ? "bg-gray-100  text-red-500"
            : "text-black"
        } `}
            >
              <h4 className="ml-6">Approved</h4>
            </Link>
          </div>
        )}
      {kyc && (
          <div className="  space-y-2">
            <Link
              to="/dashboard/hold"
              className={`flex gap-3 items-center  hover:bg-gray-100    cursor-pointer p-4 
        ${
          location.pathname === "/dashboard/hold"
            ? "bg-gray-100  text-red-500"
            : "text-black"
        } `}
            >
              <h4 className="ml-6">Hold</h4>
            </Link>
          </div>
        )}

     </div>

    </div>
  );
};

export default Sidebar;
