import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import Pagination from "../Logindetails/Pagination";
import Sidemodal from "../Sidemodal";
import axios from "axios";

// Ambulance type enum
enum AmbulanceType {
  MFR = "MFR - medical first responder",
  PTS = "PTS - patient transport support",
  BLS = "BLS - basic life support",
  DBA = "DBA - dead body ambulance",
  ALS = "ALS - advance life support",
}

// Types
interface Ambulance {
  registrationId: string;
  id: string;
  ownerId: string;
  vehicleNumber: string;
  baseLocation: {
    type: string;
    coordinates: number[];
  };
  status: string;
  isVerified: boolean;
  ambulanceType?: string;
}

interface Vehicle {
  registrationId: string;
  _id: string;
  ambulanceType: string;
  vehicleNumber: string;
  isVerified: boolean;
  fleetOwnerId: string;
  registrationDate: string;
  lastUpdated: string;
  status: string;
  action: string;
}

interface ApprovalStatus {
  ambulanceType: { status: string; remark?: string };
  vehicleNumber: { status: string; remark?: string };
  isVerified: { status: string; remark?: string };
}

interface VehicleDetailsProps {
  searchTerm?: string;
  entriesPerPage?: number;
  selectedDate?: Date | null;
  ownerType?: string;
}

const VehicleDetailsTable = ({ 
  searchTerm = "", 
  entriesPerPage = 12, 
  selectedDate = null,
  ownerType = "FLEET_OWNER"
}: VehicleDetailsProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [approvalStatuses] = useState<Record<string, ApprovalStatus>>({});
  const [updatingAmbulanceTypes, setUpdatingAmbulanceTypes] = useState<Record<string, boolean>>({});
  const [currentOwnerType, setCurrentOwnerType] = useState(ownerType);
  
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    fieldLabel: string;
    fieldValue: string;
    fieldType: string;
    vehicleId: string;
    vehicleDetails: Vehicle | null;
    detailedInfo: {
      registrationId?: string;
      isEmailVerified?: boolean;
      phoneNumber?: string;
      isPhoneNumberVerified?: boolean;
      address?: {
        placeName?: string;
        placeAddress?: string;
        alternateName?: string | null;
        eLoc?: string | null;
        coordinates?: {
          type: string;
          coordinates: number[];
        };
      };
      kyc?: string;
      kycStep?: string;
      createdAt?: string;
      updatedAt?: string;
      id?: string;
    } | null;
  }>({
    isOpen: false,
    fieldLabel: "",
    fieldValue: "",
    fieldType: "",
    vehicleId: "",
    vehicleDetails: null,
    detailedInfo: null,
  });

  // Helper function to get approval status icon
  const getApprovalStatusIcon = (vehicleId: string, fieldType: string) => {
    const approval = approvalStatuses[vehicleId];
    
    // For isVerified field, check the actual vehicle data
    if (fieldType === 'isVerified') {
      const vehicle = vehicles.find(v => v._id === vehicleId);
      if (vehicle?.isVerified) {
        return <FaCheckCircle className="text-green-500" size={13} />;
      } else {
        return <FaClock className="text-gray-400" size={13} />;
      }
    }

    if (!approval) return <FaClock className="text-gray-400" size={13} />;

    let status = '';
    switch (fieldType) {
      case 'ambulanceType':
        status = approval.ambulanceType?.status || 'PENDING';
        break;
      case 'vehicleNumber':
        status = approval.vehicleNumber?.status || 'PENDING';
        break;
      case 'isVerified':
        status = approval.isVerified?.status || 'PENDING';
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

  // Fetch fleet owner details
  const fetchFleetOwnerDetails = async (ownerId: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/fleetOwner/${ownerId}`);
      
      if (response.status === 200 && response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch fleet owner details');
      }
    } catch (error) {
      console.error('Error fetching fleet owner details:', error);
      throw error;
    }
  };

  const handleAmbulanceTypeUpdate = async (vehicleId: string, ambulanceType: string) => {
    if (!ambulanceType.trim()) {
      alert('Please select an ambulance type');
      return;
    }

    setUpdatingAmbulanceTypes(prev => ({ ...prev, [vehicleId]: true }));
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/ambulance/${vehicleId}`,
        {
          ambulanceType: ambulanceType
        }
      );

      if (response.data.success) {
        alert('Ambulance type updated successfully!');
        setVehicles(prev =>
          prev.map(v =>
            v._id === vehicleId
              ? { ...v, ambulanceType: ambulanceType }
              : v
          )
        );
      } else {
        throw new Error(response.data.message || 'Failed to update ambulance type');
      }
    } catch (error) {
      console.error('Error updating ambulance type:', error);
      alert(error instanceof Error ? error.message : 'Failed to update ambulance type');
    } finally {
      setUpdatingAmbulanceTypes(prev => ({ ...prev, [vehicleId]: false }));
    }
  };

  // Fetch vehicles from API based on owner type
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/ambulance/all?ownerType=${currentOwnerType}`
      );
      
      if (response.status !== 200) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const result = response.data;
      console.log(`${currentOwnerType} Ambulance API result:`, result);
      
      if (result.success && result.data) {
        // Handle single object vs array response
        const ambulanceData = Array.isArray(result.data) ? result.data : [result.data];
        
        // Transform ambulance data to match vehicle format
        const transformedData = ambulanceData.map((ambulance: Ambulance) => ({
          _id: ambulance.id,
          registrationId: ambulance.registrationId, // Use vehicle number as registration ID
          ambulanceType: ambulance.ambulanceType || 'N/A', // Use ambulanceType from API if available, otherwise 'N/A'
          vehicleNumber: ambulance.vehicleNumber,
          isVerified: ambulance.isVerified,
          fleetOwnerId: ambulance.ownerId,
          registrationDate: 'N/A', // API doesn't provide registration date
          lastUpdated: 'N/A', // API doesn't provide last updated date
          status: ambulance.status,
          action: 'View Details',
        }));
        
        // Filter data based on search term
        let filteredVehicles = transformedData;
        if (searchTerm.trim()) {
          filteredVehicles = transformedData.filter((vehicle: Vehicle) => 
            vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.fleetOwnerId.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setVehicles(filteredVehicles);
        setTotalPages(1); // Since the API doesn't return pagination info
        setCurrentPage(1);
      } else {
        throw new Error(result.message || `Failed to fetch ${currentOwnerType.toLowerCase()} ambulances`);
      }
    } catch (err) {
      console.error(`Error fetching ${currentOwnerType.toLowerCase()} ambulances:`, err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || `An error occurred while fetching ${currentOwnerType.toLowerCase()} ambulances`);
      } else {
        setError(err instanceof Error ? err.message : `An error occurred while fetching ${currentOwnerType.toLowerCase()} ambulances`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage, selectedDate, currentOwnerType]);

  // Fetch vehicles data when page or filters change
  useEffect(() => {
    fetchVehicles();
  }, [currentPage, searchTerm, entriesPerPage, selectedDate, currentOwnerType]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle click on Vehicle ID - shows ambulance details
  const handleVehicleIdClick = async (vehicle: Vehicle) => {
    try {
      // Fetch detailed ambulance information based on owner type using registration number
      let apiEndpoint = '';
      if (currentOwnerType === 'FLEET_OWNER') {
        apiEndpoint = `${import.meta.env.VITE_BACKEND_URL}/api/fleetOwner/ambulance-rc/?reg_no=${vehicle.vehicleNumber}`;
      } else if (currentOwnerType === 'DRIVER') {
        apiEndpoint = `${import.meta.env.VITE_BACKEND_URL}/api/driver/ambulance-rc/?reg_no=${vehicle.vehicleNumber}`;
      }

      if (apiEndpoint) {
        const response = await axios.get(apiEndpoint);
        console.log(`Detailed ambulance RC data for ${currentOwnerType}:`, response.data);
        
        // Use the detailed data from API response
        const detailedData = response.data.success ? response.data.data : vehicle;
        
        setModalData({ 
          isOpen: true, 
          fieldLabel: "Ambulance RC Details", 
          fieldValue: vehicle.vehicleNumber,
          fieldType: "ambulanceDetails",
          vehicleId: vehicle._id,
          vehicleDetails: detailedData,
          detailedInfo: null,
        });
      } else {
        // Fallback to original behavior if ownerType is not recognized
        setModalData({ 
          isOpen: true, 
          fieldLabel: "Ambulance Details", 
          fieldValue: JSON.stringify(vehicle, null, 2),
          fieldType: "ambulanceDetails",
          vehicleId: vehicle._id,
          vehicleDetails: vehicle,
          detailedInfo: null,
        });
      }
    } catch (error) {
      console.error(`Error fetching detailed ambulance RC data for ${currentOwnerType}:`, error);
      // Fallback to original behavior if API call fails
      setModalData({ 
        isOpen: true, 
        fieldLabel: "Ambulance Details", 
        fieldValue: JSON.stringify(vehicle, null, 2),
        fieldType: "ambulanceDetails",
        vehicleId: vehicle._id,
        vehicleDetails: vehicle,
        detailedInfo: null,
      });
    }
  };

  // Handle click on Owner ID - shows fleet owner details
  const handleOwnerIdClick = async (ownerId: string, vehicle: Vehicle) => {
    try {
      const fleetOwnerDetails = await fetchFleetOwnerDetails(ownerId);
      
      setModalData({ 
        isOpen: true, 
        fieldLabel: "Fleet Owner Details", 
        fieldValue: ownerId,
        fieldType: "details",
        vehicleId: vehicle._id,
        vehicleDetails: vehicle,
        detailedInfo: fleetOwnerDetails,
      });
    } catch (error) {
      console.error('Error fetching fleet owner details:', error);
      alert('Failed to fetch fleet owner details');
    }
  };

  const closeModal = () => {
    setModalData({ 
      ...modalData, 
      isOpen: false 
    });
  };

  // Custom approval handler for ambulance verification
  const handleCustomApproval = () => {
    // This will be called by Sidemodal, but we need to handle the approval logic differently
    // The actual approval logic will be handled in the Sidemodal component itself
    fetchVehicles(); // Refresh data after any approval update
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading {currentOwnerType.toLowerCase()} ambulances...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button 
          onClick={() => fetchVehicles()}
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
          value={currentOwnerType}
          onChange={(e) => setCurrentOwnerType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="FLEET_OWNER">Fleet Owner</option>
          <option value="DRIVER">Driver</option>
        </select>
      </div>

      <div className="overflow-x-auto p-4 styled-scrollbar your-div">
        <div className="min-w-[1000px] h-[650px]">
          <div className="grid grid-cols-[repeat(5,minmax(150px,1fr))] gap-x-12 font-semibold w-full p-2 rounded-t text-nowrap bg-sky-50">
            <div>Vehicle ID</div>
            <div>Owner ID</div>
            <div>Ambulance Type</div>
            <div>Vehicle Number</div>
            <div>Is Verified</div>
          </div>

          {vehicles.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <span className="text-gray-500">No vehicles found</span>
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="grid grid-cols-[repeat(5,minmax(150px,1fr))] gap-x-12 text-sm p-3 items-center hover:bg-gray-50"
              >
                <div 
                  className="text-blue-600 flex gap-1 items-center cursor-pointer"
                  onClick={() => handleVehicleIdClick(vehicle)}
                >
                  <span className="truncate font-mono text-sm" title={vehicle._id}>{vehicle._id}</span>
                </div>
                <div className="text-blue-600 flex gap-1 items-center cursor-pointer">
                  <span 
                    className="truncate font-mono text-sm" 
                    title={vehicle.registrationId}
                    onClick={() => handleOwnerIdClick(vehicle.fleetOwnerId, vehicle)}
                  >
                    {vehicle.registrationId}
                  </span>
                </div>
                <div className="text-blue-600 flex gap-1 justify-between items-center">
                  <div className="flex flex-col gap-2 w-full">
                    <select
                      value={vehicle.ambulanceType === 'N/A' ? "" : vehicle.ambulanceType}
                      onChange={(e) => handleAmbulanceTypeUpdate(vehicle._id, e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                      disabled={updatingAmbulanceTypes[vehicle._id]}
                    >
                      <option value="">Select Type</option>
                      {Object.values(AmbulanceType).map((type) => (
                        <option key={type} value={type}>
                          {type} {/* Show the full type name */}
                        </option>
                      ))}
                    </select>
                    {updatingAmbulanceTypes[vehicle._id] && (
                      <span className="text-xs text-gray-500">Updating...</span>
                    )}
                  </div>
                  {getApprovalStatusIcon(vehicle._id, 'ambulanceType')}
                </div>
                <div 
                  className="text-blue-600 flex justify-between gap-1 items-center cursor-pointer"
                  onClick={() => handleVehicleIdClick(vehicle)}
                >
                  <span className="truncate max-w-32" title={vehicle.vehicleNumber}>{vehicle.vehicleNumber}</span>
                  {getApprovalStatusIcon(vehicle._id, 'vehicleNumber')}
                </div>
                <div 
                  className="text-blue-600 flex gap-5 items-center justify-between relative cursor-pointer"
                  onClick={() => handleVehicleIdClick(vehicle)}
                >
                  <span 
                    className="truncate max-w-20" 
                    title={vehicle.isVerified ? "Verified" : "Not Verified"}
                  >
                    {vehicle.isVerified ? "Verified" : "Not Verified"}
                  </span>
                  {getApprovalStatusIcon(vehicle._id, 'isVerified')}
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
        driverId={modalData.vehicleId}
        fieldType={modalData.fieldType}
        kycDetails={modalData.vehicleDetails}
        detailedInfo={modalData.detailedInfo}
        onApprovalUpdate={handleCustomApproval}
      />
    </>
  );
};

export default VehicleDetailsTable; 