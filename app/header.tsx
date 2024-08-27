import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 flex w-full p-4 md:justify-between md:py-5 md:pl-11 md:pr-11">
      <div className="flex w-full justify-between md:items-center">
        <div className="flex items-center justify-center font-bold md:mr-24">
          just your tickets.
        </div>
        <ul className="mr-6 hidden items-center space-x-4 md:mr-4 md:flex">
          <li className="group relative">
            <Link href="/">Home</Link>
            <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-black transition-transform group-hover:scale-x-100 group-focus:scale-x-100"></span>
          </li>
          <li className="group relative">
            <Link href="/ticket-list-now" className="whitespace-nowrap">
              Ticket List
            </Link>
            <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-black transition-transform group-hover:scale-x-100 group-focus:scale-x-100"></span>
          </li>
          <li className="group relative">
            <Link href="/search">Search</Link>
            <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-black transition-transform group-hover:scale-x-100 group-focus:scale-x-100"></span>
          </li>
        </ul>
        <div className="mr-2 flex items-center justify-center md:hidden">
          메뉴
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-end">
        <div className="mr-4 hidden w-2/3 md:flex">
          <input
            type="search"
            placeholder="search "
            className="w-full rounded-md border-2 border-black px-3 py-2 text-sm"
          />
        </div>
        <Link href="/login">
          <button
            type="button"
            className="rounded-md bg-black px-3 py-2 text-sm font-bold text-white transition-colors duration-200 ease-in-out hover:bg-yellow-600"
          >
            로그인
          </button>
        </Link>
      </div>
    </header>
  );
}
