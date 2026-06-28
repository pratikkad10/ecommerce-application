import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { AuthBanner } from "../../components/auth/AuthBanner";
import { AuthInput } from "../../components/auth/AuthInput";
import { SocialAuthOptions } from "../../components/auth/SocialAuthOptions";
import { toast } from "@/components/ui/toast";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase();
        if (errorMessage.includes("not found")) {
          toast.error("No account found with this email. Please sign up first.");
        } else if (errorMessage.includes("not verified")) {
          toast.error("Please verify your email before logging in. Check your inbox.");
        } else if (errorMessage.includes("password")) {
          toast.error("Incorrect password. Please try again.");
        } else if (errorMessage.includes("network") || errorMessage.includes("timeout")) {
          toast.error("Network error. Please check your connection and try again.");
        } else {
          toast.error("Login failed. Please try again.");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grow pt-24 pb-xl flex items-center">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter w-full h-full flex flex-col lg:flex-row gap-lg md:gap-xl items-stretch">
        <AuthBanner />

        {/* Right: Login Card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-[448px] bg-surface rounded-[2rem] p-8 md:p-lg ambient-shadow border border-outline-variant/30">
            <div className="mb-lg text-center">
              <h1 className="text-headline-md font-headline-md text-on-surface mb-2">Welcome Back</h1>
              <p className="text-body-md font-body-md text-on-surface-variant">Enter your details to securely access your account.</p>
            </div>

            <form className="space-y-md" onSubmit={handleSubmit}>
              <AuthInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                icon="mail"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <AuthInput
                id="password"
                name="password"
                type="password"
                label="Password"
                icon="lock"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Options */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input className="w-4 h-4 rounded border-outline-variant text-primary-container focus:ring-primary-container" type="checkbox" />
                  <span className="text-label-sm font-label-sm text-on-surface-variant">Remember me</span>
                </label>
                <Link className="text-label-sm font-label-sm text-primary hover:text-primary-container transition-colors underline-offset-2 hover:underline" to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-container text-on-primary text-label-md font-label-md py-4 rounded-xl lift-on-hover active:scale-95 transition-all mt-4 h-auto disabled:opacity-70 hover:bg-primary-container hover:opacity-90"
              >
                {isLoading ? "Signing in..." : "Continue"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-lg flex items-center">
              <div className="grow border-t border-outline-variant"></div>
              <span className="shrink-0 mx-4 text-label-sm font-label-sm text-outline">OR</span>
              <div className="grow border-t border-outline-variant"></div>
            </div>

            {/* Social Login */}
            <SocialAuthOptions />

            {/* Sign Up Link */}
            <div className="mt-lg text-center">
              <p className="text-body-md font-body-md text-on-surface-variant">
                Don't have an account?{" "}
                <Link className="text-primary font-bold hover:text-primary-container transition-colors underline-offset-2 hover:underline" to="/register">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
