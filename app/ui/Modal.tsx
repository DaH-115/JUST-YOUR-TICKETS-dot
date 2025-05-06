interface ModalProps {
  title: string;
  description: string;
  status?: number;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose?: () => void;
}

export default function Modal({
  title,
  description,
  status,
  onConfirm,
  onClose,
  confirmText = "확인",
  cancelText = "취소",
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-xl border-2 bg-white px-4 py-2 drop-shadow-lg">
        <div className="mb-2 border-b border-gray-200">
          <strong className="font-bold">
            {status ? `Error ${status}` : title}
          </strong>
        </div>
        <p className="mb-4 break-keep text-sm lg:mb-6">{description}</p>
        <div className="flex justify-end text-xs">
          {onClose && (
            <button
              className="mr-2 rounded-lg bg-gray-200 px-3 py-2 transition-all duration-300 hover:bg-gray-300 lg:px-4 lg:py-2"
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}
          <button
            className={`rounded-lg bg-red-500 px-3 py-2 text-white transition-all duration-300 hover:bg-red-600 lg:px-4 lg:py-2`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
