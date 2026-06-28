import { HeroContent } from "./HeroContent";
import { HeroVisual } from "./HeroVisual";

export function HeroSection() {
  return (
    <section className="relative min-h-[870px] flex items-center pt-24 pb-xl overflow-hidden bg-linear-to-br from-surface-bright to-surface-container-low">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, var(--color-primary-container) 0%, transparent 40%)",
        }}
      ></div>
      <div className="max-w-container-max mx-auto px-gutter w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
          <HeroContent />
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
