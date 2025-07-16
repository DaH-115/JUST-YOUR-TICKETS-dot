import SearchForm from "./SearchForm";

type SearchSectionProps = {
  searchTerm: string;
  resultCount: number;
  onSearch: (term: string) => void;
};

export default function SearchSection({
  searchTerm,
  resultCount,
  onSearch,
}: SearchSectionProps) {
  return (
    <div className="my-8 flex flex-col gap-2">
      <div className="flex justify-end">
        <SearchForm
          placeholder="영화 제목으로 검색해 보세요"
          onSearch={onSearch}
        />
      </div>
      {searchTerm && (
        <div className="text-sm text-gray-500">
          <span className="font-medium">{`"${searchTerm}"`}</span> 검색 결과:
          {resultCount}개
        </div>
      )}
    </div>
  );
}
