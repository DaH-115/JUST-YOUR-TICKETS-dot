import Link from "next/link";

export default function LoginHeader() {
  return (
    <header className="absolute left-0 right-0 top-0 z-50 p-6">
      <div className="flex justify-center lg:justify-start">
        <Link href="/" className="group">
          <div className="flex items-center space-x-2">
            <div className="text-left">
              <h1 className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-2xl font-bold text-transparent lg:text-3xl">
                Just Movie
              </h1>
              <h2 className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-lg font-bold text-transparent lg:text-xl">
                Tickets
              </h2>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
