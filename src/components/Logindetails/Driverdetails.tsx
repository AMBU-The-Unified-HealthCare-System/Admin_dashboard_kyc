import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import Pagination from "../Logindetails/Pagination";
import Sidemodal from "../Sidemodal";
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

interface FleetOwner {
  id: string;
  registrationId: string;
  isEmailVerified: boolean;
  phoneNumber: string;
  isPhoneNumberVerified: boolean;
  address: {
    placeName: string;
    placeAddress: string;
    alternateName: string | null;
    eLoc: string | null;
    coordinates: {
      type: string;
      coordinates: number[];
    };
  };
  kyc: string;
  defaultLocation: {
    type: string;
    coordinates: number[];
  };
  kycStep: string;
  createdAt: string;
  updatedAt: string;
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
  const [approvalStatuses] = useState<Record<string, ApprovalStatus>>({});
  const [ownerType, setOwnerType] = useState("FLEET_OWNER"); // Default to Fleet Owner
  
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    fieldLabel: string;
    fieldValue: string;
    fieldType: string;
    driverId: string;
    kycDetails: Driver | null;
    detailedInfo: FleetOwner | null;
  }>({
    isOpen: false,
    fieldLabel: "",
    fieldValue: "",
    fieldType: "",
    driverId: "",
    kycDetails: null,
    detailedInfo: null,
  });

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

  // Fetch detailed information for Fleet Owner or Driver
  const fetchDetailedInfo = async (registrationId: string) => {
    try {
      const apiEndpoint = ownerType === 'FLEET_OWNER' 
        ? `https://dev.api.india.ambuvians.in/api/fleetOwner?registrationId=${registrationId}`
        : `https://dev.api.india.ambuvians.in/api/driver/${registrationId}`;
      
      const response = await axios.get(apiEndpoint);
      
      if (response.status === 200 && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch detailed information');
      }
    } catch (error) {
      console.error('Error fetching detailed info:', error);
      throw error;
    }
  };

  // Fetch data from API based on owner type
  const fetchData = async (page: number = 1) => {
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

      // Use different API endpoints based on ownerType
      const apiEndpoint = ownerType === 'FLEET_OWNER' 
        ? 'https://dev.api.india.ambuvians.in/api/fleetOwner/all'
        : 'https://dev.api.india.ambuvians.in/api/driver/all';
      
      const response = await axios.get(apiEndpoint);
      
      if (response.status !== 200) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const result = response.data;
      console.log(`${ownerType} result:`, result);
      
      if (result.success && result.data) {
        // Transform data to match driver format
        const transformedData = result.data.map((item: FleetOwner) => ({
          _id: item.id,
          name: item.registrationId || item.id, // Using registrationId as name since there's no name field
          driverId: item.registrationId || item.id,
          email: 'N/A', // No email field in the response
          phoneNumber: item.phoneNumber || 'N/A',
          address: item.address?.placeAddress || 'N/A',
          ambulanceCategory: 'N/A', // No ambulance category in data
          vehicleNumber: 'N/A', // No vehicle number in data
          model: 'N/A', // No model in data
          submissionDate: new Date(item.createdAt).toLocaleDateString(),
          lSubmissionDate: new Date(item.createdAt).toLocaleDateString(),
          kSubmissionDate: new Date(item.updatedAt).toLocaleDateString(),
          v1Status: item.kyc || 'N/A',
          v2Status: item.kycStep || 'N/A',
          status: item.kyc || 'N/A',
          isEmailVerified: item.isEmailVerified || false,
          isPhoneNumberVerified: item.isPhoneNumberVerified || false,
          action: 'View Details',
        }));
        
        setDrivers(transformedData);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        throw new Error(result.message || `Failed to fetch ${ownerType.toLowerCase()} data`);
      }
    } catch (err) {
      console.error(`Error fetching ${ownerType.toLowerCase()} data:`, err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || `An error occurred while fetching ${ownerType.toLowerCase()} data`);
      } else {
        setError(err instanceof Error ? err.message : `An error occurred while fetching ${ownerType.toLowerCase()} data`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage, selectedDate, ownerType]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, searchTerm, entriesPerPage, selectedDate, ownerType]);

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
      kycDetails: driver, 
      detailedInfo: null,
    });
  };

  const handleIdClick = async (registrationId: string, driver: Driver) => {
    try {
      const detailedInfo = await fetchDetailedInfo(registrationId);
      
      setModalData({ 
        isOpen: true, 
        fieldLabel: `${ownerType === 'FLEET_OWNER' ? 'Fleet Owner' : 'Driver'} Details`, 
        fieldValue: registrationId,
        fieldType: 'details',
        driverId: driver._id,
        kycDetails: driver,
        detailedInfo: detailedInfo,
      });
    } catch (error) {
      console.error('Error fetching detailed info:', error);
      // Fallback to regular modal
      openModal(`${ownerType === 'FLEET_OWNER' ? 'Fleet Owner' : 'Driver'} ID`, registrationId, 'id', driver);
    }
  };

  const closeModal = () => {
    setModalData({ 
      ...modalData, 
      isOpen: false 
    });
  };

  const handleApprovalUpdate = () => {
    // Refresh the data after approval update
    fetchData(currentPage);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading {ownerType.toLowerCase()} data...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button 
          onClick={() => fetchData(currentPage)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Owner Type Dropdown */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <label className="text-sm font-medium text-gray-700">Owner Type:</label>
        <select
          value={ownerType}
          onChange={(e) => setOwnerType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="FLEET_OWNER">Fleet Owner</option>
          <option value="DRIVER">Driver</option>
        </select>
      </div>

      <div className="overflow-x-auto p-4 styled-scrollbar your-div">
        <div className="min-w-[1950px] h-[650px]">
          <div className="grid grid-cols-[repeat(6,minmax(150px,1fr))] gap-x-12 font-semibold w-full p-2 rounded-t text-nowrap bg-sky-50">
            <div>{ownerType === 'FLEET_OWNER' ? 'Fleet Owner Name' : 'Driver Name'}</div>
            <div>{ownerType === 'FLEET_OWNER' ? 'Fleet Owner ID' : 'Driver ID'}</div>
            <div>Address</div>
            <div>Submission Date & Time</div>
            <div>Created At</div>
            <div>Updated At</div>
          </div>

          {drivers.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <span className="text-gray-500">No {ownerType.toLowerCase()} data found</span>
            </div>
          ) : (
            drivers.map((driver) => (
              <div
                key={driver._id}
                className="grid grid-cols-[repeat(6,minmax(150px,1fr))] gap-x-12 text-sm p-3 items-center"
              >
                <div className="truncate" title={driver.name}>{driver.name}</div>
                <div 
                  className="text-blue-600 flex gap-1 items-center cursor-pointer hover:underline"
                  onClick={() => handleIdClick(driver.driverId, driver)}
                  title={`Click to view ${ownerType === 'FLEET_OWNER' ? 'Fleet Owner' : 'Driver'} details`}
                >
                  <span className="truncate" title={driver.driverId}>{driver.driverId}</span>
                </div>
                <div 
                  className="text-blue-600 flex justify-between gap-1 items-center cursor-pointer" 
                  onClick={() => openModal("Address", driver.address, "address", driver)}
                >
                  <span className="truncate max-w-32" title={driver.address}>{driver.address}</span>
                  {getApprovalStatusIcon(driver._id, 'address')}
                </div>
                <div className="truncate" title={driver.submissionDate}>{driver.submissionDate}</div>
                <div className="truncate" title={driver.lSubmissionDate}>{driver.lSubmissionDate}</div>
                <div className="truncate" title={driver.kSubmissionDate}>{driver.kSubmissionDate}</div>
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
        detailedInfo={modalData.detailedInfo}
        onApprovalUpdate={handleApprovalUpdate}
      />
    </>
  );
};

export default DriverDetails;