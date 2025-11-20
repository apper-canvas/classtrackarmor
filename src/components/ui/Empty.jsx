import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "FileX",
  title = "No data found",
  message = "There's nothing to show here yet.",
  actionLabel,
  onAction,
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center",
      className
    )}>
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="h-8 w-8 text-slate-400" />
      </div>
      
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        {title}
      </h3>
      
      <p className="text-slate-500 mb-6 max-w-md">
        {message}
      </p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          icon="Plus"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;