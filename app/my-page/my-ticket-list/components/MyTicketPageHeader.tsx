import { UseFormRegister } from "react-hook-form";
import ReviewSearchInputregister from "app/components/reviewTicket/ReviewSearchInput";

interface MyTicketHeaderProps {
  ticketCount: number;
  register: UseFormRegister<{ search: string }>;
}

export default function MyTicketHeader({
  ticketCount,
  register,
}: MyTicketHeaderProps) {
  return (
    <header className="pb-8">
      <h1 className="mb-8 text-2xl font-bold text-accent-300 lg:sr-only">
        MY TICKET
        <br />
        LIST
      </h1>
      <div className="flex w-full items-center justify-end text-white">
        {/* 티켓 개수 */}
        <div className="mr-4 flex items-center gap-2 text-lg font-bold">
          all
          <p className="text-accent-300">{ticketCount}</p>
        </div>
        {/* 티켓 검색 */}
        <ReviewSearchInputregister
          label="티켓 검색"
          register={register}
          placeholder="티켓 검색"
        />
      </div>
    </header>
  );
}
