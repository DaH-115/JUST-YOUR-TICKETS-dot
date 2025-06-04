interface ReviewSearchForm {
  title: string;
  content: string;
  reviewsCount?: number;
}

export default function MyTicketHeader({
  title,
  content,
  reviewsCount,
}: ReviewSearchForm) {
  return (
    <header className="mb-4 flex items-center justify-between">
      <div className="text-white">
        <div className="flex font-bold text-accent-300">
          <h1 className="text-3xl">{title}</h1>
          <p className="mx-1 text-xl">{reviewsCount}</p>
        </div>
        <p className="pt-1">{content}</p>
      </div>
    </header>
  );
}
