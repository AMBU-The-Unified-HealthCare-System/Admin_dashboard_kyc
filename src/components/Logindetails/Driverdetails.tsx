import { useEffect, useState, useRef } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
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
  // Add approval status fields
  approvals?: {
    email_id?: { status: 'ACCEPTED' | 'DECLINED' | 'PENDING' };
    address?: { status: 'ACCEPTED' | 'DECLINED' | 'PENDING' };
    ambulance_category?: { status: 'ACCEPTED' | 'DECLINED' | 'PENDING' };
    aadhaar_details?: { status: 'ACCEPTED' | 'DECLINED' | 'PENDING' };
    pan_details?: { status: 'ACCEPTED' | 'DECLINED' | 'PENDING' };
    dl_details?: { status: 'ACCEPTED' | 'DECLINED' | 'PENDING' };
    bank_details?: { status: 'ACCEPTED' | 'DECLINED' | 'PENDING' };
    rc_details?: { status: 'ACCEPTED' | 'DECLINED' | 'PENDING' };
  };
}

interface ApprovalStatus {
  email_id: { status: string; remark?: string };
  address: { status: string; remark?: string };
  ambulance_category: { status: string; remark?: string };
  aadhaar_details: { status: string; remark?: string };
  pan_details: { status: string; remark?: string };
  dl_details: { status: string; remark?: string };
  bank_details: { status: string; remark?: string };
  rc_details: { status: string; remark?: string };
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
  const [approvalStatuses, setApprovalStatuses] = useState<Record<string, ApprovalStatus>>({});
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [updatingCategory, setUpdatingCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    fieldLabel: string;
    fieldValue: string;
    fieldType: string;
    driverId: string;
    kycDetails: any;
  }>({
    isOpen: false,
    fieldLabel: "",
    fieldValue: "",
    fieldType: "",
    driverId: "",
    kycDetails: null,
  });

  // Ambulance categories based on your schema
  const ambulanceCategories = [
    "MFR - medical first responder",
    "PTS - patient transport support", 
    "BLS - basic life support",
    "DBA - dead body smarty",
    "ALS - advance life support"
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch approval statuses for all drivers
  const fetchApprovalStatuses = async (driverIds: string[]) => {
    try {
      const statusPromises = driverIds.map(async (driverId) => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/driver/approval/${driverId}`);
          if (response.data.success) {
            return { driverId, status: response.data.data };
          }
        } catch (error) {
          console.error(`Error fetching approval for driver ${driverId}:`, error);
        }
        return { driverId, status: null };
      });

      const results = await Promise.all(statusPromises);
      const statusMap: Record<string, ApprovalStatus> = {};
      
      results.forEach(({ driverId, status }) => {
        if (status) {
          statusMap[driverId] = status;
        }
      });
      
      setApprovalStatuses(statusMap);
    } catch (error) {
      console.error('Error fetching approval statuses:', error);
    }
  };

  // Helper function to get approval status icon
  const getApprovalStatusIcon = (driverId: string, fieldType: string) => {
    const approval = approvalStatuses[driverId];
    if (!approval) return <FaClock className="text-gray-400" size={13} />;

    let status = '';
    switch (fieldType) {
      case 'email':
        status = approval.email_id?.status || 'PENDING';
        break;
      case 'address':
        status = approval.address?.status || 'PENDING';
        break;
      case 'ambulance_category':
        status = approval.ambulance_category?.status || 'PENDING';
        break;
      default:
        status = 'PENDING';
    }

    switch (status) {
      case 'ACCEPTED':
        return <FaCheckCircle className="text-green-500" size={13} />;
      case 'DECLINED':
        return <FaTimesCircle className="text-red-500" size={13} />;
      case 'PENDING':
      default:
        return <FaClock className="text-gray-400" size={13} />;
    }
  };

  // Update ambulance category
  const updateAmbulanceCategory = async (driverId: string, newCategory: string) => {
    try {
      setUpdatingCategory(driverId);
      
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/driver/update-ambulance-category/${driverId}`,
        { ambulanceCategory: newCategory },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200 && response.data?.success) {
        // Update the local state
        setDrivers(prevDrivers => 
          prevDrivers.map(driver => 
            driver._id === driverId 
              ? { ...driver, ambulanceCategory: newCategory }
              : driver
          )
        );
        setActiveDropdown(null);
        
        // Optional: Show success message
        console.log('Ambulance category updated successfully');
      } else {
        throw new Error(response.data?.message || 'Failed to update ambulance category');
      }
    } catch (error) {
      console.error('Error updating ambulance category:', error);
      // Optional: Show error message to user
      alert('Failed to update ambulance category. Please try again.');
    } finally {
      setUpdatingCategory(null);
    }
  };

  // Toggle dropdown
  const toggleDropdown = (driverId: string) => {
    setActiveDropdown(activeDropdown === driverId ? null : driverId);
  };

  // Fetch drivers from API with filters
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
      
      if (response.status !== 200) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const result = response.data;
      console.log(result);
      
      if (result.success && result.data) {
        setDrivers(result.data);
        setTotalPages(result.pagination?.totalPages || 1);
        setCurrentPage(result.pagination?.currentPage || 1);
        
        // Fetch approval statuses for the current drivers
        const driverIds = result.data.map(driver => driver._id);
        if (driverIds.length > 0) {
          await fetchApprovalStatuses(driverIds);
        }
      } else {
        throw new Error(result.message || 'Failed to fetch drivers');
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

  const openModal = (label: string, value: string, fieldType: string, driver: Driver) => {
    setModalData({ 
      isOpen: true, 
      fieldLabel: label, 
      fieldValue: value,
      fieldType: fieldType,
      driverId: driver._id,
      kycDetails: driver // Pass the entire driver object as kycDetails
    });
  };

  const closeModal = () => {
    setModalData({ 
      ...modalData, 
      isOpen: false 
    });
  };

  const handleApprovalUpdate = () => {
    // Refresh the drivers list after approval update
    fetchDrivers(currentPage);
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
                  className="text-blue-600 flex gap-1 justify-between items-center cursor-pointer" 
                  onClick={() => openModal("Email ID", driver.email, "email", driver)}
                >
                  <span className="truncate max-w-32" title={driver.email}>{driver.email}</span>
                  {getApprovalStatusIcon(driver._id, 'email')}
                </div>
                <div 
                  className="text-blue-600 flex justify-between gap-1 items-center cursor-pointer" 
                  onClick={() => openModal("Address", driver.address, "address", driver)}
                >
                  <span className="truncate max-w-32" title={driver.address}>{driver.address}</span>
                  {getApprovalStatusIcon(driver._id, 'address')}
                </div>
                <div className="text-blue-600 flex gap-5 items-center justify-between relative">
                  <span 
                    className="truncate cursor-pointer max-w-20" 
                    title={driver.ambulanceCategory}
                    onClick={() => openModal("Ambulance Category", driver.ambulanceCategory, "ambulance_category", driver)}
                  >
                    {driver.ambulanceCategory}
                  </span>
                  {getApprovalStatusIcon(driver._id, 'ambulance_category')}
                  <div className="relative" ref={activeDropdown === driver._id ? dropdownRef : null}>
                    <CiEdit 
                      className="text-black cursor-pointer flex-shrink-0 hover:text-blue-600" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(driver._id);
                      }}
                    />
                    {activeDropdown === driver._id && (
                      <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                        <div className="py-1 max-h-48 overflow-y-auto">
                          {ambulanceCategories.map((category) => (
                            <button
                              key={category}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                                driver.ambulanceCategory === category 
                                  ? 'bg-blue-50 text-blue-600' 
                                  : 'text-gray-700'
                              } ${updatingCategory === driver._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={() => {
                                if (updatingCategory !== driver._id && driver.ambulanceCategory !== category) {
                                  updateAmbulanceCategory(driver._id, category);
                                }
                              }}
                              disabled={updatingCategory === driver._id}
                            >
                              {category}
                              {driver.ambulanceCategory === category && (
                                <FaCheckCircle className="inline ml-2 text-green-500" size={12} />
                              )}
                            </button>
                          ))}
                        </div>
                        {updatingCategory === driver._id && (
                          <div className="px-3 py-2 text-xs text-gray-500 border-t">
                            Updating...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
        driverId={modalData.driverId}
        fieldType={modalData.fieldType}
        kycDetails={modalData.kycDetails}
        onApprovalUpdate={handleApprovalUpdate}
      />
    </>
  );
};

export default DriverDetails;