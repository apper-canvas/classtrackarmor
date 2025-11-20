import React from "react";
import { cn } from "@/utils/cn";
import { getDeadlineStatus, getTimeRemaining } from "@/utils/dateUtils";
import ApperIcon from "@/components/ApperIcon";

const DeadlineCountdown = ({ dueDate, className }) => {
  const { status, color } = getDeadlineStatus(dueDate);
  const timeRemaining = getTimeRemaining(dueDate);

  const colorClasses = {
    emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200", 
    red: "bg-red-100 text-red-800 border-red-200"
  };

  const iconName = {
    normal: "Clock",
    warning: "AlertTriangle",
    urgent: "AlertCircle",
    overdue: "XCircle"
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border",
      colorClasses[color],
      className
    )}>
      <ApperIcon name={iconName[status]} className="h-4 w-4" />
      {timeRemaining}
    </div>
  );
};

export default DeadlineCountdown;