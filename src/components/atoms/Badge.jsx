import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    success: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    warning: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    danger: "bg-red-100 text-red-800 hover:bg-red-200",
    info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    secondary: "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;