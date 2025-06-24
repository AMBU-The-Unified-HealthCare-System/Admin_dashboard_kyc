import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import LoginDetails from './pages/LoginDetails'
import VehicleDetails from './pages/VehicleDetails'
import Pending from './pages/Pending'
import Approved from './pages/Approved'
import Hold from './pages/Hold'
import Mainlayout from './Layout/Mainlayout'
import AdminLogin from './pages/DashboardLogin'


function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element:<AdminLogin/>
    },

    {
      path:"/",
      element:<Mainlayout/>,
      children:[
        {path:"/dashboard", element:<Dashboard/>},
        {path:"/dashboard/logindetails", element:<LoginDetails/>},
        {path:"/dashboard/vehicledetails", element:<VehicleDetails/>},
        {path:"/dashboard/pending", element:<Pending/>},
        {path:"/dashboard/approved", element:<Approved/>},
        {path:"/dashboard/hold", element:<Hold/>},
      ],
    },
   
  ]);
 

  return (
   <RouterProvider router={router}/>
  )
}

export default App
