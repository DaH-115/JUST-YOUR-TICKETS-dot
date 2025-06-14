"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoSearchOutline } from "react-icons/io5";

const schema = z.object({
  search: z.string().max(30, "최대 30자 이하로 입력"),
});
type FormData = z.infer<typeof schema>;

interface SearchFormProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export default function SearchForm({
  onSearch,
  placeholder = "검색어를 입력하세요",
}: SearchFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { search: "" },
  });

  const searchValue = watch("search");

  // watch로 검색어 변화 감지
  useEffect(() => {
    if (searchValue === "") {
      onSearch("");
    }
  }, [searchValue, onSearch]);

  const onSubmit = (data: FormData) => {
    const trimmedSearch = data.search.trim();
    if (trimmedSearch) {
      onSearch(trimmedSearch);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex h-10 w-64 items-center"
    >
      <input
        {...register("search")}
        type="search"
        placeholder={placeholder}
        className="h-full w-full rounded-full pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent-300"
        aria-invalid={!!errors.search}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="absolute right-1 top-0 flex h-full w-10 items-center justify-center disabled:opacity-50"
      >
        <IoSearchOutline size={20} />
      </button>

      {errors.search && (
        <p className="absolute -bottom-5 left-0 text-xs text-red-500">
          {errors.search.message}
        </p>
      )}
    </form>
  );
}
