"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db, isAuth } from "firebase-config";
import ProfileAvatar from "app/components/user/ProfileAvatar";

export default function ProfileImage({
  previewSrc = null,
}: {
  previewSrc?: string | null;
}) {
  const user = isAuth.currentUser;
  // 1) Firestore에 저장된 photoKey를 구독해서 가져오기
  const [photoKey, setPhotoKey] = useState<string>("profile-img/default.png");

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      const data = snap.data();

      if (data?.photoKey) {
        setPhotoKey(data.photoKey);
      }
    });
    return () => unsub();
  }, [user]);

  return (
    // 2) photoKey를 Avatar에 prop으로 전달
    <ProfileAvatar
      userDisplayName={user?.displayName ?? "사용자"}
      photoKey={photoKey}
      previewSrc={previewSrc}
      size={96}
      className="mx-auto"
      showLoading={true}
    />
  );
}
