"use server";

import { ReviewFormValues } from "app/write-review/components/ReviewForm";
import { db } from "firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export default async function updateReview(
  reviewId: string,
  reviewData: ReviewFormValues,
) {
  try {
    await updateDoc(doc(db, "movie-reviews", reviewId), {
      ...reviewData,
    });

    revalidatePath("/ticket-list");
    revalidatePath("/my-page/my-ticket-list");
  } catch (error) {
    throw new Error("리뷰 수정을 실패했습니다.");
  }
}
