import React from "react";
import { cn } from "@/utils/cn";
import { useLanguage } from "@/hooks/useLanguage";
import ApperIcon from "@/components/ApperIcon";
import LanguageSelector from "@/components/molecules/LanguageSelector";

const TopBar = ({ onMenuClick, sidebarOpen }) => {
  const { isRTL } = useLanguage();

  return (
    <header className="h-16 bg-white border-b border-slate-200 shadow-sm">
      <div className="h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className={cn(
            "lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200",
            sidebarOpen && "bg-slate-100"
          )}
        >
          <ApperIcon name="Menu" className="h-6 w-6 text-slate-600" />
        </button>

        {/* Context info - will be enhanced with company/site selector later */}
        <div className="hidden lg:block">
          <div className="text-sm text-slate-600">
            <span className="font-medium">System Foundation</span>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <LanguageSelector />
          
          {/* User profile placeholder */}
          <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-sky-500 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-4 w-4 text-white" />
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-medium text-slate-900">System Admin</p>
              <p className="text-slate-500">CEO Access</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;