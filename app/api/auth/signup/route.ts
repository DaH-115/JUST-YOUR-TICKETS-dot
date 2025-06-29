import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminFirestore } from "firebase-admin-config";
import { revalidatePath } from "next/cache";

// POST /api/auth/signup - 이메일 회원가입
export async function POST(req: NextRequest) {
  try {
    const { displayName, email, password } = await req.json();

    // 필수 필드 검증
    if (!displayName?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요." },
        { status: 400 },
      );
    }

    // 닉네임 길이 검증
    if (displayName.trim().length < 2 || displayName.trim().length > 30) {
      return NextResponse.json(
        { error: "닉네임은 2-30글자 사이여야 합니다." },
        { status: 400 },
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 형식이 아닙니다." },
        { status: 400 },
      );
    }

    // 비밀번호 강도 검증
    const passwordRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error: "비밀번호는 8자 이상이며, 숫자와 특수문자를 포함해야 합니다.",
        },
        { status: 400 },
      );
    }

    // Firebase Admin SDK를 사용한 트랜잭션 처리
    const batch = adminFirestore.batch();

    try {
      // 1. 닉네임 중복 검사
      const usernameRef = adminFirestore
        .collection("usernames")
        .doc(displayName.trim());
      const usernameDoc = await usernameRef.get();

      if (usernameDoc.exists) {
        return NextResponse.json(
          { error: "이미 사용 중인 닉네임입니다." },
          { status: 409 },
        );
      }

      // 2. Firebase Auth 계정 생성
      const userRecord = await adminAuth.createUser({
        email: email.trim(),
        password: password,
        displayName: displayName.trim(),
      });

      // 3. Firestore 트랜잭션: usernames 컬렉션에 닉네임 등록
      batch.set(usernameRef, {
        uid: userRecord.uid,
        createdAt: new Date(),
      });

      // 4. Firestore 트랜잭션: users 컬렉션에 사용자 프로필 저장
      const userRef = adminFirestore.collection("users").doc(userRecord.uid);
      batch.set(userRef, {
        provider: "email",
        biography: "Make a ticket for your own movie review.",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 5. 트랜잭션 실행
      await batch.commit();

      // 6. 캐시 재검증
      revalidatePath("/");

      return NextResponse.json(
        {
          success: true,
          message: "회원가입이 완료되었습니다.",
          data: {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
          },
        },
        { status: 201 },
      );
    } catch (error: any) {
      // Firebase Auth 계정이 생성된 경우 롤백
      if (error.code !== "auth/email-already-exists") {
        try {
          // 생성된 사용자가 있다면 삭제
          const users = await adminAuth.getUserByEmail(email);
          if (users) {
            await adminAuth.deleteUser(users.uid);
          }
        } catch (rollbackError) {
          console.error("사용자 롤백 실패:", rollbackError);
        }
      }

      // Firebase Auth 에러 처리
      if (error.code === "auth/email-already-exists") {
        return NextResponse.json(
          { error: "이미 사용 중인 이메일입니다." },
          { status: 409 },
        );
      }

      if (error.code === "auth/invalid-email") {
        return NextResponse.json(
          { error: "유효하지 않은 이메일입니다." },
          { status: 400 },
        );
      }

      if (error.code === "auth/weak-password") {
        return NextResponse.json(
          { error: "비밀번호가 너무 약합니다." },
          { status: 400 },
        );
      }

      throw error;
    }
  } catch (error: any) {
    console.error("회원가입 API 에러:", error);
    return NextResponse.json(
      { error: "회원가입 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
