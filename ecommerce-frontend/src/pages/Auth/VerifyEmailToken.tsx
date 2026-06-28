import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthBackgroundGraphics } from '@/components/auth/AuthBackgroundGraphics';
import * as authService from '../../api/services/auth.service';

type VerificationState = 'loading' | 'success' | 'error';

/**
 * VerifyEmailToken Page Component
 *
 * Handles the actual token verification when the user clicks the
 * link from their email (/verify-email?token=...).
 *
 * - If token is valid  → calls backend, then redirects to /email-verified
 * - If token is missing/invalid → shows an error state with a retry option
 */
export function VerifyEmailToken() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<VerificationState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token found. Please check your email for the correct link.');
      return;
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        // Redirect to success page after a short delay so user sees the success state
        setTimeout(() => {
          navigate('/email-verified');
        }, 1500);
      } catch (err: unknown) {
        setStatus('error');
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'This verification link is invalid or has expired. Please request a new one.'
        );
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <main className="grow flex items-center justify-center p-gutter pt-32 pb-xl relative overflow-hidden">
      <AuthBackgroundGraphics />

      <Card className="max-w-[448px] w-full bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-lg border border-surface-container z-10 relative">
        <CardHeader className="p-0 items-center text-center space-y-0 mb-xl">

          {/* Loading State Icon */}
          {status === 'loading' && (
            <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-primary-container text-[48px] animate-spin">
                progress_activity
              </span>
            </div>
          )}

          {/* Success State Icon */}
          {status === 'success' && (
            <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-8">
              <span className="material-symbols-outlined fill text-primary-container text-[48px]">
                check_circle
              </span>
            </div>
          )}

          {/* Error State Icon */}
          {status === 'error' && (
            <div className="w-24 h-24 rounded-full bg-error-container flex items-center justify-center mb-8">
              <span className="material-symbols-outlined fill text-error text-[48px]">
                error
              </span>
            </div>
          )}

          <CardTitle className="text-headline-md font-headline-md text-on-surface mb-sm">
            {status === 'loading' && 'Verifying your email…'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>

          <CardDescription className="text-body-md font-body-md text-on-surface-variant">
            {status === 'loading' && 'Please wait while we confirm your email address.'}
            {status === 'success' && 'Redirecting you to the app…'}
            {status === 'error' && errorMessage}
          </CardDescription>
        </CardHeader>

        {/* Only show action buttons in error state */}
        {status === 'error' && (
          <CardContent className="p-0 flex flex-col gap-sm">
            <Button
              onClick={() => navigate('/verify-email')}
              className="w-full bg-primary-container text-white py-6 px-8 rounded-lg text-label-md font-label-md hover:bg-primary-container hover:opacity-90 transition-all duration-200 h-auto"
            >
              Resend Verification Email
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="w-full border-outline-variant text-on-surface py-6 px-8 rounded-lg text-label-md font-label-md h-auto"
            >
              Back to Login
            </Button>
          </CardContent>
        )}
      </Card>
    </main>
  );
}
