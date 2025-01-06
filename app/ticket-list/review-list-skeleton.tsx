export default function ReviewListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 pb-8 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="group/card relative h-[300px] animate-pulse drop-shadow-md md:h-[450px]"
        >
          {/* CARD HEADER */}
          <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-between p-2">
            <div className="h-6 w-6 rounded-full bg-gray-300"></div>
            {/* DESKTOP ONLY */}
            <div className="hidden space-x-2 md:flex">
              <div className="h-8 w-8 rounded-full bg-gray-300"></div>
              <div className="h-8 w-8 rounded-full bg-gray-300"></div>
            </div>
          </div>

          <div className="h-4/5 rounded-xl bg-gray-300"></div>
          <div className="absolute bottom-0 right-0 w-full rounded-xl border-2 border-gray-300 bg-white">
            <div className="flex items-center justify-between border-b">
              <div className="flex items-center justify-center px-2 py-1">
                <div className="mr-1 h-4 w-4 rounded-full bg-gray-300"></div>
                <div className="h-6 w-12 rounded bg-gray-300"></div>
              </div>
              <div className="mx-3 h-4 w-20 rounded bg-gray-300"></div>
            </div>
            <div className="h-[4rem] p-2 md:border-b">
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
              <div className="h-3 w-1/2 rounded bg-gray-300"></div>
            </div>
            <div className="flex items-center border-t px-3 py-2">
              <div className="h-3 w-1/3 rounded bg-gray-300"></div>
              <div className="ml-auto h-4 w-4 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
