import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface InputFieldProps<TFormValues extends FieldValues> {
  id: Path<TFormValues>;
  label: string;
  type: string;
  placeholder: string;
  register: UseFormRegister<TFormValues>;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

export default function InputField<TFormValues extends FieldValues>({
  id,
  label,
  type,
  placeholder,
  register,
  error,
  touched,
  disabled,
  autoComplete,
}: InputFieldProps<TFormValues>) {
  return (
    <>
      <div className="py-3">
        <label htmlFor={id} className="block text-xs font-bold text-gray-700">
          {label}
        </label>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          {...register(id)}
          className={`w-full appearance-none border-b border-black bg-transparent py-2 leading-tight text-gray-700 focus:outline-none ${disabled ? "cursor-not-allowed opacity-50" : ""} ${touched && error ? "border-b-2 border-red-500" : ""}`}
          autoComplete={autoComplete}
        />
      </div>
      {touched && error && <p className="text-sm text-red-600">{error}</p>}
    </>
  );
}
