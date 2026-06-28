
/**
 * AnimatedEmailIcon Component
 * 
 * Renders an animated "check your email" icon with pulsing background
 * and simulated success particles. Used primarily in the Verify Email screen.
 */
export function AnimatedEmailIcon() {
  return (
    <div className="flex justify-center mb-lg">
      <div className="relative w-32 h-32 flex items-center justify-center bg-surface-container-low rounded-full animate-[pulse_3s_ease-in-out_infinite]">
        <span
          className="material-symbols-outlined text-[64px] text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          mark_email_read
        </span>
        {/* Simulated success particles */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-primary-container rounded-full animate-ping"></div>
        <div className="absolute bottom-4 left-2 w-3 h-3 bg-secondary-container rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
