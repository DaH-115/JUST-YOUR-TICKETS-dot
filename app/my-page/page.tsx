"use client";

import { useEffect, useState } from "react";
import { db } from "firebase-config";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import ChangePassword from "app/my-page/change-password";
import SideReviewList from "app/my-page/side-review-list";
import SideMenu from "./side-menu";
import { useAppSelector } from "store/hooks";

type FormData = {
  displayName: string;
  biography: string;
};

export default function MyPage() {
  const [userDoc, setUserDoc] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const userState = useAppSelector((state) => state.user.user);
  const {
    setValue,
    register,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm<FormData>({
    defaultValues: {
      displayName: userState?.displayName,
      biography: userDoc?.biography,
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", userState.uid);

      try {
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userDoc = docSnap.data();
          setUserDoc(userDoc);
        } else {
          console.log("해당 문서가 존재하지 않습니다.");
        }
      } catch (err) {
        console.log("사용자 정보를 가져오는 중 오류 발생: " + err);
      }
    };

    if (userState?.uid) {
      fetchUserData();
    }
  }, [userState?.uid]);

  useEffect(() => {
    if (userState) {
      setValue("displayName", userState.displayName);
    }
  }, [userState, setValue]);

  useEffect(() => {
    if (userDoc) {
      setValue("biography", userDoc.biography);
    }
  }, [userDoc, setValue]);

  const editingHandler = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmitHandler = async (data: FormData) => {
    if (Object.keys(dirtyFields).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      console.log("프로필을 업데이트 중입니다...");

      if (dirtyFields.displayName && userState) {
        await updateProfile(userState, { displayName: data.displayName });
      }

      if (dirtyFields.biography && userState?.uid) {
        const userDocRef = doc(db, "users", userState.uid);
        await updateDoc(userDocRef, { biography: data.biography });
        setUserDoc({ ...userDoc, biography: data.biography });
      }

      console.log("프로필이 성공적으로 업데이트되었습니다.");
      setIsEditing(false);
    } catch (error) {
      console.error("프로필 업데이트 중 오류 발생:", error);
    }
  };

  return (
    <div id="layout" className="mt-24 flex w-full px-8">
      <SideMenu uid={userState?.uid} />

      {/* Main */}
      <div className="flex w-full flex-col">
        <div className="border-2 border-black px-8 pb-12 pt-8">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="flex border-b-2 border-black pb-4">
              <h1 className="w-full text-2xl font-bold">프로필</h1>
              {isEditing ? (
                <button className="whitespace-nowrap text-sm">저장</button>
              ) : (
                <div
                  onClick={editingHandler}
                  className="flex items-center whitespace-nowrap text-sm"
                >
                  수정
                </div>
              )}
            </div>
            <div className="border-b-2 border-black pb-2 pt-4">
              <div className="text-sm">이름</div>
              <div className="flex w-full items-center">
                {isEditing ? (
                  <input
                    {...register("displayName")}
                    type="text"
                    className="w-full bg-transparent text-2xl font-bold outline-none"
                  />
                ) : (
                  <div className="w-full bg-transparent text-2xl font-bold outline-none">
                    {userState?.displayName}
                  </div>
                )}
              </div>
            </div>
            <div className="border-b-2 border-black pb-2 pt-4">
              <div className="text-sm">바이오</div>
              <div className="flex w-full items-center">
                {isEditing ? (
                  <input
                    {...register("biography")}
                    type="text"
                    className="w-full bg-transparent text-xl outline-none"
                  />
                ) : (
                  <div className="w-full text-xl">{userDoc?.biography}</div>
                )}
              </div>
            </div>
          </form>
          <div className="border-b-2 border-black pb-2 pt-4">
            <div className="text-sm">이메일</div>
            <div className="flex items-center">
              <div className="mr-4 w-full text-xl">{userState?.email}</div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <ChangePassword user={userState} />
      </div>

      {/* Side Review List */}
      <SideReviewList uid={userState?.uid} />
    </div>
  );
}
