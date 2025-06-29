import { useState, useEffect } from "react";
import Pagination from "../Logindetails/Pagination";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import Sidemodal from "../Sidemodal";
import axios from "axios";

interface AdminResponse {
  id: string;
  aadharDetails: {
    aadhar_number?: number;
    id?: string;
  } | null;
  drivingLicenseDetails: {
    dl_number?: string;
    rc_number?: string;
    vehicle_number?: string;
  } | null;
}

interface AdminApiResponse {
  success: boolean;
  data: {
    data: AdminResponse[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface ApprovalStatus {
  aadhaar_details: { status: string; remark?: string };
  pan_details: { status: string; remark?: string };
  dl_details: { status: string; remark?: string };
  bank_details: { status: string; remark?: string };
  rc_details: { status: string; remark?: string };
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
  const [adminData, setAdminData] = useState<AdminResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvalStatuses, setApprovalStatuses] = useState<Record<string, ApprovalStatus>>({});
  const [ownerType, setOwnerType] = useState("FLEET_OWNER"); // Default to Fleet Owner
  
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    fieldLabel: string;
    fieldValue: string;
    driverName: string;
    driverId: string;
    kycDetails: Record<string, unknown> | undefined;
    fieldType: string;
    detailedInfo?: Record<string, any> | null;
  }>({
    isOpen: false,
    fieldLabel: "",
    fieldValue: "",
    driverName: "",
    driverId: "",
    kycDetails: undefined,
    fieldType: "",
    detailedInfo: null,
  });

  const fetchAdminData = async (page: number) => {
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

      // Use different API endpoints based on ownerType
      const apiEndpoint = ownerType === 'FLEET_OWNER' 
        ? 'https://dev.api.india.ambuvians.in/api/admin/fleet-owner'
        : 'https://dev.api.india.ambuvians.in/api/admin/driver';

      const response = await axios.get(`${apiEndpoint}?${params.toString()}`);
      
      if (!response.data.success) {
        throw new Error(`API error: ${response.data.message || 'Unknown error'}`);
      }
      
      const data: AdminApiResponse = response.data;
      console.log(`${ownerType} API response:`, data);
      
      if (data.success) {
        setAdminData(data.data.data);
        setTotalPages(data.data.pagination.totalPages);
        
        // Fetch approval statuses for the current data
        const adminIds = data.data.data.map(admin => admin.id);
        if (adminIds.length > 0) {
          await fetchApprovalStatuses(adminIds);
        }
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || 'Network error occurred');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      }
      console.error(`Error fetching ${ownerType.toLowerCase()} data:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Fixed: Fetch approval statuses for all admins
  const fetchApprovalStatuses = async (adminIds: string[]) => {
    try {
      const statusPromises = adminIds.map(async (adminId) => {
        try {
          const response = await axios.get(`http://localhost:3000/driver/approval/${adminId}`);
          if (response.data.success) {
            return { adminId, status: response.data.data };
          }
        } catch (error) {
          console.error(`Error fetching approval for admin ${adminId}:`, error);
        }
        return { adminId, status: null };
      });

      const results = await Promise.all(statusPromises);
      const statusMap: Record<string, ApprovalStatus> = {};
      
      results.forEach(({ adminId, status }) => {
        if (status) {
          statusMap[adminId] = status;
        }
      });
      
      setApprovalStatuses(statusMap);
    } catch (error) {
      console.error('Error fetching approval statuses:', error);
    }
  };

  // Fetch driver details
  const fetchDriverDetails = async (driverId: string) => {
    try {
      const response = await axios.get(`https://dev.api.india.ambuvians.in/api/fleetOwner/${driverId}`);
      
      if (response.status === 200 && response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch driver details');
      }
    } catch (error) {
      console.error('Error fetching driver details:', error);
      throw error;
    }
  };

  // Handle click on driver name - shows driver details
  const handleDriverNameClick = async (admin: AdminResponse) => {
    try {
      const driverDetails = await fetchDriverDetails(admin.id);
      
      setModalData({ 
        isOpen: true, 
        fieldLabel: "Driver Details", 
        fieldValue: admin.id,
        driverName: admin.id,
        driverId: admin.id,
        kycDetails: undefined,
        fieldType: "details",
        detailedInfo: driverDetails
      });
    } catch (error) {
      console.error('Error fetching driver details:', error);
      alert('Failed to fetch driver details');
    }
  };

  // Effect to fetch data when component mounts or filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, entriesPerPage, selectedDate, ownerType]);

  useEffect(() => {
    fetchAdminData(currentPage);
  }, [currentPage, searchTerm, entriesPerPage, selectedDate, ownerType]);

  const openModal = async (label: string, value: string, admin: AdminResponse, fieldType: string) => {
    if (fieldType === 'aadhar' && admin.aadharDetails?.id) {
      try {
        const apiEndpoint = ownerType === 'FLEET_OWNER' 
          ? `https://dev.api.india.ambuvians.in/api/fleetOwner/aadhar/${admin.aadharDetails.id}`
          : `https://dev.api.india.ambuvians.in/api/driver/aadhar/${admin.aadharDetails.id}`;

        const response = await axios.get(apiEndpoint);
        
        if (response.data.success) {
          setModalData({ 
            isOpen: true, 
            fieldLabel: label, 
            fieldValue: value,
            driverName: admin.id,
            driverId: admin.id,
            kycDetails: {
              aadhaar_detail: response.data.data
            },
            fieldType: fieldType
          });
        } else {
          console.error('Failed to fetch Aadhaar details:', response.data.message);
          setModalData({ 
            isOpen: true, 
            fieldLabel: label, 
            fieldValue: value,
            driverName: admin.id,
            driverId: admin.id,
            kycDetails: {
              aadharDetails: admin.aadharDetails,
              drivingLicenseDetails: admin.drivingLicenseDetails,
            },
            fieldType: fieldType
          });
        }
      } catch (error) {
        console.error('Error fetching Aadhaar details:', error);
        setModalData({ 
          isOpen: true, 
          fieldLabel: label, 
          fieldValue: value,
          driverName: admin.id,
          driverId: admin.id,
          kycDetails: {
            aadharDetails: admin.aadharDetails,
            drivingLicenseDetails: admin.drivingLicenseDetails,
          },
          fieldType: fieldType
        });
      }
    } else {
      // For non-Aadhaar fields, use the existing logic
      setModalData({ 
        isOpen: true, 
        fieldLabel: label, 
        fieldValue: value,
        driverName: admin.id,
        driverId: admin.id,
        kycDetails: {
          aadharDetails: admin.aadharDetails,
          drivingLicenseDetails: admin.drivingLicenseDetails,
        },
        fieldType: fieldType
      });
    }
  };
  
  const closeModal = () => {
    setModalData({ 
      ...modalData, 
      isOpen: false,
      driverName: "",
      driverId: "",
      kycDetails: undefined,
      fieldType: ""
    });
  };

  const handleApprovalUpdate = () => {
    // Refresh the data list and approval statuses after approval update
    fetchAdminData(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Helper function to safely get KYC document numbers
  const getKycValue = (admin: AdminResponse, field: string) => {
    console.log(admin);
    switch (field) {
      case 'aadhar':
        return admin.aadharDetails?.aadhar_number?.toString() || 'N/A';
      case 'dl':
        return admin.drivingLicenseDetails?.dl_number || 'N/A';
      default:
        return 'N/A';
    }
  };

  // Helper function to get approval status icon and color
  const getApprovalStatusIcon = (adminId: string, fieldType: string) => {
    const approval = approvalStatuses[adminId];
    if (!approval) return <FaClock className="text-gray-400" size={12} />;

    let status = '';
    switch (fieldType) {
      case 'aadhar':
        status = approval.aadhaar_details?.status || 'PENDING';
        break;
      case 'dl':
        status = approval.dl_details?.status || 'PENDING';
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

  if (loading && adminData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading {ownerType.toLowerCase()} data...</div>
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
        <div className="min-w-[2100px] h-[650px]">                                    
          <div className="grid grid-cols-[repeat(5,minmax(150px,1fr))] gap-x-12 font-semibold w-full p-2 rounded-t text-nowrap bg-sky-50">
            <div>{ownerType === 'FLEET_OWNER' ? 'Fleet Owner Name' : 'Driver Name'}</div>
            <div>Aadhar ID</div>
            <div>DL ID</div>
            {/* <div>Registration Cert..</div> */}
            {/* <div>Vehicle Number</div> */}
          </div>

          {adminData.map((admin) => (
            <div
              key={admin.id}
              className="grid grid-cols-[repeat(5,minmax(150px,1fr))] gap-x-12 text-sm p-3 items-center text-nowrap"
            >
              <div 
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => handleDriverNameClick(admin)}
              >
                {admin.id}
              </div>
              <div className="text-blue-600 flex gap-1 items-center cursor-pointer justify-between" 
                   onClick={() => openModal("Aadhaar Details", getKycValue(admin, 'aadhar'), admin, 'aadhar')}>
                {admin.aadharDetails?.aadhar_number ? admin.aadharDetails.aadhar_number.toString() : 'N/A'} 
                {getApprovalStatusIcon(admin.id, 'aadhar')}
              </div>
              <div className="text-blue-600 flex gap-1 items-center cursor-pointer justify-between"
                   onClick={() => openModal("Driving License Details", getKycValue(admin, 'dl'), admin, 'dl')}>
                {admin.drivingLicenseDetails?.dl_number || 'N/A'}  
                {getApprovalStatusIcon(admin.id, 'dl')}
              </div>
              {/* <div className="text-blue-600 flex gap-7 items-center cursor-pointer justify-between">
                N/A 
                <div className="flex gap-1 items-center">
                  {getApprovalStatusIcon(admin.id, 'rc')}
                </div>
              </div> */}
              {/* <div>{admin.drivingLicenseDetails?.vehicle_number || 'N/A'}</div> */}
            </div>
          ))}

          {loading && adminData.length > 0 && (
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
        detailedInfo={modalData.detailedInfo}
      />
    </>
  );
};

export default DriverDetailsKYC