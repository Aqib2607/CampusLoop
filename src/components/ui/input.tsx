import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  error?: boolean;
  success?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconRight, error, success, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="pointer-events-none absolute left-3.5 flex items-center text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border bg-background/50 px-4 py-2.5 text-sm text-foreground shadow-sm",
            "placeholder:text-muted-foreground/50",
            "transition-all duration-300",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:bg-background focus-visible:shadow-[var(--shadow-glow-primary)]",
            "hover:border-primary/50 hover:bg-background",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            icon && "pl-10",
            iconRight && "pr-10",
            error &&
              "border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive",
            success && "border-success focus-visible:ring-success/30 focus-visible:border-success",
            !error && !success && "border-input",
            className,
          )}
          ref={ref}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3.5 flex items-center text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
            {iconRight}
          </div>
        )}
        {error && (
          <div className="absolute right-3.5 flex items-center text-destructive [&_svg]:h-4 [&_svg]:w-4">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
