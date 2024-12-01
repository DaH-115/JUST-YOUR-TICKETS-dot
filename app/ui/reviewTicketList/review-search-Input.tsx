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
        className="h-full w-full rounded-full border-2 border-black pl-4 pr-10 text-sm opacity-100 md:w-64"
      />
      <div className="absolute right-0 top-0 flex h-full w-10 cursor-pointer items-center justify-center rounded-full">
        <IoSearchOutline size={20} color="black" />
      </div>
    </div>
  );
}
