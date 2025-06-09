"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, isAuth } from "firebase-config";
import Avatar from "app/my-page/components/profile-avatar/Avatar";

export default function ProfileImage({
  previewSrc = null,
}: {
  previewSrc?: string | null;
}) {
  const user = isAuth.currentUser!;
  // 1) Firestore에 저장된 photoKey를 구독해서 가져오기
  const [photoKey, setPhotoKey] = useState<string>("profile-img/default.png");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      const data = snap.data();

      if (data?.photoKey) {
        setPhotoKey(data.photoKey);
      }
    });
    return () => unsub();
  }, [user.uid]);

  return (
    // 2) photoKey를 Avatar에 prop으로 전달
    <Avatar
      userDisplayName={user.displayName ?? "사용자"}
      photoKey={photoKey}
      previewSrc={previewSrc}
    />
  );
}
