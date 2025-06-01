import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import Pagination from "../Logindetails/Pagination";
import Sidemodal from "../Sidemodal";
import { CiEdit } from "react-icons/ci";
import axios from "axios";

// Types
interface Driver {
  _id: string;
  name: string;
  driverId: string;
  email: string;
  phoneNumber: string;
  address: string;
  ambulanceCategory: string;
  vehicleNumber: string;
  model: string;
  submissionDate: string;
  lSubmissionDate: string;
  kSubmissionDate: string;
  v1Status: string;
  v2Status: string;
  status: string;
  isEmailVerified: boolean;
  isPhoneNumberVerified: boolean;
  action: string;
}

interface ApiResponse {
  success: boolean;
  data: Driver[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDrivers: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface DriverDetailsProps {
  searchTerm?: string;
  entriesPerPage?: number;
  selectedDate?: Date | null;
}

const DriverDetails = ({ 
  searchTerm = "", 
  entriesPerPage = 12, 
  selectedDate = null
}: DriverDetailsProps) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    fieldLabel: string;
    fieldValue: string;
  }>({
    isOpen: false,
    fieldLabel: "",
    fieldValue: "",
  });

  const fetchDrivers = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entriesPerPage.toString(),
      });

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      if (selectedDate) {
        params.append('date', selectedDate.toISOString().split('T')[0]);
      }
      
      const response = await axios.get<ApiResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/driver/getDrivers?${params.toString()}`
      );
      
      const result = response.data;
      console.log(result);
      
      if (result.success) {
        setDrivers(result.data);
        setTotalPages(result.pagination.totalPages);
        setCurrentPage(result.pagination.currentPage);
      } else {
        throw new Error('Failed to fetch drivers');
      }
    } catch (err) {
      console.error('Error fetching drivers:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching drivers');
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching drivers');
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage, selectedDate]);

  // Fetch drivers when page or filters change
  useEffect(() => {
    fetchDrivers(currentPage);
  }, [currentPage, searchTerm, entriesPerPage, selectedDate]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openModal = (label: string, value: string) => {
    setModalData({ isOpen: true, fieldLabel: label, fieldValue: value });
  };

  const closeModal = () => {
    setModalData({ ...modalData, isOpen: false });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading drivers...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button 
          onClick={() => fetchDrivers(currentPage)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto p-4 styled-scrollbar your-div">
        <div className="min-w-[2100px] h-[650px]">
          <div className="grid grid-cols-[repeat(11,minmax(150px,1fr))] gap-x-12 font-semibold w-full p-2 rounded-t text-nowrap bg-sky-50">
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

          {drivers.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <span className="text-gray-500">No drivers found</span>
            </div>
          ) : (
            drivers.map((driver) => (
              <div
                key={driver._id}
                className="grid grid-cols-[repeat(11,minmax(150px,1fr))] gap-x-12 text-sm p-3 items-center"
              >
                <div className="truncate" title={driver.name}>{driver.name}</div>
                <div className="text-blue-600 flex gap-1 items-center cursor-pointer">
                  <span className="truncate" title={driver.driverId}>{driver.driverId}</span>
                  {driver.isPhoneNumberVerified && <FaCheckCircle className="text-green-600 flex-shrink-0" />}
                </div>
                <div 
                  className="text-blue-600 flex gap-1 items-center cursor-pointer" 
                  onClick={() => openModal("Email ID", driver.email)}
                >
                  <span className="truncate" title={driver.email}>{driver.email}</span>
                  <CiCircleCheck className={`${driver.isEmailVerified ? "text-green-500" : "text-gray-500"} flex-shrink-0`} size={15} />
                </div>
                <div 
                  className="text-blue-600 flex gap-1 items-center cursor-pointer" 
                  onClick={() => openModal("Address", driver.address)}
                >
                  <span className="truncate" title={driver.address}>{driver.address}</span>
                  <CiCircleCheck className="text-gray-500 flex-shrink-0" size={15} />
                </div>
                <div className="text-blue-600 flex gap-5 items-center">
                  <span className="truncate" title={driver.ambulanceCategory}>{driver.ambulanceCategory}</span>
                  <CiCircleCheck className="text-gray-500 flex-shrink-0" size={15} /> 
                  <CiEdit className="text-black cursor-pointer flex-shrink-0" />
                </div>
                <div className="truncate" title={driver.submissionDate}>{driver.submissionDate}</div>
                <div className="truncate" title={driver.lSubmissionDate}>{driver.lSubmissionDate}</div>
                <div className="truncate" title={driver.kSubmissionDate}>{driver.kSubmissionDate}</div>
                <div className="text-orange-400 border border-amber-500 rounded-md text-center w-fit text-xs p-0.5 px-2 bg-red-50 truncate" title={driver.v1Status}>
                  {driver.v1Status}
                </div>
                <div className="text-orange-400 border border-amber-500 rounded-md text-center w-fit text-xs p-0.5 px-2 bg-red-50 truncate" title={driver.v2Status}>
                  {driver.v2Status}
                </div>
                <div className="text-blue-600 cursor-pointer hover:underline truncate" title={driver.action}>
                  {driver.action}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-center lg:ml-40 xl:ml-[40rem] 2xl:ml-[70rem]">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <Sidemodal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        fieldLabel={modalData.fieldLabel}
        fieldValue={modalData.fieldValue}
        driverName=""
      />
    </>
  );
};

export default DriverDetails;