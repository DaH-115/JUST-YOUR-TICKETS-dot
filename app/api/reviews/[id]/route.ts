import { NextRequest, NextResponse } from "next/server";
import { adminFirestore } from "firebase-admin-config";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath, revalidateTag } from "next/cache";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { updateUserActivityLevel } from "lib/users/updateUserActivityLevel";

// GET /api/reviews/[id] - 개별 리뷰 조회
export { GET } from "./get.handler";

// PUT /api/reviews/[id] - 리뷰 수정
export { PUT } from "./put.handler";

// DELETE /api/reviews/[id] - 리뷰 삭제
export { DELETE } from "./delete.handler";
