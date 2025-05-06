import { IoSearchOutline } from "react-icons/io5";

export default function ReviewSearchInput({
  label,
  register,
  placeholder,
}: {
  register: any;
  label: string;
  placeholder: string;
}) {
  return (
    <div className="relative flex h-10 w-64 items-center justify-end">
      <label htmlFor="review-search" className="sr-only">
        {label}
      </label>
      <input
        {...register("search")}
        id="review-search"
        type="search"
        placeholder={placeholder}
        className="h-full w-full rounded-full pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
      />
      <div className="absolute right-1 top-0 flex h-full w-10 cursor-pointer items-center justify-center rounded-full">
        <IoSearchOutline size={22} color="black" />
      </div>
    </div>
  );
}
