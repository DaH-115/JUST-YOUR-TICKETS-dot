interface EditableSectionProps {
  title: string;
  isEditing: boolean;
  onEditToggle: () => void;
  isSaveDisabled?: boolean;
  children: React.ReactNode;
}

export default function EditableSection({
  title,
  isEditing,
  onEditToggle,
  isSaveDisabled,
  children,
}: EditableSectionProps) {
  return (
    <section>
      <div className="mb-2 flex items-center space-x-2">
        <h2 className="text-lg font-bold">{title}</h2>
        {/* Edit Button */}
        <div className="space-x-1">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={onEditToggle}
                className="rounded-xl px-3 py-1 text-sm transition-colors duration-300 hover:bg-black hover:text-white active:bg-black active:text-white"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSaveDisabled}
                className={`text-sm ${isSaveDisabled ? "cursor-not-allowed opacity-50" : "rounded-xl bg-black px-3 py-1 text-white transition-colors duration-300"}`}
              >
                저장
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onEditToggle}
              className="rounded-xl px-3 py-1 text-sm transition-colors duration-300 hover:bg-black hover:text-white active:bg-black active:text-white"
            >
              수정
            </button>
          )}
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
