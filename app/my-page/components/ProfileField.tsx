import { UseFormRegisterReturn } from "react-hook-form";

interface ProfileFieldProps {
  label: string;
  id: string;
  value?: string;
  isEditing: boolean;
  isLoading: boolean;
  register?: UseFormRegisterReturn;
  error?: { message?: string };
  placeholder?: string;
}

export default function ProfileField({
  label,
  id,
  value,
  isEditing,
  isLoading,
  register,
  error,
  placeholder,
}: ProfileFieldProps) {
  return (
    <div className="border-b border-black py-2">
      <label htmlFor={id} className="text-xs font-bold">
        {label}
      </label>
      <div className="w-full">
        {isEditing ? (
          <>
            <input
              id={id}
              {...register}
              type="text"
              className={`w-full bg-transparent text-gray-600 ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isLoading}
            />
            {error && (
              <span className="mt-1 text-xs text-red-500">{error.message}</span>
            )}
          </>
        ) : (
          <div className="w-full text-base">
            {isLoading ? (
              <div className="w-full text-base text-gray-400">
                {label}를 불러오는 중
              </div>
            ) : (
              value || <p className="text-gray-600">{placeholder}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
