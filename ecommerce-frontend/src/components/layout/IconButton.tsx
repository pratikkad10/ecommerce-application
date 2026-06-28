import React from "react";
import { Button } from "@/components/ui/button";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  badge?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, badge, onClick, className, "aria-label": ariaLabel, ...props }, ref) => {
    return (
      <Button
        variant="navIcon"
        size="icon"
        className={`relative ${className ?? ""}`}
        onClick={onClick}
        aria-label={ariaLabel}
        ref={ref}
        {...props}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          {icon}
        </span>
        {badge && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary-container rounded-full" aria-hidden="true" />
        )}
      </Button>
    );
  }
);
IconButton.displayName = "IconButton";
