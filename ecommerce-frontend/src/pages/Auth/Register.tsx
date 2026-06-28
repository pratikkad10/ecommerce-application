import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../api/services/auth.service";
import { Button } from "@/components/ui/button";
import { AuthBanner } from "../../components/auth/AuthBanner";
import { AuthInput } from "../../components/auth/AuthInput";
import { SocialAuthOptions } from "../../components/auth/SocialAuthOptions";

export function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({ firstName, lastName, email, password });
      navigate("/verify-email", { state: { email } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grow pt-24 pb-xl flex items-center">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter w-full h-full flex flex-col lg:flex-row gap-lg md:gap-xl items-stretch">
        <AuthBanner />

        {/* Right: Registration Card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-[448px] bg-surface rounded-[2rem] p-8 md:p-lg ambient-shadow border border-outline-variant/30">
            <div className="mb-lg text-center">
              <h1 className="text-headline-md font-headline-md text-on-surface mb-2">Join Kraya</h1>
              <p className="text-body-md font-body-md text-on-surface-variant">Create your free account today.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-error-container text-on-error-container text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <AuthInput
                  id="firstName"
                  type="text"
                  label="First Name"
                  icon="person"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <AuthInput
                  id="lastName"
                  type="text"
                  label="Last Name"
                  icon="person"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <AuthInput
                id="email"
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
                type="password"
                label="Password"
                icon="lock"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <AuthInput
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                icon="lock"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-container text-on-primary text-label-md font-label-md py-4 rounded-xl lift-on-hover active:scale-95 transition-all mt-4 h-auto disabled:opacity-70 hover:bg-primary-container hover:opacity-90"
              >
                {isLoading ? "Creating account..." : "Create Account"}
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

            {/* Login Link */}
            <div className="mt-lg text-center">
              <p className="text-body-md font-body-md text-on-surface-variant">
                Already have an account?{" "}
                <Link className="text-primary font-bold hover:text-primary-container transition-colors underline-offset-2 hover:underline" to="/login">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
