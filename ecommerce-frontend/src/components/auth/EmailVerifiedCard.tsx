import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AnimatedSuccessIcon } from '@/components/auth/AnimatedSuccessIcon';
import { Link } from 'react-router-dom';

export function EmailVerifiedCard() {
  return (
    <Card className="max-w-[448px] w-full bg-surface-container-lowest rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-10 border border-surface-variant z-10 relative">
      <CardHeader className="p-0 flex flex-col items-center text-center space-y-0">
        <AnimatedSuccessIcon />
        <CardTitle className="text-headline-md md:text-headline-lg font-headline-md md:font-headline-lg text-on-surface mb-4">
          Email Verified!
        </CardTitle>
        <CardDescription className="text-body-lg font-body-lg text-on-surface-variant mb-10 max-w-[300px]">
          Your account is now fully active. You're all set to explore and discover the best of Kraya.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 w-full flex flex-col gap-sm">
        <Link to="/" className="w-full">
          <Button
            variant="hero"
            className="w-full py-6 px-8 rounded-lg text-label-md font-label-md hover:scale-[1.02] active:scale-95 h-auto shadow-sm hover:shadow-md"
          >
            Continue Shopping
          </Button>
        </Link>
        <Link to="/dashboard" className="w-full">
          <Button
            variant="heroOutline"
            className="w-full py-6 px-8 rounded-lg text-label-md font-label-md hover:bg-surface-container-low active:scale-95 h-auto"
          >
            Go to Dashboard
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
