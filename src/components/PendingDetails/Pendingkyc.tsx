import { useState, useEffect } from "react";
import { CiCircleCheck } from "react-icons/ci";
import Pagination from "../Logindetails/Pagination";
import { FaEye } from "react-icons/fa";
import Sidemodal from "../Sidemodal";
import { TbPhoneCalling } from "react-icons/tb";

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

const DriverDetails: React.FC<PendingkycProps> = ({ 
  searchTerm, 
  entriesPerPage, 
  selectedDate 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [drivers, setDrivers] = useState<DriverResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    fieldLabel: string;
    fieldValue: string;
    driverName: string;
    kycDetails: any;
    fieldType: string;
  }>({
    isOpen: false,
    fieldLabel: "",
    fieldValue: "",
    driverName: "",
    kycDetails: null,
    fieldType: "",
  });

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

      const response = await fetch(`http://localhost:3000/driver/getDrivers?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: DriversApiResponse = await response.json();
      console.log(data)
      if (data.success) {
        setDrivers(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch drivers');
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
      kycDetails: driver.kycDetails,
      fieldType: fieldType
    });
  };
  
  const closeModal = () => {
    setModalData({ 
      ...modalData, 
      isOpen: false,
      driverName: "",
      kycDetails: null,
      fieldType: ""
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Helper function to safely get KYC document numbers
  const getKycValue = (driver: DriverResponse, field: string) => {
    console.log(driver)
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
              <div className="text-blue-600 flex gap-1 items-center cursor-pointer" 
                   onClick={() => openModal("Aadhaar Details", getKycValue(driver, 'aadhar'), driver, 'aadhar')}>
                {getKycValue(driver, 'aadhar')} 
                <CiCircleCheck className="text-gray-500" size={15} />
              </div>
              <div className="text-blue-600 flex gap-1 items-center cursor-pointer"
                   onClick={() => openModal("PAN Details", getKycValue(driver, 'pan'), driver, 'pan')}>
                {getKycValue(driver, 'pan')} 
                <CiCircleCheck className="text-gray-500" size={15} />
              </div> 
              <div className="text-blue-600 flex gap-1 items-center cursor-pointer"
                   onClick={() => openModal("Driving License Details", getKycValue(driver, 'dl'), driver, 'dl')}>
                {getKycValue(driver, 'dl')}  
                <CiCircleCheck className="text-gray-500" size={15} />
              </div>
              <div className="flex gap-4 items-center cursor-pointer text-blue-600" 
                   onClick={() => openModal("Bank Account Details", getKycValue(driver, 'bank'), driver, 'bank')}>
                {getKycValue(driver, 'bank')}
              </div>
              <div className="text-blue-600 flex gap-7 items-center cursor-pointer"
                   onClick={() => openModal("Registration Certificate Details", getKycValue(driver, 'rc'), driver, 'rc')}>
                {getKycValue(driver, 'rc')} 
                <FaEye className="text-black" />
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
        kycDetails={modalData.kycDetails}
        fieldType={modalData.fieldType}
      />
    </>
  );
};

export default DriverDetails;