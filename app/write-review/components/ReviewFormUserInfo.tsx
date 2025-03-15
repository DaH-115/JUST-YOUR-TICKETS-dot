interface ReviewFormUserInfoProps {
  userName: string;
  movieTitle: string;
}

export default function ReviewFormUserInfo({
  userName,
  movieTitle,
}: ReviewFormUserInfoProps) {
  return (
    <div className="mb-6 rounded-lg bg-gray-100 p-4">
      <p className="text-sm text-gray-600">
        <span className="font-medium">{userName}</span>님이{" "}
        <span className="font-medium">{movieTitle}</span>에 대한 리뷰를 작성하고
        있습니다.
      </p>
    </div>
  );
}
