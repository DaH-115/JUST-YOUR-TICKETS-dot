export default function SwiperCardSkeleton() {
  return (
    <div className="group/card relative mx-2 h-[450px] animate-pulse lg:h-[550px]">
      <div className="absolute left-0 top-0 w-full rounded-t-xl bg-gradient-to-t from-transparent to-gray-300 p-4">
        <div className="h-12 w-12 rounded-full bg-gray-400"></div>
      </div>
      <div className="h-full w-full rounded-xl bg-gray-300"></div>

      {/* MOVIE INFO CARD */}
      <div className="absolute bottom-2 right-2 w-full rounded-xl border-2 border-gray-300 bg-white shadow-lg">
        <div className="flex p-4 pb-0">
          <div className="mb-4 h-6 w-3/4 rounded bg-gray-300"></div>
          <div className="ml-2 h-6 w-6 rounded-full bg-gray-300"></div>
        </div>
        <div className="flex w-full flex-wrap border-y border-gray-300 p-1">
          {[1, 2, 3].map((_, idx) => (
            <div
              key={idx}
              className="m-1 h-6 w-16 rounded-full bg-gray-300"
            ></div>
          ))}
        </div>
        <div className="flex w-full text-center">
          <div className="flex items-center border-r-2 border-gray-300 px-2">
            <div className="mr-1 h-6 w-6 rounded-full bg-gray-300"></div>
            <div className="h-6 w-10 rounded bg-gray-300"></div>
          </div>
          <div className="flex-1 p-1">
            <div className="h-10 w-full rounded-xl bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
