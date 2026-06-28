import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Img } from '@/components/ui/image';
import { AnimatedEmailIcon } from '@/components/auth/AnimatedEmailIcon';
import { getEmailProviderUrl } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import * as authService from '../../api/services/auth.service';
import { toast } from '@/components/ui/toast';

export function VerifyEmailCard() {
  const location = useLocation();
  const email = location.state?.email;
  
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    
    if (!email) {
      toast.error("Email not found. Please try registering again.");
      return;
    }

    setIsResending(true);
    try {
      await authService.resendVerificationEmail(email);
      toast.success("Verification email resent successfully! Please check your inbox.");
      setCountdown(30); 
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase();
        if (errorMessage.includes("not found")) {
          toast.error("Account not found. Please register first.");
        } else if (errorMessage.includes("already verified")) {
          toast.info("Your email is already verified. You can log in now.");
        } else {
          toast.error("Failed to resend email. Please try again.");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };



  const handleOpenEmailApp = () => {
    const url = getEmailProviderUrl(email);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="max-w-[448px] w-full bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-lg border border-surface-container z-10 relative">
      <CardHeader className="p-0 mb-xl items-center text-center space-y-0">
        <div className="flex justify-center mb-md">
          <Img
            alt="Kraya Brand Reference"
            className="w-24 h-24 object-cover rounded-full border-4 border-surface-container shadow-sm mb-4"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDowJcbK5-6VtsTnPT_nYSgkYlAOUj5lkGm7YNF72qkHol9sotslgdlolFepQJOcHeVgsYZZj970utJ__iRVagrcIMbvDHhwOMxC12Mo0kFc2QGWzA2lp-QgBUI9M4rs-an87v4JQgMHttX61PvwAvo-f4-w6pB_jz4lGB4Q2O7IlQM43FfuRRC00fby_HikEfjzIQLLpCOpy9mzS02zXPBOZTU_akP0WfQOR68uBGXTFq_0yVNvNxjWKQINw9f8eunFKMSA5R8_AE-"
          />
        </div>
        <AnimatedEmailIcon />
        <CardTitle className="text-headline-md font-headline-md text-primary mb-sm">
          Check Your Inbox
        </CardTitle>
        <CardDescription className="text-body-md font-body-md text-on-surface-variant">
          We've sent a verification link to your email address. Please click the link to confirm your account and start shopping.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 mb-sm">
        <Button
          onClick={handleOpenEmailApp}
          className="w-full bg-primary-container text-white py-6 px-8 rounded-lg text-label-md font-label-md hover:bg-primary-container hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center gap-2 group"
        >
          <span>Open Email App</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </Button>
      </CardContent>

      <CardFooter className="p-0 flex flex-col gap-sm items-center">
        <Button 
          variant="ghost"
          onClick={handleResend}
          disabled={countdown > 0 || isResending}
          className={`text-body-md font-body-md transition-colors duration-200 flex items-center gap-2 h-auto py-2 hover:bg-transparent ${
            countdown > 0 || isResending
              ? "text-outline cursor-not-allowed" 
              : "text-on-surface hover:text-primary"
          }`}
        >
          <span className={`material-symbols-outlined text-[20px] ${isResending ? 'animate-spin' : ''}`}>
            refresh
          </span>
          {isResending ? "Resending..." : countdown > 0 ? `Resend Email in ${countdown}s` : "Resend Email"}
        </Button>
        <div className="flex gap-4 text-sm text-on-surface-variant mt-2">
          <Link to="/change-email" className="hover:text-primary hover:underline transition-colors">
            Change Email
          </Link>
          <span>•</span>
          <Link to="/support" className="hover:text-primary hover:underline transition-colors">
            Contact Support
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
