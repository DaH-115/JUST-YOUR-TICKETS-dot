export default function SocialLogin() {
  return (
    <div className="mt-5 flex items-center justify-center space-x-2 md:mx-auto md:w-2/3">
      <div className="border-2 border-b-2">
        <button>구글 로그인</button>
      </div>
      <div className="border-2 border-b-2">
        <button>깃허브 로그인</button>
      </div>
    </div>
  );
}
