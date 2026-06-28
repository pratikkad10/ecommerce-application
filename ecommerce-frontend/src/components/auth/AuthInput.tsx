import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
}

export function AuthInput({ label, icon, id, ...props }: AuthInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-sm font-label-sm text-on-surface-variant ml-1" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">
          {icon}
        </span>
        <Input
          id={id}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-container focus-visible:border-primary-container focus-visible:ring-offset-0 transition-colors shadow-sm h-auto"
          {...props}
        />
      </div>
    </div>
  );
}
