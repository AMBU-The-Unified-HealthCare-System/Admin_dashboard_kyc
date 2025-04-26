import { useState } from "react";

const KYCForm = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [mailotp, setMailOtp] = useState("");
  const [phoneotp, setPhoneOtp] = useState("");
  const [error, setError] = useState("");

  const handleGetOtp = () => {

    if (!email.trim() || !phone.trim()) {
      setError("Please fill The Details.");
      return;
    }

    setError("");
    setShowOtpInput(true);
  };

  const handleSubmit = () => {

    if(!mailotp.trim() || !phoneotp.trim()) {
    setError("Please Fill The OTPs.");
  
    }
    else {
      setError("");
      alert("OTP Verified Successfully!");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {!showOtpInput ? (
        <>
          <input
            type="email"
            placeholder="Your Email"
            className="border-2 text-center border-[#DB5353] rounded-md px-4 py-2 w-[350px] focus:outline-none focus:border-[#F95D5D]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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

        
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleGetOtp}
            className="bg-[#f02b2b] hover:bg-[#e14e4e] text-white font-semibold py-2 rounded-md transition-colors"
          >
            Get OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Mail OTP"
            className="border-2 border-[#DB5353] rounded-md px-4 py-2 w-full focus:outline-none focus:border-[#F95D5D]"
            onChange={(e) => setMailOtp(e.target.value)}
            value={mailotp}
          />
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
            className="bg-[#f02b2b] hover:bg-[#e14e4e] text-white font-semibold py-2 rounded-md transition-colors"
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
};

export default KYCForm;
