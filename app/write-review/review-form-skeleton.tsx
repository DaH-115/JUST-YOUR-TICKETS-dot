export default function ReviewFormSkeleton() {
  return (
    <div className="relative z-40 mb-16 mt-8 animate-pulse drop-shadow-lg lg:mb-20 lg:mt-16">
      <div className="mx-auto w-11/12 rounded-xl border-2 border-gray-300 bg-white lg:w-1/3">
        <div className="w-full p-4 pb-0">
          <div className="mb-1 flex items-end lg:mb-2">
            <div className="h-4 w-1/4 rounded bg-gray-300"></div>
          </div>
          <div className="mb-2 h-8 w-3/4 rounded bg-gray-300"></div>
        </div>
        <div className="flex justify-between border-b border-gray-300 px-4 py-2">
          <div className="h-4 w-1/4 rounded bg-gray-300"></div>
          <div className="h-4 w-1/4 rounded bg-gray-300"></div>
        </div>

        <div className="w-full">
          <div className="p-4">
            <div className="mb-2 h-4 w-1/6 rounded bg-gray-300"></div>
            <div className="h-10 w-full rounded bg-gray-300"></div>
          </div>

          <div className="p-4">
            <div className="mb-2 h-4 w-1/6 rounded bg-gray-300"></div>
            <div className="h-6 w-full rounded bg-gray-300"></div>
            <div className="mt-2 flex items-center justify-center">
              <div className="h-6 w-1/4 rounded bg-gray-300"></div>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-2 h-4 w-1/6 rounded bg-gray-300"></div>
            <div className="h-32 w-full rounded bg-gray-300"></div>
          </div>

          <div className="flex justify-end border-t border-gray-300 p-2">
            <div className="mr-2 h-12 w-1/2 rounded bg-gray-300"></div>
            <div className="h-12 w-1/2 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
