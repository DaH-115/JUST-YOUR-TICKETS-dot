import { db } from "firebase-config";
import { doc, getDoc, Timestamp } from "firebase/firestore";

import { SerializableUser } from "store/redux-toolkit/slice/userSlice";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated"; // ReviewDoc: UI에 넘겨줄 "최종 구조" (createdAt/updatedAt => string)
import formatDate from "app/utils/formatDate";

interface FetchReviewByIdParams {
  reviewId: string;
  uid: string;
}

// Firestore에서 꺼낸 데이터 타입 정의
interface RawReviewData {
  movieId: number;
  movieTitle: string;
  originalTitle: string;
  moviePosterPath?: string;
  releaseYear: string;
  rating: number;
  reviewTitle: string;
  reviewContent: string;
  createdAt: Timestamp; // Firestore Timestamp
  updatedAt: Timestamp; // Firestore Timestamp
  likeCount: number;
}

// Firestore에 저장된 한 문서 구조
interface RawFullReviewFromFirestore {
  user: SerializableUser;
  review: RawReviewData;
}

export default async function fetchReviewById({
  reviewId,
  uid,
}: FetchReviewByIdParams): Promise<ReviewDoc | null> {
  if (!reviewId) {
    throw new Error("fetchReviewById: reviewId가 없습니다.");
  }
  if (!uid) {
    throw new Error("fetchReviewById: uid가 없습니다.");
  }

  const reviewRef = doc(db, "movie-reviews", reviewId);
  const snap = await getDoc(reviewRef);

  if (!snap.exists()) {
    return null;
  }

  // 문서 전체 데이터를 RawFullReviewFromFirestore 형태로 단언
  const data = snap.data() as RawFullReviewFromFirestore;

  // 1. Firestore Timestamp → Date → ISO 문자열 → "formatDate" → 최종 문자열
  const createdStr = formatDate(data.review.createdAt.toDate().toISOString());
  const updatedStr = formatDate(data.review.updatedAt.toDate().toISOString());

  // 2. ReviewDoc 타입 적용해서 반환
  const result: ReviewDoc = {
    id: snap.id, // 문서 ID
    user: data.user, // user 정보
    review: {
      movieId: data.review.movieId,
      movieTitle: data.review.movieTitle,
      originalTitle: data.review.originalTitle,
      moviePosterPath: data.review.moviePosterPath,
      releaseYear: data.review.releaseYear,
      rating: data.review.rating,
      reviewTitle: data.review.reviewTitle,
      reviewContent: data.review.reviewContent,
      createdAt: createdStr, // 문자열로 바꿔 놓은 값
      updatedAt: updatedStr, // 문자열로 바꿔 놓은 값
      likeCount: data.review.likeCount,
    },
  };

  return result;
}
