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
    <header className="mb-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>
        <span className="ml-2 font-bold text-accent-300">{reviewsCount}</span>
      </div>
      <p className="text-sm text-gray-300">{content}</p>
    </header>
  );
}
