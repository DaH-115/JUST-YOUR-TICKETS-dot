interface AlertProps {
  title: string;
  description: string;
  status?: number;
  onConfirm?: () => void;
  onClose?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export default function ModalAlert({
  title,
  description,
  status,
  onConfirm,
  onClose,
  variant = "default",
  confirmText = "확인",
  cancelText = "취소",
}: AlertProps) {
  const baseStyling =
    "w-full max-w-md rounded-xl border-2 bg-white p-4 drop-shadow-lg";
  const variantStyling =
    variant === "destructive" ? "border-red-500" : "border-black";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`${baseStyling} ${variantStyling}`}>
        <div className="mb-4 border-b border-black">
          <strong className="font-bold">{title}</strong>
          {status && <span className="px-4">Error {status}</span>}
        </div>
        <p className="mb-4 break-keep text-base lg:mb-6 lg:text-lg">
          {description}
        </p>
        <div className="flex justify-end text-sm">
          {onClose && (
            <button
              className="mr-2 rounded-lg bg-gray-200 px-3 py-2 transition-all duration-300 hover:bg-gray-300 lg:px-4 lg:py-2"
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button
              className={`rounded-lg px-3 py-2 text-white transition-all duration-300 lg:px-4 lg:py-2 ${
                variant === "destructive"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-black hover:bg-gray-900"
              }`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
