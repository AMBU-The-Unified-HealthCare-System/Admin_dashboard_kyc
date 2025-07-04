import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/DashboardComponents/Navbar";
import Sidebar from "../components/DashboardComponents/Sidebar";




export default function Mainlayout() {

  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  
  return (
    <div className=" flex h-screen overflow-hidden">

<div className="w-56 min-w-[14rem] flex-shrink-0 border-r border-gray-200">
    <Sidebar />
  </div>
        

        <div className=" flex flex-col flex-1 overflow-hidden">
            <Navbar/>

            <main className={`flex-1 your-div overflow-auto ${
            isDashboard ? "bg-gray-100" : "bg-white"
          }`}>
                <Outlet/>
            </main>
        </div>
    </div>
  )
}
