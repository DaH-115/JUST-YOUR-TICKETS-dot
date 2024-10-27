import { FaCheck } from "react-icons/fa";

interface SuccessAlertProps {
  title: string;
  description: string;
  onConfirm?: () => void;
  confirmText?: string;
}

export default function ModalSuccessAlert({
  title,
  description,
  onConfirm,
  confirmText = "확인",
}: SuccessAlertProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-xl border-2 border-emerald-500 bg-white p-4 drop-shadow-lg">
        <div className="mb-4 flex items-center gap-2 border-b border-emerald-500">
          <FaCheck className="text-base text-emerald-500" />
          <strong className="font-bold">{title}</strong>
        </div>
        <p className="mb-4 break-keep text-base lg:mb-6 lg:text-lg">
          {description}
        </p>
        <div className="flex justify-end text-sm">
          {onConfirm && (
            <button
              className="rounded-lg bg-emerald-500 px-3 py-2 text-white transition-all duration-300 hover:bg-emerald-600 lg:px-4 lg:py-2"
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
