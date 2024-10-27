import { SocialProvider } from "app/login/social-login";

interface SocialLoginButtonProps {
  provider: SocialProvider;
  icon: React.ReactNode;
  label: string;
  onSocialLogin: (provider: SocialProvider) => Promise<void>;
  isLoading: boolean;
}

export default function SocialLoginButton({
  provider,
  icon,
  label,
  onSocialLogin,
  isLoading,
}: SocialLoginButtonProps) {
  return (
    <button
      onClick={() => onSocialLogin(provider)}
      disabled={isLoading}
      className={`group relative flex items-center justify-start rounded-full border-2 ${
        isLoading
          ? "cursor-not-allowed border-gray-200 bg-gray-50"
          : "border-gray-300 hover:border-gray-400 hover:bg-gray-100"
      } p-4 transition-all duration-300`}
      aria-label={`${label} 로그인`}
    >
      <span className={isLoading ? "opacity-50" : ""}>{icon}</span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
        </div>
      )}
    </button>
  );
}
