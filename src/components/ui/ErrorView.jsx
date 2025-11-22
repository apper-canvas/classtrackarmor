import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  className,
  title = "Something went wrong",
  message = "We encountered an error while loading this page. Please try again.",
  onRetry,
  showRetry = true
}) => {
  return (
    <div className={cn("min-h-[400px] flex items-center justify-center", className)}>
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="text-slate-600 leading-relaxed">{message}</p>
        </div>

        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorView;