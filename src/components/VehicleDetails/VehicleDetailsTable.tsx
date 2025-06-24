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
  }>({
    isOpen: false,
    fieldLabel: "",
    fieldValue: "",
    fieldType: "",
    vehicleId: "",
    vehicleDetails: null,
  });

  // Helper function to get approval status icon
  const getApprovalStatusIcon = (vehicleId: string, fieldType: string) => {
    const approval = approvalStatuses[vehicleId];
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

  const handleAmbulanceTypeUpdate = async (vehicleId: string, ambulanceType: string) => {
    if (!ambulanceType.trim()) {
      alert('Please select an ambulance type');
      return;
    }

    setUpdatingAmbulanceTypes(prev => ({ ...prev, [vehicleId]: true }));
    try {
      const response = await axios.put(
        `https://api.india.ambuvians.in/api/ambulance/${vehicleId}`,
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
        `https://api.india.ambuvians.in/api/ambulance/all?ownerType=${currentOwnerType}`
      );
      
      if (response.status !== 200) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const result = response.data;
      console.log(`${currentOwnerType} Ambulance API result:`, result);
      
      if (result.success && result.data) {
        // Handle single object vs array response
        let ambulanceData = Array.isArray(result.data) ? result.data : [result.data];
        
        // Transform ambulance data to match vehicle format
        const transformedData = ambulanceData.map((ambulance: Ambulance) => ({
          _id: ambulance.id,
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

  const openModal = async (label: string, value: string, fieldType: string, vehicle: Vehicle) => {
    try {
      // Fetch detailed ambulance information based on owner type using registration number
      let apiEndpoint = '';
      if (currentOwnerType === 'FLEET_OWNER') {
        apiEndpoint = `https://api.india.ambuvians.in/api/fleetOwner/ambulance-rc/?reg_no=${vehicle.vehicleNumber}`;
      } else if (currentOwnerType === 'DRIVER') {
        apiEndpoint = `https://api.india.ambuvians.in/api/driver/ambulance-rc/?reg_no=${vehicle.vehicleNumber}`;
      }

      if (apiEndpoint) {
        const response = await axios.get(apiEndpoint);
        console.log(`Detailed ambulance RC data for ${currentOwnerType}:`, response.data);
        
        // Use the detailed data from API response
        const detailedData = response.data.success ? response.data.data : vehicle;
        
        setModalData({ 
          isOpen: true, 
          fieldLabel: "Ambulance RC Details", 
          fieldValue: vehicle.vehicleNumber, // Pass vehicle number as fieldValue
          fieldType: "ambulanceDetails", // Use "ambulanceDetails" fieldType to trigger formatted display
          vehicleId: vehicle._id,
          vehicleDetails: detailedData // Pass the detailed RC data as kycDetails
        });
      } else {
        // Fallback to original behavior if ownerType is not recognized
        setModalData({ 
          isOpen: true, 
          fieldLabel: label, 
          fieldValue: value,
          fieldType: fieldType,
          vehicleId: vehicle._id,
          vehicleDetails: vehicle
        });
      }
    } catch (error) {
      console.error(`Error fetching detailed ambulance RC data for ${currentOwnerType}:`, error);
      // Fallback to original behavior if API call fails
      setModalData({ 
        isOpen: true, 
        fieldLabel: label, 
        fieldValue: value,
        fieldType: fieldType,
        vehicleId: vehicle._id,
        vehicleDetails: vehicle
      });
    }
  };

  const closeModal = () => {
    setModalData({ 
      ...modalData, 
      isOpen: false 
    });
  };

  const handleApprovalUpdate = () => {
    // Refresh the vehicles data after approval update
    fetchVehicles();
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
        <div className="min-w-[800px] h-[650px]">
          <div className="grid grid-cols-[repeat(4,minmax(150px,1fr))] gap-x-12 font-semibold w-full p-2 rounded-t text-nowrap bg-sky-50">
            <div>Vehicle ID</div>
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
                className="grid grid-cols-[repeat(4,minmax(150px,1fr))] gap-x-12 text-sm p-3 items-center hover:bg-gray-50"
              >
                <div 
                  className="text-blue-600 flex gap-1 items-center cursor-pointer"
                  onClick={() => openModal("Ambulance Details", JSON.stringify(vehicle, null, 2), "ambulanceDetails", vehicle)}
                >
                  <span className="truncate font-mono text-sm" title={vehicle._id}>{vehicle._id}</span>
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
                  onClick={() => openModal("Ambulance Details", JSON.stringify(vehicle, null, 2), "ambulanceDetails", vehicle)}
                >
                  <span className="truncate max-w-32" title={vehicle.vehicleNumber}>{vehicle.vehicleNumber}</span>
                  {getApprovalStatusIcon(vehicle._id, 'vehicleNumber')}
                </div>
                <div 
                  className="text-blue-600 flex gap-5 items-center justify-between relative cursor-pointer"
                  onClick={() => openModal("Ambulance Details", JSON.stringify(vehicle, null, 2), "ambulanceDetails", vehicle)}
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
        onApprovalUpdate={handleApprovalUpdate}
      />
    </>
  );
};

export default VehicleDetailsTable; 