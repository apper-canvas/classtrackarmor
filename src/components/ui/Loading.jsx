import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, type = "skeleton" }) => {
  if (type === "skeleton") {
    return (
      <div className={cn("animate-pulse space-y-4", className)}>
        <div className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-1/2"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded"></div>
                <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100", className)}>
      <div className="text-center space-y-4">
        <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <div className="bg-gradient-to-r from-primary-600 to-sky-500 bg-clip-text text-transparent">
          <p className="text-lg font-semibold">Loading SafetyHub...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;