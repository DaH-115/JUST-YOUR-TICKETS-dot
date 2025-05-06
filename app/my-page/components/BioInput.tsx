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
            className="w-full resize-none border-b border-black py-1 outline-none"
          />
          {errors.biography?.message && (
            <p className="mt-1 text-xs text-red-500">
              {errors.biography.message as string}
            </p>
          )}
        </>
      ) : (
        <p className="mt-1 text-gray-800">{originalValue || "바이오 없음"}</p>
      )}
    </div>
  );
}
