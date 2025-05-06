"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, isAuth } from "firebase-config";
import Avatar from "app/my-page/components/profile-avatar/Avatar";
import AvatarUploader from "app/my-page/components/profile-avatar/AvatarUploader";

export default function ProfileImage() {
  const user = isAuth.currentUser!;
  // 1) Firestore에 저장된 photoKey를 구독해서 가져오기
  const [photoKey, setPhotoKey] = useState<string>("profile-img/default.png");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      const data = snap.data();
      if (data?.photoKey) setPhotoKey(data.photoKey);
    });
    return () => unsub();
  }, [user.uid]);

  return (
    <div className="space-y-4">
      {/* 2) photoKey를 Avatar에 prop으로 전달 */}
      <Avatar
        userDisplayName={user.displayName ?? "사용자"}
        photoKey={photoKey}
        previewSrc={previewSrc}
      />
      <AvatarUploader
        previewSrc={previewSrc}
        onPreview={(url) => setPreviewSrc(url)}
        onCancelPreview={() => setPreviewSrc(null)}
      />
    </div>
  );
}
