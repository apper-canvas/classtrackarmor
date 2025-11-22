import React from "react";
import { cn } from "@/utils/cn";

const Card = ({ 
  children, 
  className,
  gradient = false,
  hover = false,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-md border border-slate-200 p-6",
        gradient && "bg-gradient-to-br from-white to-slate-50",
        hover && "hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;