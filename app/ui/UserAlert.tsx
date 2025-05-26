import AlertPortal from "app/components/alert/AlertPortal";
import { FaCheck } from "react-icons/fa";

interface UserAlertProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onClose?: () => void;
}

export default function UserAlert({
  title,
  description,
  onConfirm,
  onClose,
}: UserAlertProps) {
  return (
    <AlertPortal onConfirm={onConfirm}>
      <div className="max-w-md rounded-xl border-2 border-emerald-500 bg-white p-4 drop-shadow-lg">
        {/* Alert Header */}
        <div className="mb-4 flex items-center gap-2 border-b-4 border-dotted pb-1">
          <FaCheck className="text-base text-emerald-500" />
          <strong className="font-bold">{title}</strong>
        </div>
        {/* Alert Desc */}
        <p className="mb-4 break-keep text-base lg:mb-6">{description}</p>
        {/* Buttons */}
        <div className="flex justify-end gap-2 text-sm">
          {onClose && (
            <button
              type="button"
              className="rounded-lg bg-red-500 px-3 py-2 text-white transition-all duration-300 hover:bg-red-700 lg:px-4 lg:py-2"
              onClick={onClose}
            >
              취소
            </button>
          )}
          <button
            type="button"
            className="rounded-lg bg-emerald-500 px-3 py-2 text-white transition-all duration-300 hover:bg-emerald-600 lg:px-4 lg:py-2"
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </AlertPortal>
  );
}
