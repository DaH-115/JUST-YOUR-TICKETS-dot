export default function MovieSectionSkeleton() {
  const skeletonItems = Array.from({ length: 10 });

  // 각 아이템의 너비를 실제 SwiperCard와 유사하게 설정
  const itemWidthClasses =
    "w-[115px] sm:w-[120px] md:w-[130px] lg:w-[150px] xl:w-[160px] 2xl:w-[170px]";

  return (
    <section className="py-8 md:py-16">
      {/* 섹션 제목 스켈레톤 */}
      <div className="mb-6 md:mb-4">
        <div className="mb-2 h-8 w-40 animate-pulse rounded bg-gray-600"></div>
        <div className="h-5 w-80 animate-pulse rounded bg-gray-600"></div>
      </div>

      {/* 스와이퍼 아이템 스켈레톤 - overflow-hidden으로 자연스러운 잘림 효과 */}
      <div className="overflow-hidden">
        <div className="flex space-x-4 pt-8">
          {skeletonItems.map((_, i) => (
            <div key={i} className={`flex-shrink-0 ${itemWidthClasses}`}>
              <div className="flex w-full flex-col">
                {/* 포스터 영역 (비율 유지) */}
                <div
                  className={`aspect-[2/3] w-full animate-pulse rounded-lg bg-gray-600`}
                ></div>
                {/* 정보 카드 영역 */}
                <div className="mt-2 space-y-2">
                  <div className="h-4 animate-pulse rounded bg-gray-600"></div>
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-600"></div>
                  <div className="h-8 w-full animate-pulse rounded-lg bg-gray-600"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
