import { SocialProvider } from "app/login/components/SocialLogin";

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
      className={`flex w-full items-center justify-center space-x-3 rounded-xl border p-4 font-medium text-gray-700 transition-all duration-300 ${
        isLoading
          ? "cursor-not-allowed opacity-50"
          : "hover:border-gray-300 hover:bg-gray-100"
      }`}
      aria-label={`${label} 로그인`}
    >
      <span className={isLoading ? "opacity-50" : ""}>{icon}</span>
      <span className="text-sm">{label}</span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
        </div>
      )}
    </button>
  );
}
