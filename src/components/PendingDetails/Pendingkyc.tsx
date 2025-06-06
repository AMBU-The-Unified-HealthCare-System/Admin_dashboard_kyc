import { useState, useEffect } from "react";
import Pagination from "../Logindetails/Pagination";
import { FaEye, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import Sidemodal from "../Sidemodal";
import { TbPhoneCalling } from "react-icons/tb";
import axios from "axios";

interface DriverResponse {
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
  kyc: string;
  kycStep: string;
  kycDetails: {
    aadhaar_detail: any;
    pan_detail: any;
    dl_detail: any;
    rc_detail: any;
    bank_detail: any;
  };
  esignDetails: any;
}

interface ApprovalStatus {
  aadhaar_details: { status: string; remark?: string };
  pan_details: { status: string; remark?: string };
  dl_details: { status: string; remark?: string };
  bank_details: { status: string; remark?: string };
  rc_details: { status: string; remark?: string };
}

interface DriversApiResponse {
  success: boolean;
  data: DriverResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDrivers: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    search: string | null;
    date: string | null;
    appliedFilters: {
      hasSearch: boolean;
      hasDate: boolean;
      totalFilters: number;
    };
  };
}

interface PendingkycProps {
  searchTerm: string;
  entriesPerPage: number;
  selectedDate: Date | null;
}

const DriverDetailsKYC: React.FC<PendingkycProps> = ({ 
  searchTerm, 
  entriesPerPage, 
  selectedDate 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [drivers, setDrivers] = useState<DriverResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvalStatuses, setApprovalStatuses] = useState<Record<string, ApprovalStatus>>({});
  
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    fieldLabel: string;
    fieldValue: string;
    driverName: string;
    driverId: string;
    kycDetails: any;
    fieldType: string;
  }>({
    isOpen: false,
    fieldLabel: "",
    fieldValue: "",
    driverName: "",
    driverId: "",
    kycDetails: null,
    fieldType: "",
  });

  // Fixed: Fetch approval statuses for all drivers
  const fetchApprovalStatuses = async (driverIds: string[]) => {
    try {
      const statusPromises = driverIds.map(async (driverId) => {
        try {
          const response = await axios.get(`http://localhost:3000/driver/approval/${driverId}`);
          if (response.data.success) {
            // Fixed: Access response.data instead of response
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

  const fetchDrivers = async (page: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entriesPerPage.toString(),
      });

      // Add search parameter
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      // Add date parameter
      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        params.append('date', formattedDate);
      }

      const response = await axios.get(`http://localhost:3000/driver/getDrivers?${params.toString()}`);
      
      // Fixed: Check response.data.success instead of response status
      if (!response.data.success) {
        throw new Error(`API error: ${response.data.message || 'Unknown error'}`);
      }
      
      // Fixed: Access response.data directly
      const data: DriversApiResponse = response.data;
      console.log(data);
      
      if (data.success) {
        setDrivers(data.data);
        setTotalPages(data.pagination.totalPages);
        
        // Fetch approval statuses for the current drivers
        const driverIds = data.data.map(driver => driver._id);
        if (driverIds.length > 0) {
          await fetchApprovalStatuses(driverIds);
        }
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      // Enhanced error handling
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || 'Network error occurred');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch drivers');
      }
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch drivers when component mounts or filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, entriesPerPage, selectedDate]);

  useEffect(() => {
    fetchDrivers(currentPage);
  }, [currentPage, searchTerm, entriesPerPage, selectedDate]);

  const openModal = (label: string, value: string, driver: DriverResponse, fieldType: string) => {
    setModalData({ 
      isOpen: true, 
      fieldLabel: label, 
      fieldValue: value,
      driverName: driver.name,
      driverId: driver._id,
      kycDetails: driver.kycDetails,
      fieldType: fieldType
    });
  };
  
  const closeModal = () => {
    setModalData({ 
      ...modalData, 
      isOpen: false,
      driverName: "",
      driverId: "",
      kycDetails: null,
      fieldType: ""
    });
  };

  const handleApprovalUpdate = () => {
    // Refresh the drivers list and approval statuses after approval update
    fetchDrivers(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Helper function to safely get KYC document numbers
  const getKycValue = (driver: DriverResponse, field: string) => {
    console.log(driver);
    switch (field) {
      case 'aadhar':
        return driver.kycDetails?.aadhaar_detail?.aadhar_number || 'N/A';
      case 'pan':
        return driver.kycDetails?.pan_detail?.reference_id || 'N/A';
      case 'dl':
        return driver.kycDetails?.dl_detail?.dl_number || 'N/A';
      case 'bank':
        return driver.kycDetails?.bank_detail?.reference_id || 'N/A';
      case 'rc':
        return driver.kycDetails?.rc_detail?.reference_id || 'N/A';
      default:
        return 'N/A';
    }
  };

  // Helper function to get approval status icon and color
  const getApprovalStatusIcon = (driverId: string, fieldType: string) => {
    const approval = approvalStatuses[driverId];
    if (!approval) return <FaClock className="text-gray-400" size={12} />;

    let status = '';
    switch (fieldType) {
      case 'aadhar':
        status = approval.aadhaar_details?.status || 'PENDING';
        break;
      case 'pan':
        status = approval.pan_details?.status || 'PENDING';
        break;
      case 'dl':
        status = approval.dl_details?.status || 'PENDING';
        break;
      case 'bank':
        status = approval.bank_details?.status || 'PENDING';
        break;
      case 'rc':
        status = approval.rc_details?.status || 'PENDING';
        break;
      default:
        status = 'PENDING';
    }

    switch (status) {
      case 'ACCEPTED':
        return <FaCheckCircle className="text-green-500" size={12} />;
      case 'DECLINED':
        return <FaTimesCircle className="text-red-500" size={12} />;
      case 'PENDING':
      default:
        return <FaClock className="text-gray-400" size={12} />;
    }
  };

  if (loading && drivers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading drivers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto p-4 styled-scrollbar your-div">
        <div className="min-w-[2100px] h-[650px]">                                    
          <div className="grid grid-cols-[repeat(10,minmax(150px,1fr))] gap-x-12 font-semibold w-full p-2 rounded-t text-nowrap bg-sky-50">
            <div>Driver Name</div>
            <div>Aadhar ID</div>
            <div>PAN ID</div>
            <div>DL ID</div>
            <div>Bank Account</div>
            <div>Registration Cert..</div>
            <div>Vehicle Number</div>
            <div>Document</div>
            <div>V2 Status</div>
            <div>Call to Driver</div>
          </div>

          {drivers.map((driver) => (
            <div
              key={driver._id}
              className="grid grid-cols-[repeat(10,minmax(150px,1fr))] gap-x-12 text-sm p-3 items-center text-nowrap"
            >
              <div>{driver.name}</div>
              <div className="text-blue-600 flex gap-1 items-center cursor-pointer justify-between" 
                   onClick={() => openModal("Aadhaar Details", getKycValue(driver, 'aadhar'), driver, 'aadhar')}>
                {getKycValue(driver, 'aadhar')} 
                {getApprovalStatusIcon(driver._id, 'aadhar')}
              </div>
              <div className="text-blue-600 flex gap-1 items-center cursor-pointer justify-between"
                   onClick={() => openModal("PAN Details", getKycValue(driver, 'pan'), driver, 'pan')}>
                {getKycValue(driver, 'pan')} 
                {getApprovalStatusIcon(driver._id, 'pan')}
              </div> 
              <div className="text-blue-600 flex gap-1 items-center cursor-pointer justify-between"
                   onClick={() => openModal("Driving License Details", getKycValue(driver, 'dl'), driver, 'dl')}>
                {getKycValue(driver, 'dl')}  
                {getApprovalStatusIcon(driver._id, 'dl')}
              </div>
              <div className="flex gap-4 items-center cursor-pointer text-blue-600 justify-between" 
                   onClick={() => openModal("Bank Account Details", getKycValue(driver, 'bank'), driver, 'bank')}>
                {getKycValue(driver, 'bank')}
                {getApprovalStatusIcon(driver._id, 'bank')}
              </div>
              <div className="text-blue-600 flex gap-7 items-center cursor-pointer justify-between"
                   onClick={() => openModal("Registration Certificate Details", getKycValue(driver, 'rc'), driver, 'rc')}>
                {getKycValue(driver, 'rc')} 
                <div className="flex gap-1 items-center">
                  <FaEye className="text-black" />
                  {getApprovalStatusIcon(driver._id, 'rc')}
                </div>
              </div>
              <div>{driver.vehicleNumber}</div>
              <div className="text-orange-400 border border-amber-500 rounded-md text-center w-fit text-xs p-0.5 px-2  bg-red-50 cursor-pointer">
                {driver.kyc}
              </div>
              <div className="text-orange-400 border border-amber-500 rounded-md text-center w-fit text-xs p-0.5 px-2  bg-red-50">
                {driver.v2Status}
              </div>
              <div className="text-blue-600 cursor-pointer hover:underline flex gap-1 items-center">
                <TbPhoneCalling size={20} /> Make Call
              </div>
            </div>
          ))}

          {loading && drivers.length > 0 && (
            <div className="flex justify-center items-center py-4">
              <div className="text-gray-500">Loading...</div>
            </div>
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
        driverName={modalData.driverName}
        driverId={modalData.driverId}
        kycDetails={modalData.kycDetails}
        fieldType={modalData.fieldType}
        onApprovalUpdate={handleApprovalUpdate}
      />
    </>
  );
};

export default DriverDetailsKYC