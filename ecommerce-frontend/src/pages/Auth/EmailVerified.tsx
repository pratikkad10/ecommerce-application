import { ConfettiBackground } from '@/components/auth/ConfettiBackground';
import { EmailVerifiedCard } from '@/components/auth/EmailVerifiedCard';

/**
 * EmailVerified Page Component
 * 
 * Displays the successful verification state with a confetti canvas background 
 * and an animated checkmark card.
 */
export function EmailVerified() {
  return (
    <main className="grow flex items-center justify-center p-gutter pt-32 pb-xl relative overflow-hidden bg-ambient-gradient">
      {/* Confetti Canvas Background */}
      <ConfettiBackground />

      {/* Verification Success Card */}
      <EmailVerifiedCard />
    </main>
  );
}
