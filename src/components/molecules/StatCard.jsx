import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  className,
  gradient = true 
}) => {
  const getTrendColor = () => {
    if (trend === "up") return "text-emerald-600";
    if (trend === "down") return "text-red-600";
    return "text-slate-600";
  };

  const getTrendIcon = () => {
    if (trend === "up") return "TrendingUp";
    if (trend === "down") return "TrendingDown";
    return "Minus";
  };

  return (
    <Card className={cn("", className)} gradient={gradient}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {value}
          </p>
          {trend && trendValue && (
            <div className={cn("flex items-center space-x-1 text-sm", getTrendColor())}>
              <ApperIcon name={getTrendIcon()} className="h-4 w-4" />
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-sky-100 rounded-lg flex items-center justify-center">
            <ApperIcon name={icon} className="h-6 w-6 text-primary-600" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;