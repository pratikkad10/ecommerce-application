import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AuthInput } from '@/components/auth/AuthInput';
import { forgotPassword } from '@/api/services/auth.service';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("If an account exists, a reset link has been sent to your email.");
      setEmail('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grow flex items-center justify-center p-gutter md:p-lg relative overflow-hidden min-h-screen bg-background">
      {/* Subtle Ambient Background Element */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-container/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary-container/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-xl relative z-10 border border-outline-variant/30">
        {/* Minimal Logo/Brand Header */}
        <div className="text-center mb-lg">
          <Link to="/">
            <h1 className="text-headline-md font-headline-lg-mobile font-black text-primary tracking-tight">Kraya</h1>
          </Link>
        </div>

        {/* Illustration Area */}
        <div className="w-24 h-24 mx-auto mb-lg rounded-full bg-surface-container flex items-center justify-center shadow-inner">
          <span className="material-symbols-outlined text-primary-container" style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}>lock_reset</span>
        </div>

        {/* Header Text */}
        <div className="text-center mb-lg">
          <h2 className="text-headline-sm font-headline-sm text-on-surface mb-sm">Forgot Password?</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">We'll send you a link to reset your password.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-md">
          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            icon="mail"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            className="w-full bg-primary-container text-on-primary py-[24px] rounded-lg text-label-md font-label-md hover:scale-[1.02] hover:shadow-lg transition-all duration-200 hover:bg-primary-container lift-on-hover active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Reset Password"}
          </Button>
        </form>

        {/* Back to Login */}
        <div className="mt-lg text-center">
          <Link to="/login" className="inline-flex items-center text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200">
            <span className="material-symbols-outlined mr-xs text-[16px]">arrow_back</span>
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
};
