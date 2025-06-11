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
      <div className="animate-in fade-in-0 zoom-in-95 mx-4 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-gray-200/50 backdrop-blur-sm duration-300">
        {/* Alert Header */}
        <div className="mb-4 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg">
            <FaCheck className="text-lg text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>

        {/* Alert Description */}
        <div className="mb-5 text-center">
          <p className="break-keep text-sm leading-relaxed text-gray-600">
            {description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
            onClick={onConfirm}
          >
            확인
          </button>
          {onClose && (
            <button
              type="button"
              className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-500/20"
              onClick={onClose}
            >
              취소
            </button>
          )}
        </div>
      </div>
    </AlertPortal>
  );
}
