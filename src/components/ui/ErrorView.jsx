import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorView = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading your data. Please try again.",
  onRetry,
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      className
    )}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="h-8 w-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {title}
      </h3>
      
      <p className="text-slate-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          icon="RotateCcw"
          variant="secondary"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorView;