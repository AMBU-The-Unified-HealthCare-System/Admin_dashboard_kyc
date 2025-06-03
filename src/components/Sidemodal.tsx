import React from 'react';

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldLabel: string;
  fieldValue: string;
  driverName: string;
  kycDetails?: any; 
  fieldType?: string; 
}

const Sidemodal: React.FC<SideModalProps> = ({
  isOpen,
  onClose,
  fieldLabel,
  fieldValue,
  driverName,
  kycDetails,
  fieldType,
}) => {
  if (!isOpen) return null;

  const renderFieldDetails = () => {
    if (!kycDetails || !fieldType) {
      return (
        <div className="space-y-2">
          <p><strong>{fieldLabel}:</strong> {fieldValue}</p>
        </div>
      );
    }

    switch (fieldType) {
      case 'aadhar':
        { const aadharDetail = kycDetails.aadhaar_detail;
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Aadhaar Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Aadhaar Number:</strong> {aadharDetail?.aadhar_number || 'N/A'}</p>
              <p><strong>Name:</strong> {aadharDetail?.name || 'N/A'}</p>
              <p><strong>DOB:</strong> {aadharDetail?.dob ? new Date(aadharDetail.dob).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Gender:</strong> {aadharDetail?.gender || 'N/A'}</p>
              <p><strong>Care Of:</strong> {aadharDetail?.care_of || 'N/A'}</p>
              <p><strong>Email:</strong> {aadharDetail?.email || 'N/A'}</p>
              <p><strong>Address:</strong> {aadharDetail?.address || 'N/A'}</p>
              <p><strong>Status:</strong> {aadharDetail?.status || 'N/A'}</p>
              <p><strong>Year of Birth:</strong> {aadharDetail?.year_of_birth || 'N/A'}</p>
              {aadharDetail?.split_address && (
                <div>
                  <strong>Split Address:</strong>
                  <div className="ml-4 mt-1">
                    <p>Country: {aadharDetail.split_address.country || 'N/A'}</p>
                    <p>State: {aadharDetail.split_address.state || 'N/A'}</p>
                    <p>District: {aadharDetail.split_address.dist || 'N/A'}</p>
                    <p>Pincode: {aadharDetail.split_address.pincode || 'N/A'}</p>
                    <p>House: {aadharDetail.split_address.house || 'N/A'}</p>
                    <p>Street: {aadharDetail.split_address.street || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ); }

      case 'pan':
        { const panDetail = kycDetails.pan_detail;
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">PAN Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>PAN Number:</strong> {panDetail?.pan || 'N/A'}</p>
              <p><strong>Name:</strong> {panDetail?.name || 'N/A'}</p>
              <p><strong>DOB:</strong> {panDetail?.dob ? new Date(panDetail.dob).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Status:</strong> {panDetail?.status || 'N/A'}</p>
              <p><strong>PAN Status:</strong> {panDetail?.pan_status || 'N/A'}</p>
              <p><strong>Name Match:</strong> {panDetail?.name_match || 'N/A'}</p>
              <p><strong>DOB Match:</strong> {panDetail?.dob_match || 'N/A'}</p>
              <p><strong>Aadhaar Seeding Status:</strong> {panDetail?.aadhaar_seeding_status || 'N/A'}</p>
              <p><strong>Reference ID:</strong> {panDetail?.reference_id || 'N/A'}</p>
            </div>
          </div>
        ); }

      case 'dl':
        { const dlDetail = kycDetails.dl_detail;
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Driving License Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>DL Number:</strong> {dlDetail?.dl_number || 'N/A'}</p>
              <p><strong>DOB:</strong> {dlDetail?.dob ? new Date(dlDetail.dob).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Status:</strong> {dlDetail?.status || 'N/A'}</p>
              {dlDetail?.details_of_driving_licence && (
                <div>
                  <strong>License Details:</strong>
                  <div className="ml-4 mt-1">
                    <p>Name: {dlDetail.details_of_driving_licence.name || 'N/A'}</p>
                    <p>Father/Husband Name: {dlDetail.details_of_driving_licence.father_or_husband_name || 'N/A'}</p>
                    <p>Address: {dlDetail.details_of_driving_licence.address || 'N/A'}</p>
                    <p>Date of Issue: {dlDetail.details_of_driving_licence.date_of_issue ? new Date(dlDetail.details_of_driving_licence.date_of_issue).toLocaleDateString() : 'N/A'}</p>
                    <p>COV Details: {dlDetail.details_of_driving_licence.cov_details?.join(', ') || 'N/A'}</p>
                  </div>
                </div>
              )}
              {dlDetail?.dl_validity && (
                <div>
                  <strong>Validity:</strong>
                  <div className="ml-4 mt-1">
                    {dlDetail.dl_validity.non_transport && (
                      <p>Non-Transport: {new Date(dlDetail.dl_validity.non_transport.from).toLocaleDateString()} to {new Date(dlDetail.dl_validity.non_transport.to).toLocaleDateString()}</p>
                    )}
                    {dlDetail.dl_validity.transport?.from && (
                      <p>Transport: {new Date(dlDetail.dl_validity.transport.from).toLocaleDateString()} to {dlDetail.dl_validity.transport.to ? new Date(dlDetail.dl_validity.transport.to).toLocaleDateString() : 'N/A'}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ); }

      case 'bank':
        { const bankDetail = kycDetails.bank_detail;
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Bank Account Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Reference ID:</strong> {bankDetail?.reference_id || 'N/A'}</p>
              <p><strong>Name at Bank:</strong> {bankDetail?.name_at_bank || 'N/A'}</p>
              <p><strong>Bank Name:</strong> {bankDetail?.bank_name || 'N/A'}</p>
              <p><strong>Branch:</strong> {bankDetail?.branch || 'N/A'}</p>
              <p><strong>City:</strong> {bankDetail?.city || 'N/A'}</p>
              <p><strong>MICR:</strong> {bankDetail?.micr || 'N/A'}</p>
              <p><strong>Account Status:</strong> {bankDetail?.account_status || 'N/A'}</p>
              <p><strong>Account Status Code:</strong> {bankDetail?.account_status_code || 'N/A'}</p>
              <p><strong>Name Match Score:</strong> {bankDetail?.name_match_score || 'N/A'}</p>
              <p><strong>Name Match Result:</strong> {bankDetail?.name_match_result || 'N/A'}</p>
              <p><strong>UTR:</strong> {bankDetail?.utr || 'N/A'}</p>
            </div>
          </div>
        ); }

      case 'rc':
        { const rcDetail = kycDetails.rc_detail;
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Registration Certificate Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Registration Number:</strong> {rcDetail?.reg_no || 'N/A'}</p>
              <p><strong>Vehicle Number:</strong> {rcDetail?.vehicle_number || 'N/A'}</p>
              <p><strong>Owner:</strong> {rcDetail?.owner || 'N/A'}</p>
              <p><strong>Vehicle Manufacturer:</strong> {rcDetail?.vehicle_manufacturer_name || 'N/A'}</p>
              <p><strong>Vehicle Model:</strong> {rcDetail?.vehicle_model || 'N/A'}</p>
              <p><strong>Vehicle Colour:</strong> {rcDetail?.vehicle_colour || 'N/A'}</p>
              <p><strong>Class:</strong> {rcDetail?.class || 'N/A'}</p>
              <p><strong>Chassis:</strong> {rcDetail?.chassis || 'N/A'}</p>
              <p><strong>Engine:</strong> {rcDetail?.engine || 'N/A'}</p>
              <p><strong>Registration Date:</strong> {rcDetail?.reg_date ? new Date(rcDetail.reg_date).toLocaleDateString() : 'N/A'}</p>
              <p><strong>RC Expiry Date:</strong> {rcDetail?.rc_expiry_date ? new Date(rcDetail.rc_expiry_date).toLocaleDateString() : 'N/A'}</p>
              <p><strong>RC Status:</strong> {rcDetail?.rc_status || 'N/A'}</p>
              <p><strong>Vehicle Category:</strong> {rcDetail?.vehicle_category || 'N/A'}</p>
              <p><strong>Seat Capacity:</strong> {rcDetail?.vehicle_seat_capacity || 'N/A'}</p>
              <p><strong>Insurance Company:</strong> {rcDetail?.vehicle_insurance_company_name || 'N/A'}</p>
              <p><strong>Insurance Valid Upto:</strong> {rcDetail?.vehicle_insurance_upto ? new Date(rcDetail.vehicle_insurance_upto).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Insurance Policy Number:</strong> {rcDetail?.vehicle_insurance_policy_number || 'N/A'}</p>
            </div>
          </div>
        ); }

      default:
        return (
          <div className="space-y-2">
            <p><strong>{fieldLabel}:</strong> {fieldValue}</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed top-0 right-0 w-[350px] h-full bg-white shadow-xl border-l border-gray-200 z-50 p-4 flex flex-col">
      {/* Close Button */}
      <div className="flex justify-end items-center pb-2">
        <button onClick={onClose} className="text-gray-500 hover:text-black text-xl cursor-pointer">
          ✕
        </button>
      </div>

      {/* Modal Content */}
      <div className="space-y-4 overflow-y-auto">
        {renderFieldDetails()}

        <textarea
          placeholder="Reason for accepting or rejecting"
          maxLength={100}
          className="w-full border p-2 rounded resize-none"
        />
      </div>

      {/* Action Buttons - Stick to bottom */}
      <div className="flex gap-3 justify-center pt-4 mt-auto">
        <button className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">
          Decline
        </button>
        <button className="bg-red-300 text-white px-4 py-2 rounded cursor-pointer">
          Hold
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
          Approve
        </button>
      </div>
    </div>
  );
};

export default Sidemodal;