export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="relative">
        {/* 심플한 스피너 */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-accent-300"></div>

        {/* 로딩 텍스트 */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
          <div className="font-mono text-xs font-bold tracking-wider text-accent-300">
            LOADING
          </div>
        </div>
      </div>

      <span className="sr-only">로딩 중입니다.</span>
    </div>
  );
}
