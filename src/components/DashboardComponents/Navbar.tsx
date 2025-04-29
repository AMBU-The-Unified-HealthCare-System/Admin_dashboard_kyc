
import { FaBell } from 'react-icons/fa'

function Navbar() {
  return (
    <nav>
    <div className="flex items-center justify-end px-6 py-3 shadow-sm h-14 ">
      <div className="relative m-4 mr-8 cursor-pointer">
        <FaBell className="text-gray-500 h-5" />
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-green-500"></span>
      </div>

      <span className="mr-4 text-gray-500  font-medium">Adithya</span>
      <img
        src="/download.jpg"
        alt="profile"
        className="w-7 h-7 rounded-full object-cover cursor-pointer"
      />
    </div>
  </nav>
  )
}

export default Navbar