import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { updateProfile as updateFirebaseProfile } from "firebase/auth";
import { db, isAuth } from "firebase-config";
import { useAppDispatch } from "store/redux-toolkit/hooks";
import { updateUserDisplayName } from "store/redux-toolkit/slice/userSlice";
import { UserDoc } from "app/my-page/hooks/useUserProfile";
import { ProfileFormData } from "app/my-page/components/MyProfileForm";

interface UpdateProfileParams {
  uid: string;
  data: ProfileFormData;
  dirtyFields: Partial<Record<keyof ProfileFormData, boolean>>;
  setUserDoc: React.Dispatch<React.SetStateAction<UserDoc | undefined>>;
}

export function useProfileUpdate() {
  const dispatch = useAppDispatch();

  const updateUserProfile = async ({
    uid,
    data,
    dirtyFields,
    setUserDoc,
  }: UpdateProfileParams) => {
    const userRef = doc(db, "users", uid);

    await runTransaction(db, async (transaction) => {
      let updateData: Partial<UserDoc> = {
        updatedAt: serverTimestamp(),
      };

      if (dirtyFields.displayName || dirtyFields.biography) {
        updateData = {
          ...updateData,
          displayName: data.displayName,
          biography: data.biography,
        };
      }

      // Firestore 업데이트
      transaction.update(userRef, updateData);

      // Auth 업데이트
      if (dirtyFields.displayName && isAuth.currentUser) {
        await updateFirebaseProfile(isAuth.currentUser, {
          displayName: data.displayName,
        });
        dispatch(updateUserDisplayName(data.displayName));
      }

      setUserDoc((prev) => ({
        ...prev!,
        ...updateData,
      }));
    });
  };

  return { updateUserProfile };
}
