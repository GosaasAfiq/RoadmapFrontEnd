interface ConfirmationModalProps {
    title: string;
    message: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  export default function ConfirmationModal({
    title,
    message,
    isOpen,
    onClose,
    onConfirm,
  }: ConfirmationModalProps) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl transition-transform transform scale-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">{message}</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition-colors shadow-sm"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }
  