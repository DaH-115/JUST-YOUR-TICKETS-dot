export default function LatestReviewsSkeleton() {
  return (
    <div className="py-8 md:py-16">
      <div className="mb-6 md:mb-4">
        <div className="mb-2 h-8 w-48 animate-pulse rounded bg-gray-600"></div>
        <div className="h-5 w-64 animate-pulse rounded bg-gray-600"></div>
      </div>
      <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-lg bg-gray-600"
          ></div>
        ))}
      </div>
    </div>
  );
}
