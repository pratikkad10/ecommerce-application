import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatedEmailIcon } from '@/components/auth/AnimatedEmailIcon';
import { Link } from 'react-router-dom';

/**
 * VerifyEmail Page Component
 * 
 * Displays the "After Registration" success state prompting the user 
 * to check their email for a verification link.
 * Implements a pixel-perfect design matching the provided HTML mock.
 */
export function VerifyEmail() {
  return (
    <main className="grow flex items-center justify-center p-gutter pt-32 pb-xl relative overflow-hidden">

      {/* Background Graphic Element */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-container rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary-container rounded-full blur-[100px]"></div>
      </div>

      <Card className="max-w-md w-full bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-lg border border-surface-container z-10 relative">

        {/* Branding / Imagery */}
        <div className="flex justify-center mb-md">
          <img
            alt="Kraya Brand Reference"
            className="w-24 h-24 object-cover rounded-full border-4 border-surface-container shadow-sm mb-4"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDowJcbK5-6VtsTnPT_nYSgkYlAOUj5lkGm7YNF72qkHol9sotslgdlolFepQJOcHeVgsYZZj970utJ__iRVagrcIMbvDHhwOMxC12Mo0kFc2QGWzA2lp-QgBUI9M4rs-an87v4JQgMHttX61PvwAvo-f4-w6pB_jz4lGB4Q2O7IlQM43FfuRRC00fby_HikEfjzIQLLpCOpy9mzS02zXPBOZTU_akP0WfQOR68uBGXTFq_0yVNvNxjWKQINw9f8eunFKMSA5R8_AE-"
          />
        </div>

        {/* Animated Icon Component */}
        <AnimatedEmailIcon />

        {/* Content */}
        <div className="text-center mb-xl">
          <h1 className="text-headline-md font-headline-md text-primary mb-sm">
            Check Your Inbox
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            We've sent a verification link to your email address. Please click the link to confirm your account and start shopping.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-md">
          {/* Main Action Button */}
          <Button
            className="w-full bg-primary-container text-white py-6 px-8 rounded-lg text-label-md font-label-md hover:bg-primary transition-colors duration-200 shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center gap-2 group"
          >
            <span>Open Email App</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Button>

          {/* Secondary Actions */}
          <div className="flex flex-col gap-sm items-center">
            <button className="text-body-md font-body-md text-on-surface hover:text-primary transition-colors duration-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">refresh</span>
              Resend Email
            </button>
            <div className="flex gap-4 text-sm text-on-surface-variant mt-2">
              <Link to="/change-email" className="hover:text-primary hover:underline transition-colors">
                Change Email
              </Link>
              <span>•</span>
              <Link to="/support" className="hover:text-primary hover:underline transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

      </Card>
    </main>
  );
}
