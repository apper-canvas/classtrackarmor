import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "sm",
  className 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
    success: "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800",
    warning: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    ceo: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800",
    manager: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800",
    user: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
  };

  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-0.5 text-sm",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  };

  return (
    <span className={cn(baseClasses, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};

export default Badge;