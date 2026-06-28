
export function AnimatedSuccessIcon() {
  return (
    <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-8 animate-check-circle">
      <svg
        className="w-12 h-12 text-primary-container"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="animate-check-path"
          d="M5 13l4 4L19 7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}
