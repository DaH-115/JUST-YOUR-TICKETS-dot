"use client";

import { Review } from "lib/reviews/fetchReviews";

interface ReviewSearchForm {
  title: string;
  content: string;
  userReviews?: Review[];
}

export default function MyTicketHeader({
  title,
  content,
  userReviews,
}: ReviewSearchForm) {
  return (
    <header className="mb-4 flex items-center justify-between">
      <div className="text-white">
        <h1 className="text-3xl font-bold text-accent-300">{title}</h1>
        <p>{content}</p>
        <p>{userReviews?.length} 장</p>
      </div>
    </header>
  );
}
