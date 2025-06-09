import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoCloseOutline, IoStar } from "react-icons/io5";
import ReviewBtnGroup from "app/components/reviewTicket/TicketBtnGroup";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";
import {
  deleteDoc,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebase-config";
import { useAppSelector } from "store/redux-toolkit/hooks";
import Comments from "app/components/reviewTicket/Comment/Comments";
import ModalPortal from "app/components/modal/ModalPortal";

interface ReviewDetailsModalProps {
  isModalOpen: boolean;
  closeModalHandler: () => void;
  selectedReview: ReviewDoc;
  onReviewDeleted: (id: string) => void;
  onLikeToggled?: (reviewId: string, isLiked: boolean) => void;
}

export default function ReviewDetailsModal({
  isModalOpen,
  closeModalHandler,
  selectedReview,
  onReviewDeleted,
  onLikeToggled,
}: ReviewDetailsModalProps) {
  const { review, user } = selectedReview;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  const userState = useAppSelector((state) => state.userData.auth);

  useEffect(() => {
    setLiked(false);
    setLikeCount(review.likeCount || 0);
  }, [review.likeCount]);

  useEffect(() => {
    if (!userState?.uid) {
      return;
    }

    const checkStatus = async () => {
      const likeRef = doc(
        db,
        "users",
        userState.uid,
        "liked-reviews",
        selectedReview.id,
      );

      const likeSnap = await getDoc(likeRef);

      setLiked(likeSnap.exists());
    };

    if (userState.uid && selectedReview.id) {
      checkStatus();
    }
  }, [userState?.uid, selectedReview.id]);

  const likeHandler = async () => {
    if (!userState?.uid || isLiking) return;
    setIsLiking(true);

    const likeRef = doc(
      db,
      "users",
      userState.uid,
      "liked-reviews",
      selectedReview.id,
    );
    const reviewRef = doc(db, "movie-reviews", selectedReview.id);
    const likeSnap = await getDoc(likeRef);

    if (likeSnap.exists()) {
      // 좋아요한 기록이 있으면 취소
      await deleteDoc(likeRef);
      await updateDoc(reviewRef, { "review.likeCount": increment(-1) });
      setLiked(false);
      setLikeCount((prev) => prev - 1);
      // 좋아요 취소 콜백 호출
      onLikeToggled?.(selectedReview.id, false);
    } else {
      // 좋아요한 기록이 없다면 추가
      await setDoc(likeRef, {
        likedAt: serverTimestamp(),
        movieTitle: review.movieTitle,
      });
      await updateDoc(reviewRef, { "review.likeCount": increment(1) });
      setLiked(true);
      setLikeCount((prev) => prev + 1);
      // 좋아요 추가 콜백 호출
      onLikeToggled?.(selectedReview.id, true);
    }

    setIsLiking(false);
  };

  return (
    <ModalPortal isOpen={isModalOpen} onClose={closeModalHandler}>
      <div className="flex w-full items-center justify-between pb-2">
        {/* 왼쪽: 별점 영역 */}
        <div className="mr-4 flex h-full items-center justify-center">
          <IoStar className="mr-1 text-accent-300" size={18} />
          <p className="text-2xl font-bold md:text-3xl">{review.rating}</p>
        </div>
        {/* 오른쪽: 타이틀 및 버튼 */}
        <div className="w-full">
          <h1 className="font-bold">{review?.reviewTitle}</h1>
          <div className="flex text-xs text-gray-500">
            {review.movieTitle} - {review.releaseYear}
          </div>
        </div>
        <div className="mr-2 flex items-center gap-3">
          {/* 좋아요 버튼 */}
          <button
            onClick={likeHandler}
            disabled={!userState?.uid || isLiking}
            className="flex items-center text-red-500 transition hover:scale-105"
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            <span className="ml-1 text-sm text-black">{likeCount}</span>
          </button>
          {/* 리뷰 작성자와 로그인한 유저가 같을 때만 수정/삭제 버튼 노출 */}
          {userState?.uid && (
            <ReviewBtnGroup
              movieId={String(review.movieId)}
              postId={selectedReview.id}
              authorId={user.uid}
              onReviewDeleted={onReviewDeleted}
            />
          )}
        </div>
        {/* 모달 닫기 버튼 */}
        <IoCloseOutline
          onClick={closeModalHandler}
          className="cursor-pointer text-4xl text-black"
        />
      </div>
      <div className="flex items-center justify-between pb-2 text-sm">
        <p className="text-xs text-gray-500">{review.createdAt}</p>
        <div className="flex items-center">
          <span className="mr-1 font-bold">{user.displayName}</span>
        </div>
      </div>
      <div className="mb-2 h-64 flex-1 overflow-y-scroll border-t-4 border-dotted pb-8 pt-2">
        <p className="mb-1 text-xs font-bold">리뷰 내용</p>
        <p className="break-keep">{review.reviewContent}</p>
      </div>
      {/* 댓글 영역 - 모달이 열릴 때만 렌더링 */}
      {isModalOpen && <Comments id={selectedReview.id} />}
    </ModalPortal>
  );
}
