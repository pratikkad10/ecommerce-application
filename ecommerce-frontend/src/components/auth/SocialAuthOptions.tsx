import { Button } from "@/components/ui/button";

interface SocialLoginButtonProps {
  provider: "Google" | "Facebook";
  iconSrc: string;
  onClick?: () => void;
}

function SocialLoginButton({ provider, iconSrc, onClick }: SocialLoginButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center space-x-3 py-3 border border-outline-variant rounded-xl text-label-md font-label-md text-on-surface hover:bg-surface-container transition-colors bg-surface-container-lowest h-auto"
      onClick={onClick}
      type="button"
    >
      <img alt={provider} className="w-5 h-5" src={iconSrc} />
      <span>Continue with {provider}</span>
    </Button>
  );
}

export function SocialAuthOptions() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${backendUrl}/api/v1/auth/google`;
  };

  const handleFacebookLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${backendUrl}/api/v1/auth/facebook`;
  };

  return (
    <div className="space-y-sm">
      <SocialLoginButton
        provider="Google"
        iconSrc="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
        onClick={handleGoogleLogin}
      />
      <SocialLoginButton
        provider="Facebook"
        iconSrc="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg"
        onClick={handleFacebookLogin}
      />
    </div>
  );
}
