import { User } from "firebase/auth";
import { SerializableUser } from "store/userSlice";

// Firebase User 객체를 직렬화 가능한 형태로 변환하는 유틸리티 함수
export const serializeUser = (user: User): SerializableUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});
