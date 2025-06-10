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
    <header className="mb-4">
      <div className="mb-2 flex items-center space-x-3">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>
        {reviewsCount !== undefined && (
          <span className="font-bold text-accent-300">{reviewsCount}장</span>
        )}
      </div>
      <p className="text-sm text-gray-300">{content}</p>
    </header>
  );
}
