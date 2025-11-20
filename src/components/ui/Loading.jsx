import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 3 }) => {
  return (
    <div className={cn("space-y-4 animate-pulse", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-slate-200 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-3 bg-slate-200 rounded w-5/6" />
            </div>
            <div className="w-20 h-8 bg-slate-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;