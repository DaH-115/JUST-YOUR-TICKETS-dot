"use server";

import { db } from "firebase-config";
import { deleteDoc, doc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function deleteReview(reviewId: string) {
  try {
    await deleteDoc(doc(db, "movie-reviews", reviewId));
    revalidatePath("/ticket-list");
  } catch (error) {
    alert("리뷰 삭제에 실패했습니다. 다시 시도해 주세요.");
  }
}
