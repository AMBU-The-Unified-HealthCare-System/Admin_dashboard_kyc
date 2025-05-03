interface SideModalProps {
    isOpen: boolean;
    onClose: () => void;
    fieldLabel: string;
    fieldValue: string;
    driverName: string;
  }
  
  const Sidemodal: React.FC<SideModalProps> = ({
    isOpen,
    onClose,
    fieldLabel,
    fieldValue,
  }) => {
    if (!isOpen) return null;
  
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
          <p>
            <strong>{fieldLabel}:</strong> {fieldValue}
          </p>
        

  
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
  