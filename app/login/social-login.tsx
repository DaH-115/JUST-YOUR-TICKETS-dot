import { isAuth } from "firebase-config";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SocialLogin() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(isAuth, provider);
      router.push("/");
    } catch (error) {
      console.error("Google 로그인 에러:", error);
    }
  };

  const handleGithubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(isAuth, provider);
      router.push("/");
    } catch (error) {
      console.error("GitHub 로그인 에러:", error);
    }
  };

  return (
    <>
      <div className="mx-auto my-4 flex w-2/3 items-center">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="mx-4 text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex space-x-2">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-start rounded-full border-2 border-gray-300 p-4 transition-colors duration-300 hover:border-gray-400 hover:bg-gray-100"
          >
            <FcGoogle size={24} />
          </button>
          <button
            onClick={handleGithubLogin}
            className="flex items-center justify-start rounded-full border-2 border-gray-300 p-4 transition-colors duration-300 hover:border-gray-400 hover:bg-gray-100"
          >
            <FaGithub size={24} />
          </button>
        </div>
      </div>
    </>
  );
}
