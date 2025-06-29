import axios from "axios";
import React, { useState } from "react";

interface DetailedInfo {
  firstName?: string;
  LastName?: string;
  dlId?: string;
  phoneNumber?: string;
  isEmailVerified?: boolean;
  isPhoneNumberVerified?: boolean;
  kyc?: string;
  kycStep?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  registrationId?: string;
  ambulanceType?: string;
  vehicleNumber?: string;
  model?: string;
  insuranceNumber?: string;
  esign_document?: {
    status?: string;
  };
  driverDefaultLocation?: {
    type?: string;
    coordinates?: number[];
  };
  driversCurrentLocation?: {
    type?: string;
    coordinates?: number[];
  };
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
  defaultLocation?: {
    type?: string;
    coordinates?: number[];
  };
  [key: string]: unknown; // Allow additional properties
}

interface KycDetails {
  aadhaar_detail?: any;
  pan_detail?: any;
  dl_detail?: any;
  bank_detail?: any;
  rc_detail?: any;
  isEmailVerified?: boolean;
  vehicleNumber?: string;
  model?: string;
  reg_no?: string;
  vehicle_number?: string;
  owner?: string;
  owner_count?: string;
  vehicle_manufacturer_name?: string;
  vehicle_colour?: string;
  type?: string;
  class?: string;
  chassis?: string;
  engine?: string;
  reg_date?: string;
  rc_expiry_date?: string;
  rc_status?: string;
  status?: string;
  vehicle_category?: string;
  vehicle_seat_capacity?: string;
  vehicle_cubic_capacity?: string;
  gross_vehicle_weight?: string;
  unladen_weight?: string;
  vehicle_insurance_company_name?: string;
  vehicle_insurance_upto?: string;
  vehicle_insurance_policy_number?: string;
  pucc_number?: string;
  pucc_upto?: string;
  rc_financer?: string;
  verification_id?: string;
  reference_id?: string;
  ambulanceId?: string;
  [key: string]: any; // Allow additional properties
}

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldLabel: string;
  fieldValue: string;
  driverName: string;
  driverId: string;
  kycDetails?: KycDetails | null;
  fieldType?: string;
  detailedInfo?: DetailedInfo | null;
  onApprovalUpdate?: () => void;
  ownerType?: string;
}

const Sidemodal: React.FC<SideModalProps> = ({
  isOpen,
  onClose,
  fieldLabel,
  fieldValue,
  driverId,
  kycDetails,
  fieldType,
  detailedInfo,
  onApprovalUpdate,
  ownerType,
}) => {
  const [remark, setRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState("");
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);

  if (!isOpen) return null;

  // Google Places API function
  // const fetchPlaces = async (query: string) => {
  //   try {
  //     const apiKey = import.meta.env.VITE_GOOGLE_PLACE_SEARCH_KEY;
  //     if (!apiKey) {
  //       console.error("Google Places API key is missing");
  //       return null;
  //     }

  //     // Step 1: Autocomplete API
  //     const autocompleteResponse = await axios.get(
  //       "https://maps.googleapis.com/maps/api/place/autocomplete/json",
  //       {
  //         params: {
  //           input: query,
  //           key: apiKey,
  //         },
  //       }
  //     );

  //     const predictions = autocompleteResponse.data.predictions;
  //     if (!predictions || predictions.length === 0) {
  //       console.warn("No predictions found for input:", query);
  //       return null;
  //     }

  //     const mostRelevant = predictions[0];
  //     console.log("Most relevant prediction:", mostRelevant);

  //     // Step 2: Place Details API (geometry only)
  //     const detailsResponse = await axios.get(
  //       "https://maps.googleapis.com/maps/api/place/details/json",
  //       {
  //         params: {
  //           place_id: mostRelevant.place_id,
  //           fields: "geometry",
  //           key: apiKey,
  //         },
  //       }
  //     );

  //     const location = detailsResponse.data.result?.geometry?.location;

  //     const coordinates: {
  //       type: "Point";
  //       coordinates: [number, number] | [];
  //     } = {
  //       type: "Point",
  //       coordinates: location ? [location.lng, location.lat] : [],
  //     };

  //     if (location) {
  //       console.log("Coordinates found:", coordinates);
  //     } else {
  //       console.warn("No location found in details response");
  //     }

  //     const formattedAddress = {
  //       placeName: mostRelevant.structured_formatting.main_text,
  //       placeAddress: mostRelevant.description,
  //       alternateName: null,
  //       eLoc: mostRelevant.place_id,
  //       coordinates,
  //     };

  //     return formattedAddress;
  //   } catch (error) {
  //     console.error("Error in fetchPlaces:", error);
  //     return null;
  //   }
  // };

  // Map fieldType to database field names
  const getApprovalFieldName = (fieldType: string) => {
    switch (fieldType) {
      case "aadhar":
        return "aadhaar_details";
      case "pan":
        return "pan_details";
      case "dl":
        return "dl_details";
      case "bank":
        return "bank_details";
      case "rc":
        return "rc_details";
      case "email":
        return "email_id";
      case "address":
        return "address";
      case "ambulance_category":
        return "ambulance_category";
      default:
        return null;
    }
  };

  const handleAddressUpdate = async () => {
    if (!editedAddress.trim()) {
      alert("Please enter a valid address");
      return;
    }

    setIsUpdatingAddress(true);
    try {
      const formattedAddress = editedAddress.trim();

      if (!formattedAddress) {
        throw new Error(
          "Failed to get formatted address from Google Places API"
        );
      }

      // Use the new fleet owner address update endpoint
      const apiEndpoint = `${import.meta.env.VITE_BACKEND_URL}/api/fleetOwner/address/${driverId}`;

      const response = await axios.put(apiEndpoint, {
        address: formattedAddress,
      });

      if (response.data.success) {
        alert("Address updated successfully!");
        setIsEditingAddress(false);
        setEditedAddress("");
        if (onApprovalUpdate) {
          onApprovalUpdate();
        }
      } else {
        throw new Error(response.data.message || "Failed to update address");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update address"
      );
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  const handleApproval = async (
    status: "ACCEPTED" | "DECLINED" | "PENDING"
  ) => {
    if (!fieldType || !driverId) {
      alert("Missing required information");
      return;
    }

    // Handle Aadhar verification
    if (fieldType === "aadhar") {
      try {
        // Get the Aadhar details ID from kycDetails
        const aadharId = kycDetails?.aadhaar_detail?.id || kycDetails?.aadharDetails?.id;
        
        if (!aadharId) {
          alert("Aadhar ID not found");
          return;
        }

        // Use the correct API endpoint based on owner type
        const apiEndpoint = ownerType === 'DRIVER' 
          ? `${import.meta.env.VITE_BACKEND_URL}/api/driver/aadhar/${aadharId}`
          : `${import.meta.env.VITE_BACKEND_URL}/api/fleetOwner/aadhar/${aadharId}`;
        
        const response = await axios.put(apiEndpoint, {
          isVerified: status === "ACCEPTED",
        });

        if (response.data.success) {
          alert(`Aadhar verification ${status.toLowerCase()} successfully!`);
          setRemark("");
          onClose();
          if (onApprovalUpdate) {
            onApprovalUpdate();
          }
        } else {
          throw new Error(
            response.data.message || "Failed to update verification status"
          );
        }
      } catch (error) {
        console.error("Error updating Aadhar verification:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to update verification status"
        );
      }
      return;
    }

    // Handle Driving License verification
    if (fieldType === "dl") {
      try {
        // Get the DL details ID from kycDetails
        const dlId = kycDetails?.dl_detail?.id || kycDetails?.drivingLicenseDetails?.id;
        
        if (!dlId) {
          alert("Driving License ID not found");
          return;
        }

        // Use the correct API endpoint based on owner type
        const apiEndpoint = ownerType === 'DRIVER' 
          ? `${import.meta.env.VITE_BACKEND_URL}/api/driver/driving-license/${dlId}`
          : `${import.meta.env.VITE_BACKEND_URL}/api/fleetOwner/driving-license/${dlId}`;
        
        const response = await axios.put(apiEndpoint, {
          isVerified: status === "ACCEPTED",
        });

        if (response.data.success) {
          alert(`Driving License verification ${status.toLowerCase()} successfully!`);
          setRemark("");
          onClose();
          if (onApprovalUpdate) {
            onApprovalUpdate();
          }
        } else {
          throw new Error(
            response.data.message || "Failed to update verification status"
          );
        }
      } catch (error) {
        console.error("Error updating Driving License verification:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to update verification status"
        );
      }
      return;
    }

    // Handle ambulance verification
    if (fieldType === "ambulanceDetails") {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/ambulance/${driverId}`,
          {
            isVerified: status === "ACCEPTED",
          }
        );

        if (response.data.success) {
          alert(`Ambulance verification ${status.toLowerCase()} successfully!`);
          setRemark("");
          onClose();
          if (onApprovalUpdate) {
            onApprovalUpdate();
          }
        } else {
          throw new Error(
            response.data.message || "Failed to update verification status"
          );
        }
      } catch (error) {
        console.error("Error updating ambulance verification:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to update verification status"
        );
      }
      return;
    }

    const approvalField = getApprovalFieldName(fieldType);
    if (!approvalField) {
      alert("Invalid field type");
      return;
    }

    if (status === "DECLINED" && !remark.trim()) {
      alert("Please provide a reason for declining");
      return;
    }

    setIsSubmitting(true);

    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

      const response = await axios.post(`${backendUrl}/driver/approval`, {
        driverId,
        fieldType: approvalField,
        status,
        remark: remark.trim() || undefined,
      });

      const result = response.data;

      if (result.success) {
        alert(`${fieldLabel} ${status.toLowerCase()} successfully!`);
        setRemark("");
        onClose();
        if (onApprovalUpdate) {
          onApprovalUpdate();
        }
      } else {
        throw new Error(result.message || "Failed to update approval status");
      }
    } catch (error) {
      console.error("Error updating approval:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update approval status"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldDetails = () => {
    // Handle detailed info display
    if (fieldType === "details" && detailedInfo) {
      // Check if it's driver data (has firstName field)
      if (detailedInfo.firstName) {
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {fieldLabel}
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>First Name:</strong> {detailedInfo.firstName || "N/A"}
              </p>
              <p>
                <strong>Last Name:</strong> {detailedInfo.LastName || "N/A"}
              </p>
              <p>
                <strong>DL ID:</strong> {detailedInfo.dlId || "N/A"}
              </p>
              <p>
                <strong>Phone Number:</strong>{" "}
                {detailedInfo.phoneNumber || "N/A"}
              </p>
              <p>
                <strong>Email Verified:</strong>{" "}
                {detailedInfo.isEmailVerified ? "Yes" : "No"}
              </p>
              <p>
                <strong>Phone Verified:</strong>{" "}
                {detailedInfo.isPhoneNumberVerified ? "Yes" : "No"}
              </p>
              <p>
                <strong>KYC Status:</strong> {detailedInfo.kyc || "N/A"}
              </p>
              <p>
                <strong>KYC Step:</strong> {detailedInfo.kycStep || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {detailedInfo.status || "N/A"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {detailedInfo.createdAt
                  ? new Date(detailedInfo.createdAt).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {detailedInfo.updatedAt
                  ? new Date(detailedInfo.updatedAt).toLocaleString()
                  : "N/A"}
              </p>

              <div className="border-t pt-2 mt-2">
                <h4 className="font-semibold text-gray-700">
                  Vehicle Information
                </h4>
                <p>
                  <strong>Ambulance Type:</strong>{" "}
                  {detailedInfo.ambulanceType || "N/A"}
                </p>
                <p>
                  <strong>Vehicle Number:</strong>{" "}
                  {detailedInfo.vehicleNumber || "N/A"}
                </p>
                <p>
                  <strong>Model:</strong> {detailedInfo.model || "N/A"}
                </p>
                <p>
                  <strong>Insurance Number:</strong>{" "}
                  {detailedInfo.insuranceNumber || "N/A"}
                </p>
              </div>

              {detailedInfo.esign_document && (
                <div className="border-t pt-2 mt-2">
                  <h4 className="font-semibold text-gray-700">
                    eSign Document
                  </h4>
                  <p>
                    <strong>Status:</strong>{" "}
                    {detailedInfo.esign_document.status || "N/A"}
                  </p>
                </div>
              )}

              {detailedInfo.driverDefaultLocation && (
                <div className="border-t pt-2 mt-2">
                  <h4 className="font-semibold text-gray-700">
                    Default Location
                  </h4>
                  <p>
                    <strong>Type:</strong>{" "}
                    {detailedInfo.driverDefaultLocation.type || "N/A"}
                  </p>
                  <p>
                    <strong>Coordinates:</strong> [
                    {detailedInfo.driverDefaultLocation.coordinates?.join(", ") || "N/A"}]
                  </p>
                </div>
              )}

              {detailedInfo.driversCurrentLocation && (
                <div className="border-t pt-2 mt-2">
                  <h4 className="font-semibold text-gray-700">
                    Current Location
                  </h4>
                  <p>
                    <strong>Type:</strong>{" "}
                    {detailedInfo.driversCurrentLocation.type || "N/A"}
                  </p>
                  <p>
                    <strong>Coordinates:</strong> [
                    {detailedInfo.driversCurrentLocation.coordinates?.join(", ") || "N/A"}
                    ]
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      }

      // Fleet Owner data (has registrationId field)
      return (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">{fieldLabel}</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Registration ID:</strong>{" "}
              {detailedInfo.registrationId || "N/A"}
            </p>
            <p>
              <strong>Phone Number:</strong> {detailedInfo.phoneNumber || "N/A"}
            </p>
            <p>
              <strong>Email Verified:</strong>{" "}
              {detailedInfo.isEmailVerified ? "Yes" : "No"}
            </p>
            <p>
              <strong>Phone Verified:</strong>{" "}
              {detailedInfo.isPhoneNumberVerified ? "Yes" : "No"}
            </p>
            <p>
              <strong>KYC Status:</strong> {detailedInfo.kyc || "N/A"}
            </p>
            <p>
              <strong>KYC Step:</strong> {detailedInfo.kycStep || "N/A"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {detailedInfo.createdAt
                ? new Date(detailedInfo.createdAt).toLocaleString()
                : "N/A"}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {detailedInfo.updatedAt
                ? new Date(detailedInfo.updatedAt).toLocaleString()
                : "N/A"}
            </p>

            {detailedInfo.address && (
              <div>
                <strong>Address:</strong>
                <div className="ml-4 mt-1">
                  <p>Place Name: {detailedInfo.address.placeName || "N/A"}</p>
                  <p>
                    Full Address: {detailedInfo.address.placeAddress || "N/A"}
                  </p>
                  <p>
                    Alternate Name:{" "}
                    {detailedInfo.address.alternateName || "N/A"}
                  </p>
                  <p>eLoc: {detailedInfo.address.eLoc || "N/A"}</p>
                  {detailedInfo.address.coordinates && (
                    <p>
                      Coordinates: [
                      {detailedInfo.address.coordinates.coordinates.join(", ")}]
                    </p>
                  )}
                </div>
              </div>
            )}

            {detailedInfo.defaultLocation && (
              <div>
                <strong>Default Location:</strong>
                <div className="ml-4 mt-1">
                  <p>Type: {detailedInfo.defaultLocation.type || "N/A"}</p>
                  <p>
                    Coordinates: [
                    {detailedInfo.defaultLocation.coordinates?.join(", ") || "N/A"}]
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (!kycDetails || !fieldType) {
      return (
        <div className="space-y-2">
          <p>
            <strong>{fieldLabel}:</strong> {fieldValue}
          </p>
        </div>
      );
    }

    switch (fieldType) {
      case "email":
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Email Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Email ID:</strong> {fieldValue}
              </p>
              <p>
                <strong>Verification Status:</strong>{" "}
                {kycDetails.isEmailVerified ? "Verified" : "Not Verified"}
              </p>
            </div>
          </div>
        );

      case "address":
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Address Details
            </h3>
            <div className="space-y-2 text-sm">
              {isEditingAddress ? (
                <div className="space-y-2">
                  <p>
                    <strong>Current Address:</strong> {fieldValue}
                  </p>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      New Address:
                    </label>
                    <textarea
                      value={editedAddress}
                      onChange={(e) => setEditedAddress(e.target.value)}
                      className="w-full border p-2 rounded resize-none"
                      rows={3}
                      placeholder="Enter new address..."
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p>
                    <strong>Address:</strong> {fieldValue}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case "ambulance_category":
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Ambulance Category Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Category:</strong> {fieldValue}
              </p>
              <p>
                <strong>Vehicle Number:</strong>{" "}
                {kycDetails.vehicleNumber || "N/A"}
              </p>
              <p>
                <strong>Model:</strong> {kycDetails.model || "N/A"}
              </p>
            </div>
          </div>
        );

      case "aadhar": {
        const aadharDetail = kycDetails.aadhaar_detail;
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Aadhaar Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Aadhaar Number:</strong>{" "}
                {aadharDetail?.aadhar_number || "N/A"}
              </p>
              <p>
                <strong>Name:</strong> {aadharDetail?.name || "N/A"}
              </p>
              <p>
                <strong>DOB:</strong>{" "}
                {aadharDetail?.dob
                  ? new Date(aadharDetail.dob).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Gender:</strong> {aadharDetail?.gender || "N/A"}
              </p>
              <p>
                <strong>Care Of:</strong> {aadharDetail?.care_of || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {aadharDetail?.email || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {aadharDetail?.address || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {aadharDetail?.status || "N/A"}
              </p>
              <p>
                <strong>Year of Birth:</strong>{" "}
                {aadharDetail?.year_of_birth || "N/A"}
              </p>
              {aadharDetail?.split_address && (
                <div>
                  <strong>Split Address:</strong>
                  <div className="ml-4 mt-1">
                    <p>
                      Country: {aadharDetail.split_address.country || "N/A"}
                    </p>
                    <p>State: {aadharDetail.split_address.state || "N/A"}</p>
                    <p>District: {aadharDetail.split_address.dist || "N/A"}</p>
                    <p>
                      Pincode: {aadharDetail.split_address.pincode || "N/A"}
                    </p>
                    <p>House: {aadharDetail.split_address.house || "N/A"}</p>
                    <p>Street: {aadharDetail.split_address.street || "N/A"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      case "pan": {
        const panDetail = kycDetails.pan_detail;
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">PAN Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>PAN Number:</strong> {panDetail?.pan || "N/A"}
              </p>
              <p>
                <strong>Name:</strong> {panDetail?.name || "N/A"}
              </p>
              <p>
                <strong>DOB:</strong>{" "}
                {panDetail?.dob
                  ? new Date(panDetail.dob).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {panDetail?.status || "N/A"}
              </p>
              <p>
                <strong>PAN Status:</strong> {panDetail?.pan_status || "N/A"}
              </p>
              <p>
                <strong>Name Match:</strong> {panDetail?.name_match || "N/A"}
              </p>
              <p>
                <strong>DOB Match:</strong> {panDetail?.dob_match || "N/A"}
              </p>
              <p>
                <strong>Aadhaar Seeding Status:</strong>{" "}
                {panDetail?.aadhaar_seeding_status || "N/A"}
              </p>
              <p>
                <strong>Reference ID:</strong>{" "}
                {panDetail?.reference_id || "N/A"}
              </p>
            </div>
          </div>
        );
      }

      case "dl": {
        const dlDetail = kycDetails.dl_detail;
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Driving License Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>DL Number:</strong> {dlDetail?.dl_number || "N/A"}
              </p>
              <p>
                <strong>DOB:</strong>{" "}
                {dlDetail?.dob
                  ? new Date(dlDetail.dob).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {dlDetail?.status || "N/A"}
              </p>
              {dlDetail?.details_of_driving_licence && (
                <div>
                  <strong>License Details:</strong>
                  <div className="ml-4 mt-1">
                    <p>
                      Name: {dlDetail.details_of_driving_licence.name || "N/A"}
                    </p>
                    <p>
                      Father/Husband Name:{" "}
                      {dlDetail.details_of_driving_licence
                        .father_or_husband_name || "N/A"}
                    </p>
                    <p>
                      Address:{" "}
                      {dlDetail.details_of_driving_licence.address || "N/A"}
                    </p>
                    <p>
                      Date of Issue:{" "}
                      {dlDetail.details_of_driving_licence.date_of_issue
                        ? new Date(
                            dlDetail.details_of_driving_licence.date_of_issue
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      COV Details:{" "}
                      {dlDetail.details_of_driving_licence.cov_details?.join(
                        ", "
                      ) || "N/A"}
                    </p>
                  </div>
                </div>
              )}
              {dlDetail?.dl_validity && (
                <div>
                  <strong>Validity:</strong>
                  <div className="ml-4 mt-1">
                    {dlDetail.dl_validity.non_transport && (
                      <p>
                        Non-Transport:{" "}
                        {new Date(
                          dlDetail.dl_validity.non_transport.from
                        ).toLocaleDateString()}{" "}
                        to{" "}
                        {new Date(
                          dlDetail.dl_validity.non_transport.to
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {dlDetail.dl_validity.transport?.from && (
                      <p>
                        Transport:{" "}
                        {new Date(
                          dlDetail.dl_validity.transport.from
                        ).toLocaleDateString()}{" "}
                        to{" "}
                        {dlDetail.dl_validity.transport.to
                          ? new Date(
                              dlDetail.dl_validity.transport.to
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      case "bank": {
        const bankDetail = kycDetails.bank_detail;
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Bank Account Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Reference ID:</strong>{" "}
                {bankDetail?.reference_id || "N/A"}
              </p>
              <p>
                <strong>Name at Bank:</strong>{" "}
                {bankDetail?.name_at_bank || "N/A"}
              </p>
              <p>
                <strong>Bank Name:</strong> {bankDetail?.bank_name || "N/A"}
              </p>
              <p>
                <strong>Branch:</strong> {bankDetail?.branch || "N/A"}
              </p>
              <p>
                <strong>City:</strong> {bankDetail?.city || "N/A"}
              </p>
              <p>
                <strong>MICR:</strong> {bankDetail?.micr || "N/A"}
              </p>
              <p>
                <strong>Account Status:</strong>{" "}
                {bankDetail?.account_status || "N/A"}
              </p>
              <p>
                <strong>Account Status Code:</strong>{" "}
                {bankDetail?.account_status_code || "N/A"}
              </p>
              <p>
                <strong>Name Match Score:</strong>{" "}
                {bankDetail?.name_match_score || "N/A"}
              </p>
              <p>
                <strong>Name Match Result:</strong>{" "}
                {bankDetail?.name_match_result || "N/A"}
              </p>
              <p>
                <strong>UTR:</strong> {bankDetail?.utr || "N/A"}
              </p>
            </div>
          </div>
        );
      }

      case "rc": {
        const rcDetail = kycDetails.rc_detail;
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Registration Certificate Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Registration Number:</strong>{" "}
                {rcDetail?.reg_no || "N/A"}
              </p>
              <p>
                <strong>Vehicle Number:</strong>{" "}
                {rcDetail?.vehicle_number || "N/A"}
              </p>
              <p>
                <strong>Owner:</strong> {rcDetail?.owner || "N/A"}
              </p>
              <p>
                <strong>Vehicle Manufacturer:</strong>{" "}
                {rcDetail?.vehicle_manufacturer_name || "N/A"}
              </p>
              <p>
                <strong>Vehicle Model:</strong>{" "}
                {rcDetail?.vehicle_model || "N/A"}
              </p>
              <p>
                <strong>Vehicle Colour:</strong>{" "}
                {rcDetail?.vehicle_colour || "N/A"}
              </p>
              <p>
                <strong>Class:</strong> {rcDetail?.class || "N/A"}
              </p>
              <p>
                <strong>Chassis:</strong> {rcDetail?.chassis || "N/A"}
              </p>
              <p>
                <strong>Engine:</strong> {rcDetail?.engine || "N/A"}
              </p>
              <p>
                <strong>Registration Date:</strong>{" "}
                {rcDetail?.reg_date
                  ? new Date(rcDetail.reg_date).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>RC Expiry Date:</strong>{" "}
                {rcDetail?.rc_expiry_date
                  ? new Date(rcDetail.rc_expiry_date).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>RC Status:</strong> {rcDetail?.rc_status || "N/A"}
              </p>
              <p>
                <strong>Vehicle Category:</strong>{" "}
                {rcDetail?.vehicle_category || "N/A"}
              </p>
              <p>
                <strong>Seat Capacity:</strong>{" "}
                {rcDetail?.vehicle_seat_capacity || "N/A"}
              </p>
              <p>
                <strong>Insurance Company:</strong>{" "}
                {rcDetail?.vehicle_insurance_company_name || "N/A"}
              </p>
              <p>
                <strong>Insurance Valid Upto:</strong>{" "}
                {rcDetail?.vehicle_insurance_upto
                  ? new Date(
                      rcDetail.vehicle_insurance_upto
                    ).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Insurance Policy Number:</strong>{" "}
                {rcDetail?.vehicle_insurance_policy_number || "N/A"}
              </p>
            </div>
          </div>
        );
      }

      case "ambulanceDetails":
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Ambulance RC Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Registration Number:</strong>{" "}
                {kycDetails?.reg_no || "N/A"}
              </p>
              <p>
                <strong>Vehicle Number:</strong>{" "}
                {kycDetails?.vehicle_number || "N/A"}
              </p>
              <p>
                <strong>Owner:</strong> {kycDetails?.owner || "N/A"}
              </p>
              <p>
                <strong>Owner Count:</strong> {kycDetails?.owner_count || "N/A"}
              </p>
              <p>
                <strong>Vehicle Manufacturer:</strong>{" "}
                {kycDetails?.vehicle_manufacturer_name || "N/A"}
              </p>
              <p>
                <strong>Vehicle Colour:</strong>{" "}
                {kycDetails?.vehicle_colour || "N/A"}
              </p>
              <p>
                <strong>Vehicle Type:</strong> {kycDetails?.type || "N/A"}
              </p>
              <p>
                <strong>Class:</strong> {kycDetails?.class || "N/A"}
              </p>
              <p>
                <strong>Chassis Number:</strong> {kycDetails?.chassis || "N/A"}
              </p>
              <p>
                <strong>Engine Number:</strong> {kycDetails?.engine || "N/A"}
              </p>
              <p>
                <strong>Registration Date:</strong>{" "}
                {kycDetails?.reg_date
                  ? new Date(kycDetails.reg_date).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>RC Expiry Date:</strong>{" "}
                {kycDetails?.rc_expiry_date
                  ? new Date(kycDetails.rc_expiry_date).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>RC Status:</strong> {kycDetails?.rc_status || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {kycDetails?.status || "N/A"}
              </p>
              <p>
                <strong>Vehicle Category:</strong>{" "}
                {kycDetails?.vehicle_category || "N/A"}
              </p>
              <p>
                <strong>Seat Capacity:</strong>{" "}
                {kycDetails?.vehicle_seat_capacity || "N/A"}
              </p>
              <p>
                <strong>Cubic Capacity:</strong>{" "}
                {kycDetails?.vehicle_cubic_capacity || "N/A"} cc
              </p>
              <p>
                <strong>Gross Vehicle Weight:</strong>{" "}
                {kycDetails?.gross_vehicle_weight || "N/A"} kg
              </p>
              <p>
                <strong>Unladen Weight:</strong>{" "}
                {kycDetails?.unladen_weight || "N/A"} kg
              </p>

              <div className="border-t pt-2 mt-2">
                <h4 className="font-semibold text-gray-700">
                  Insurance Details
                </h4>
                <p>
                  <strong>Insurance Company:</strong>{" "}
                  {kycDetails?.vehicle_insurance_company_name || "N/A"}
                </p>
                <p>
                  <strong>Insurance Valid Upto:</strong>{" "}
                  {kycDetails?.vehicle_insurance_upto
                    ? new Date(
                        kycDetails.vehicle_insurance_upto
                      ).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Insurance Policy Number:</strong>{" "}
                  {kycDetails?.vehicle_insurance_policy_number || "N/A"}
                </p>
              </div>

              <div className="border-t pt-2 mt-2">
                <h4 className="font-semibold text-gray-700">PUC Details</h4>
                <p>
                  <strong>PUC Number:</strong>{" "}
                  {kycDetails?.pucc_number || "N/A"}
                </p>
                <p>
                  <strong>PUC Valid Upto:</strong>{" "}
                  {kycDetails?.pucc_upto
                    ? new Date(kycDetails.pucc_upto).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="border-t pt-2 mt-2">
                <h4 className="font-semibold text-gray-700">
                  Financing Details
                </h4>
                <p>
                  <strong>RC Financer:</strong>{" "}
                  {kycDetails?.rc_financer || "N/A"}
                </p>
              </div>

              <div className="border-t pt-2 mt-2">
                <h4 className="font-semibold text-gray-700">
                  Reference Information
                </h4>
                <p>
                  <strong>Verification ID:</strong>{" "}
                  {kycDetails?.verification_id || "N/A"}
                </p>
                <p>
                  <strong>Reference ID:</strong>{" "}
                  {kycDetails?.reference_id || "N/A"}
                </p>
                <p>
                  <strong>Ambulance ID:</strong>{" "}
                  {kycDetails?.ambulanceId || "N/A"}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <p>
              <strong>{fieldLabel}:</strong> {fieldValue}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed top-0 right-0 w-[350px] h-full bg-white shadow-xl border-l border-gray-200 z-50 p-4 flex flex-col">
      {/* Close Button */}
      <div className="flex justify-end items-center pb-2">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-black text-xl cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Modal Content */}
      <div className="space-y-4 overflow-y-auto">
        {renderFieldDetails()}

        {/* Only show approval controls if not showing details and not editing address and not address field type */}
        {fieldType !== "details" &&
          !isEditingAddress &&
          fieldType !== "address" && (
            <textarea
              placeholder="Reason for accepting or rejecting"
              maxLength={100}
              className="w-full border p-2 rounded resize-none"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
            />
          )}
      </div>

      {/* Action Buttons */}
      {fieldType !== "details" && (
        <div className="flex gap-3 justify-center pt-4 mt-auto">
          {isEditingAddress ? (
            <>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
                onClick={() => {
                  setIsEditingAddress(false);
                  setEditedAddress("");
                }}
                disabled={isUpdatingAddress}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
                onClick={handleAddressUpdate}
                disabled={isUpdatingAddress || !editedAddress.trim()}
              >
                {isUpdatingAddress ? "Updating..." : "Approve"}
              </button>
            </>
          ) : fieldType === "address" ? (
            // For address field type, only show edit button initially
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
              onClick={() => {
                setIsEditingAddress(true);
                setEditedAddress(fieldValue);
              }}
            >
              Edit Address
            </button>
          ) : (
            <>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
                onClick={() => handleApproval("DECLINED")}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Decline"}
              </button>
              <button
                className="bg-red-300 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
                onClick={() => handleApproval("PENDING")}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Hold"}
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
                onClick={() => handleApproval("ACCEPTED")}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Approve"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidemodal;
