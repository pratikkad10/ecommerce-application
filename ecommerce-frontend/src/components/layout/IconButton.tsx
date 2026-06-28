import { Button } from "@/components/ui/button";

export function IconButton({
  icon,
  className,
  badge,
}: {
  icon: string;
  className?: string;
  badge?: boolean;
}) {
  return (
    <Button
      variant="navIcon"
      size="icon"
      className={`relative ${className || ""}`}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontVariationSettings: "'FILL' 0" }}
      >
        {icon}
      </span>
      {badge && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-primary-container rounded-full"></span>
      )}
    </Button>
  );
}
