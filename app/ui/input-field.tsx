import { SignupSchema } from "app/sign-up/page";

interface InputFieldProps {
  id: keyof SignupSchema;
  label: string;
  type: string;
  placeholder: string;
  register: any;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
}

export default function InputField({
  id,
  label,
  type,
  placeholder,
  register,
  error,
  touched,
  disabled,
}: InputFieldProps) {
  return (
    <div className="border-b border-black py-2">
      <label htmlFor={id} className="block text-xs font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(id)}
        className={`mt-1 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-700 focus:outline-none ${disabled ? "cursor-not-allowed opacity-50" : ""} ${touched && error ? "border-red-500" : ""}`}
      />
      {touched && error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
