"use server";

import { ReviewData } from "app/write-review/review-form";
import { db } from "firebase-config";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export default async function UpdateReview(
  reviewId: string,
  reviewData: ReviewData,
) {
  try {
    await updateDoc(doc(db, "movie-reviews", reviewId), {
      ...reviewData,
      updatedAt: serverTimestamp(),
    });

    revalidatePath("/ticket-list");
    revalidatePath("/my-page/my-ticket-list");
  } catch (error) {
    throw new Error("리뷰 수정을 실패했습니다.");
  }
}
