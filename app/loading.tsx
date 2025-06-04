export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div
        role="status"
        className="h-12 w-12 animate-spin rounded-full border-4 border-accent-300 border-t-[#121212]"
      >
        <span className="sr-only">로딩 중 입니다.</span>
      </div>
    </div>
  );
}
