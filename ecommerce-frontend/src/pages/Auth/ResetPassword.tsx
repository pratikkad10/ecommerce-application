import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthInput } from "@/components/auth/AuthInput";
import * as authService from "@/api/services/auth.service";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Reset token is missing or invalid. Please request a new link.");
      return;
    }
    if (!password || !confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, { password, confirmPassword });
      toast.success("Password reset successfully! You can now sign in.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Password reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grow flex items-center justify-center p-gutter md:p-lg relative overflow-hidden min-h-screen bg-background">
      {/* Ambient background styling */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-container/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary-container/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-xl relative z-10 border border-outline-variant/30">
        <div className="text-center mb-lg">
          <Link to="/">
            <h1 className="text-headline-md font-black text-primary tracking-tight">Kraya</h1>
          </Link>
        </div>

        <div className="w-20 h-20 mx-auto mb-lg rounded-full bg-surface-container flex items-center justify-center shadow-inner">
          <span className="material-symbols-outlined text-primary-container text-4xl">
            lock_reset
          </span>
        </div>

        <div className="text-center mb-lg">
          <h2 className="text-headline-sm font-bold text-on-surface mb-1">
            Create New Password
          </h2>
          <p className="text-body-md text-on-surface-variant text-xs">
            Enter your new secure password below to regain access.
          </p>
        </div>

        {!token ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">
              Invalid or missing password reset link.
            </p>
            <Button asChild className="w-full bg-primary text-on-primary rounded-xl">
              <Link to="/forgot-password">Request New Reset Link</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              id="password"
              name="password"
              type="password"
              label="New Password"
              icon="lock"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <AuthInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              icon="lock_reset"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              className="w-full bg-primary-container text-on-primary py-6 rounded-xl text-sm font-bold hover:bg-primary transition-all disabled:opacity-70 cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? "Resetting Password..." : "Reset Password & Login"}
            </Button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined mr-1 text-sm">arrow_back</span>
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
