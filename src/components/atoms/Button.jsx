import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  disabled,
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md",
    ghost: "hover:bg-slate-100 text-slate-700 hover:text-slate-900",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm font-medium rounded-md",
    md: "px-4 py-2 text-sm font-medium rounded-lg",
    lg: "px-6 py-3 text-base font-semibold rounded-lg"
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isDisabled}
      ref={ref}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
      )}
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon name={icon} className="h-4 w-4" />
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} className="h-4 w-4" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;