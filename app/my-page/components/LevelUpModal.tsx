import ModalPortal from "app/components/ui/modal/ModalPortal";
import { FaCheck } from "react-icons/fa";
import ActivityBadge from "app/components/ui/feedback/ActivityBadge";

interface LevelUpModalProps {
  open: boolean;
  onClose: () => void;
  newLevel: string;
}

function LevelUpModal({ open, onClose, newLevel }: LevelUpModalProps) {
  return (
    <ModalPortal isOpen={open} onClose={onClose}>
      {/* Alert Header */}
      <div className="mb-4 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg">
          <FaCheck className="text-lg text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">등급 상승!</h3>
      </div>
      {/* Alert Description */}
      <div className="mb-5 text-center">
        <p className="break-keep text-sm leading-relaxed text-gray-600">
          {"축하합니다! 새로운 등급: "}
          <ActivityBadge
            activityLevel={newLevel}
            size="small"
            className="ml-1 inline-block align-middle"
          />
        </p>
      </div>
      {/* Button */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
          onClick={onClose}
          autoFocus
        >
          확인
        </button>
      </div>
    </ModalPortal>
  );
}

export default LevelUpModal;
