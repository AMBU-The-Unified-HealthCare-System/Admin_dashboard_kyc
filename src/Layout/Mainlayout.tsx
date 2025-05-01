import { Outlet } from "react-router-dom";
import Navbar from "../components/DashboardComponents/Navbar";
import Sidebar from "../components/DashboardComponents/Sidebar";


export default function Mainlayout() {
  return (
    <div className=" flex h-screen">
        <Sidebar/>

        <div className=" flex flex-col flex-1">
            <Navbar/>

            <main className="flex-1   overflow-auto bg-gray-100">
                <Outlet/>
            </main>
        </div>
    </div>
  )
}
