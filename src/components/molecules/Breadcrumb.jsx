import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useLanguage } from "@/hooks/useLanguage";
import ApperIcon from "@/components/ApperIcon";

const Breadcrumb = ({ items, className }) => {
  const { isRTL } = useLanguage();

  return (
    <nav className={cn("flex items-center space-x-2 text-sm", isRTL && "space-x-reverse", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && (
            <ApperIcon 
              name="ChevronRight" 
              className={cn(
                "h-4 w-4 text-slate-400",
                isRTL && "rtl-flip"
              )} 
            />
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-600 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;