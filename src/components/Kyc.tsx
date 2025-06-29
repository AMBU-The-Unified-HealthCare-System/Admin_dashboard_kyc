import { useState } from "react";
// import { useNavigate } from "react-router-dom";
const KYCForm = () => {

  const [phone, setPhone] = useState("");
  // const [userType, setUserType] = useState("single"); // "single" or "fleet"
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phoneotp, setPhoneOtp] = useState("");
  const [error, setError] = useState("");
  // const navigate = useNavigate();


  const handleGetOtp = () => {

    if (!phone.trim()) {
      setError("Please fill The Details.");
      return;
    }

    setError("");
    setShowOtpInput(true);
  };

  const handleSubmit = () => {

    if(!phoneotp.trim()) {
    setError("Please Fill The OTPs.");
  
    }
    else {
      setError("");
      // navigate("/dashboard", { state: { userType } });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md 2xl:h-[10rem] 2xl:mt-6">
      {!showOtpInput ? (
        <>
          <div className="flex flex-col gap-4">
            {/* User Type Dropdown */}
            {/* <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">User Type</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="border-2 border-[#DB5353] rounded-md px-3 py-2 w-full focus:outline-none focus:border-[#F95D5D] bg-white"
              >
                <option value="single">Single User</option>
                <option value="fleet">Fleet Owner</option>
              </select>
            </div> */}

            <div className="flex items-center">
              <div className="border-2 border-[#DB5353] text-[#F95D5D] px-3 py-2 rounded-l-md">
                +91
              </div>
              <input
                type="text"
                placeholder="Your Mobile Number"
                className="border-2  border-[#DB5353] rounded-r-md px-3 py-2 w-full focus:outline-none focus:border-[#F95D5D]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

        
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleGetOtp}
            className="bg-[#f02b2b] hover:bg-[#e14e4e]  text-white font-semibold py-2 rounded-md transition-colors cursor-pointer"
          >
            Get OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Phone OTP"
            className="border-2 border-[#DB5353] rounded-md px-4 py-2 w-full focus:outline-none focus:border-[#F95D5D]"
            onChange={(e) => setPhoneOtp(e.target.value)}
            value={phoneotp}
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            className="bg-[#f02b2b] hover:bg-[#e14e4e] text-white font-semibold py-2 rounded-md transition-colors cursor-pointer"
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
};

export default KYCForm;
