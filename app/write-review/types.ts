// 리뷰 작성 폼 타입
export interface ReviewFormValues {
  reviewTitle: string;
  reviewContent: string;
  rating: number;
  isLiked: boolean; // 좋아요 상태 추가
}
