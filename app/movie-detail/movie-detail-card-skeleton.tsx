export default function MovieDetailCardSkeleton() {
  return (
    <main className="relative mb-8 flex w-full animate-pulse items-center justify-center lg:my-8">
      <div className="flex flex-col justify-center lg:w-2/3 lg:flex-row">
        {/* MOVIE POSTER */}
        <div className="mx-auto w-3/4 py-4 lg:mr-8 lg:w-2/3">
          <div className="h-[600px] w-full rounded-lg bg-gray-300 shadow-lg"></div>
        </div>
        {/* MOVIE INFO */}
        <div className="mx-auto w-full rounded-xl border-2 border-gray-300 bg-white shadow-lg">
          <div className="p-4 pb-2">
            <div className="mb-2 h-6 w-20 rounded-lg bg-gray-300"></div>
            <div className="h-10 w-3/4 rounded-lg bg-gray-300 lg:ml-4"></div>
            <div className="ml-1 mt-2 flex items-center">
              <div className="h-6 w-1/2 rounded-lg bg-gray-300 lg:ml-4"></div>
            </div>
          </div>
          <div className="border-y border-gray-300 p-2">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-20 rounded-full bg-gray-300"
                ></div>
              ))}
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center">
              <div className="mr-2 h-10 w-10 rounded-full bg-gray-300"></div>
              <div className="h-10 w-20 rounded bg-gray-300"></div>
            </div>
          </div>
          <div className="mb-12 mt-2">
            <div className="mx-6 h-20 w-full rounded bg-gray-300"></div>
          </div>
          <div className="border-t border-gray-300 p-2">
            <div className="mb-2 h-6 w-20 rounded bg-gray-300"></div>
            <div className="space-y-1 p-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 w-1/2 rounded bg-gray-300"></div>
              ))}
            </div>
          </div>
          <div className="flex w-full items-stretch justify-between border-t border-gray-300">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 p-2">
                <div className="mb-2 h-4 w-20 rounded bg-gray-300"></div>
                <div className="h-16 w-full rounded bg-gray-300"></div>
              </div>
            ))}
          </div>
          <div className="flex items-center border-y border-gray-300 p-4">
            <div className="mr-4 h-4 w-10 rounded bg-gray-300"></div>
            <div className="space-y-1">
              {[1, 2].map((i) => (
                <div key={i} className="h-4 w-40 rounded bg-gray-300"></div>
              ))}
            </div>
          </div>
          <div className="p-1">
            <div className="h-16 w-full rounded-xl bg-gray-300"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
