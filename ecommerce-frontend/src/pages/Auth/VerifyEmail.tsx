import { AuthBackgroundGraphics } from '@/components/auth/AuthBackgroundGraphics';
import { VerifyEmailCard } from '@/components/auth/VerifyEmailCard';

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
      <AuthBackgroundGraphics />

      {/* Verification Card with Logic */}
      <VerifyEmailCard />
    </main>
  );
}
