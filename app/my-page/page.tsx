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

interface UserDoc {
  biography: string;
  userName: string;
}

export default function MyPage() {
  const [userDoc, setUserDoc] = useState<UserDoc>();
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
          const userDoc = docSnap.data() as UserDoc;
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
        setUserDoc((prevUserDoc) => {
          if (prevUserDoc) {
            return { ...prevUserDoc, biography: data.biography };
          }
          return prevUserDoc;
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("프로필 업데이트 중 오류 발생:", error);
    }
  };

  return (
    <div id="layout" className="mt-20 flex w-full px-8">
      <SideMenu uid={userState?.uid} />

      {/* Main */}
      <div className="flex w-full flex-col">
        <div className="group relative inline-block w-full">
          <div className="relative z-10 rounded-xl border-2 border-black bg-white px-8 pb-12 pt-8 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <div className="flex border-b-2 border-black pb-2 font-bold">
                <h1 className="w-full text-2xl">프로필</h1>
                {isEditing ? (
                  <div className="flex cursor-pointer items-center whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors duration-300 hover:bg-black hover:text-white">
                    <button className="whitespace-nowrap text-sm">저장</button>
                  </div>
                ) : (
                  <div
                    onClick={editingHandler}
                    className="flex cursor-pointer items-center whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors duration-300 hover:bg-black hover:text-white"
                  >
                    수정
                  </div>
                )}
              </div>
              <div className="border-b border-black pb-2 pt-4">
                <div className="text-sm">이름</div>
                <div className="flex w-full items-center">
                  {isEditing ? (
                    <input
                      {...register("displayName")}
                      type="text"
                      className="w-full bg-transparent text-2xl outline-none"
                    />
                  ) : (
                    <div className="w-full bg-transparent text-2xl outline-none">
                      {userState?.displayName}
                    </div>
                  )}
                </div>
              </div>
              <div className="border-b border-black pb-2 pt-4">
                <div className="text-sm">바이오</div>
                <div className="flex w-full items-center">
                  {isEditing ? (
                    <input
                      {...register("biography")}
                      type="text"
                      className="w-full bg-transparent text-xl outline-none"
                    />
                  ) : (
                    <div className="w-full">{userDoc?.biography}</div>
                  )}
                </div>
              </div>
            </form>
            <div className="border-b border-black pb-2 pt-4">
              <div className="text-sm">이메일</div>
              <div className="flex items-center">
                <div className="mr-4 w-full text-xl">{userState?.email}</div>
              </div>
            </div>
          </div>
          <div className="absolute left-1 top-1 -z-10 h-full w-full rounded-xl border-2 border-black bg-black transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:bg-gray-200"></div>
        </div>

        {/* Change Password */}
        <ChangePassword user={userState} />
      </div>

      {/* Side Review List */}
      <SideReviewList uid={userState?.uid} />
    </div>
  );
}
