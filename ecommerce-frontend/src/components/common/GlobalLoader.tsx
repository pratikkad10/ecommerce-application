import { cn } from '@/lib/utils';

interface GlobalLoaderProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function GlobalLoader({
  message = "Curating your experience...",
  fullScreen = true,
  className
}: GlobalLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center font-body-md text-on-surface",
        fullScreen ? "fixed inset-0 z-50 bg-[#FAFAFA]" : "w-full py-12",
        className
      )}
    >
      <div className="flex flex-col items-center gap-lg">
        {/* Logo */}
        <div className="animate-pulse-logo">
          <h1 className="text-headline-lg md:text-display font-headline-lg md:font-display text-primary tracking-tight">
            Kraya
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex flex-col items-center gap-sm">
          <div className="w-[200px] h-1 bg-surface-variant rounded-full overflow-hidden relative">
            <div className="h-full bg-primary-container w-0 animate-load"></div>
          </div>
          <p className="text-label-md font-label-md text-on-surface-variant opacity-70">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
