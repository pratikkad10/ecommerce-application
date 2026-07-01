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
        variant="ghost"
        className={`p-2 text-primary dark:text-primary-fixed-dim hover:bg-surface-variant rounded-full transition-colors relative ${className ?? ""}`}
        onClick={onClick}
        aria-label={ariaLabel}
        ref={ref}
        {...props}
      >
        <span className="material-symbols-outlined" data-icon={icon}>
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
