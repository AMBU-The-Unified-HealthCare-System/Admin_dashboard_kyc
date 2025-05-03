import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pendingkyc from "../components/PendingDetails/Pendingkyc";

const Pending = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState(3);
  // const [date, setDate] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleFilter = () => {
    console.log("Filter clicked:", { searchTerm, entries, selectedDate });
  };

  const handleExport = () => {
    console.log("Exporting report...");
  };

  return (
    <div className="overflow-hidden ">
      <div className=" bg-white w-full h-16 p-5 text-lg border border-gray-300 mt-5 ml-5 font-medium">
        Pending Verification
      </div>

      {/* filter  */}

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-md  ">
        {/* Search */}
        <div className="flex  items-center gap-3  border-gray-300  rounded px-2">
          <div className="flex border border-gray-300 rounded  ">
            <input
              type="text"
              placeholder="Search by driver name or ID"
              className="outline-none p-2 w-52 text-sm "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="text-gray-500 text-sm px-1  rounded  cursor-pointer">
              <CiSearch size={20} />
            </button>
          </div>

          {/* Entries selector */}
          <div className="flex items-center gap-2 ">
            <span className="text-sm text-gray-500">Show</span>
            <input
              type="number"
              value={entries}
              onChange={(e) => setEntries(parseInt(e.target.value))}
              className="w-12 border rounded px-1 py-0.5 text-sm text-gray-500"
            />
            <span className="text-sm text-gray-500">entries per page</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          {/* Date picker */}
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            placeholderText="Select date"
            dateFormat="dd/MM/yyyy"
            className="border rounded px-2 py-1 text-sm text-gray-700 w-40"
          />
          <button
            onClick={handleFilter}
            className="bg-white border px-4 py-1 rounded text-sm"
          >
            Filter
          </button>
          <button
            onClick={handleExport}
            className="bg-red-500 text-white px-4 py-1 rounded text-sm cursor-pointer"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Table */}
      <Pendingkyc/>

     

    </div>
  );
};

export default Pending;
