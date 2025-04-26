import KYCForm from "../components/Kyc";

function Admindashboard() {
  return (
    <div className="flex h-[100vh]">
      <div className="lg:basis-[37%] sm:block hidden flex-shrink">
        <img
          src="./login2.png"
          className="h-[100%] object-fill w-full "
          alt="sideimg"
        />
        <div className="absolute flex flex-col justify-center gap-2 text-4xl left-5 bottom-12">
          <span className="font-bold text-slate-200 ">Ambuvians</span>{" "}
          <span className="font-bold text-zinc-400">Healthcare</span>
          <div className="w-full flex flex-col lg:flex-row justify-start gap-4">
            <img
              src="/GooglePlay.png"
              alt="Google Play"
              className="cursor-pointer w-[120px] h-[40px] object-contain"
            />
          </div>
        </div>
      </div>
      <div className="basis-[70%] flex-grow flex flex-col items-center overflow-scroll  ">
        <h2 className="font-bold text-[2rem] text-center mb-[4rem] mt-[5rem] font-poppins px-2">
          Admin Dashboard
        </h2>
        <div className="flex flex-col items-center justify-center xl:w-[90%] lg:w-[70%] md:w-[90%] w-[90%] shadow-lg hover:shadow-md transition-shadow px-4 py-4">
          <h3 className="font-bold text-[#F95D5D] text-[1.6rem] mb-[0.5rem] text-center text-nowrap">
            KYC Verification Dashboard for AmbuRakshak Drivers
          </h3>
          <p className="text-center text-gray-600 mb-[2rem]  ">
            The<b> KYC Detailed Dashboard</b> for <b>AmbuRakshak </b>Drivers
            provides a comprehensive overview of each driver's verification
            status, ensuring transparency and compliance
          </p>
          <div className="flex flex-col justify-center gap-2 max-w-[100%] mb-[3rem]">
            {/* form here */}

            <KYCForm />
          </div>
        </div>

        {/* // terms and conditions */}
        
        <div className="flex flex-col mt-14    justify-center items-center ">
          <div className=" flex gap-2  ">
            <input type="checkbox" className="accent-red-500" id="terms" />
            <label htmlFor="terms" className="text-[1rem] ">
              Terms & Conditions apply
            </label>
          </div>

          <p className=" mr-7 text-[#5c5554]  text-center p-7 font-normal ">
          Please read all the <span className="text-[#5c5554] font-bold">Terms and Conditions</span> and <span className="text-[#5c5554] font-bold">Privacy Policy of Ambuvians Healthcare Private Limited</span> carefully before submitting your request
        </p>
        </div>

       
      </div>
    </div>
  );
}

export default Admindashboard;
