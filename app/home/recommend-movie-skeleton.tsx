export default function RecommendMovieSkeleton() {
  return (
    <main className="mx-auto flex flex-col items-center justify-center lg:mt-16 lg:w-4/5 lg:flex-row lg:items-start">
      {/* MOVIE POSTER SKELETON */}
      <div className="group w-2/4 py-4 lg:w-1/3 lg:pr-8">
        <div className="aspect-[2/3] w-full animate-pulse bg-gray-300"></div>
      </div>

      {/* MOVIE CARD SKELETON */}
      <div className="relative w-11/12 lg:w-3/5">
        <div className="space-y-4">
          {/* Title */}
          <div className="h-8 w-3/4 animate-pulse bg-gray-300"></div>

          {/* Genres */}
          <div className="flex space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 w-20 animate-pulse rounded-full bg-gray-300"
              ></div>
            ))}
          </div>

          {/* Overview */}
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-4 w-full animate-pulse bg-gray-300"
              ></div>
            ))}
          </div>
        </div>

        {/* Hidden buttons skeleton */}
        <div className="absolute -right-24 top-0 hidden flex-row">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="mr-2 h-8 w-8 animate-pulse rounded-full bg-gray-300"
            ></div>
          ))}
        </div>
      </div>
    </main>
  );
}
