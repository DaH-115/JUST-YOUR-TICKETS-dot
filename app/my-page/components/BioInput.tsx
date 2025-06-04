import { useFormContext } from "react-hook-form";

interface BioInputProps {
  originalValue?: string | null;
  isEditing: boolean;
}

export default function BioInput({ isEditing, originalValue }: BioInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label htmlFor="biography" className="text-xs font-semibold">
        바이오
      </label>
      {isEditing ? (
        <>
          <input
            id="biography"
            {...register("biography")}
            className="mt-2 w-full rounded-xl border border-black px-3 py-2"
          />
          {errors.biography?.message && (
            <p className="mt-1 text-xs text-red-500">
              {errors.biography.message as string}
            </p>
          )}
        </>
      ) : (
        <div className="mt-1">
          <p className="border-b border-gray-500 py-2 text-gray-800">
            {originalValue || "바이오 없음"}
          </p>
        </div>
      )}
    </div>
  );
}
