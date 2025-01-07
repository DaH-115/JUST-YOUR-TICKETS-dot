import { IoSearchOutline } from "react-icons/io5";

export default function ReviewSearchInputregister({
  label,
  register,
  placeholder,
}: {
  register: any;
  label: string;
  placeholder: string;
}) {
  return (
    <div className="relative flex h-10 w-full items-center justify-end">
      <label htmlFor="review-search" className="sr-only">
        {label}
      </label>
      <input
        {...register("search")}
        id="review-search"
        type="search"
        placeholder={placeholder}
        className="focus:ring-accent-300 h-full w-full rounded-full pl-4 pr-10 text-sm focus:outline-none focus:ring-2 md:w-64"
      />
      <div className="absolute right-0 top-0 flex h-full w-10 cursor-pointer items-center justify-center rounded-full">
        <IoSearchOutline size={20} color="black" />
      </div>
    </div>
  );
}
