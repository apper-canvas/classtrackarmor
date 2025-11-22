import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className,
  icon = "Inbox",
  title = "No data available",
  message = "Get started by adding your first item.",
  actionLabel,
  onAction
}) => {
  return (
    <div className={cn("min-h-[400px] flex items-center justify-center", className)}>
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="h-10 w-10 text-slate-400" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="text-slate-600 leading-relaxed">{message}</p>
        </div>

        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-sky-500 text-white font-medium rounded-lg hover:from-primary-700 hover:to-sky-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;