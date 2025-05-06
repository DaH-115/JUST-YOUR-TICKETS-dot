"use server";

import { db } from "firebase-config";
import { deleteDoc, doc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function deleteReview(userId: string) {
  try {
    await deleteDoc(doc(db, "movie-reviews", userId));
    revalidatePath("/ticket-list");
    revalidatePath("/my-page/my-ticket-list");
  } catch (error) {
    console.error("리뷰 티켓 삭제 실패:", error);
    throw new Error("리뷰 티켓 삭제에 실패했습니다.");
  }
}
