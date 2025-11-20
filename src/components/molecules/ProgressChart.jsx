import React from "react";
import { cn } from "@/utils/cn";

const ProgressChart = ({ percentage = 0, size = "md", showLabel = true, color = "blue" }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizes = {
    sm: { container: "w-16 h-16", text: "text-xs" },
    md: { container: "w-20 h-20", text: "text-sm" },
    lg: { container: "w-24 h-24", text: "text-base" }
  };

  const colors = {
    blue: { stroke: "stroke-blue-500", bg: "stroke-blue-100" },
    emerald: { stroke: "stroke-emerald-500", bg: "stroke-emerald-100" },
    amber: { stroke: "stroke-amber-500", bg: "stroke-amber-100" },
    red: { stroke: "stroke-red-500", bg: "stroke-red-100" }
  };

  return (
    <div className={cn("relative", sizes[size].container)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="8"
          className={colors[color].bg}
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={cn(colors[color].stroke, "transition-all duration-300 ease-in-out")}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-semibold text-slate-900", sizes[size].text)}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;