import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "@/hooks/useTranslation";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ onClose }) => {
const location = useLocation();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const { user } = useAuth();

const navigation = [
    { 
      name: t("nav.dashboard"), 
      href: "/", 
      icon: "LayoutDashboard",
      exact: true
    },
    { 
      name: t("nav.features"), 
      href: "/features", 
      icon: "FileText" 
    },
    { 
      name: t("nav.companies"), 
      href: "/companies", 
      icon: "Building2" 
    },
    { 
      name: t("nav.sites"), 
      href: "/sites", 
      icon: "MapPin" 
    },
    { 
      name: t("nav.users"), 
      href: "/users", 
      icon: "Users" 
    },
    ...(user?.roleCode === 'ADMIN' ? [{
      name: t("nav.admin"),
      href: "/admin",
      icon: "Shield"
    }] : []),
    { 
      name: t("nav.settings"), 
      href: "/settings", 
      icon: "Settings" 
    },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(item.href);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-sky-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Shield" className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-sky-500 bg-clip-text text-transparent">
              SafetyHub
            </h1>
            <p className="text-xs text-slate-500 font-medium">Morocco</p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center space-x-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
              isRTL && "space-x-reverse",
              isActive(item) 
                ? "bg-gradient-to-r from-primary-50 to-sky-50 text-primary-700 border-l-4 border-primary-600" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              isRTL && isActive(item) && "border-l-0 border-r-4"
            )}
          >
            <ApperIcon 
              name={item.icon} 
              className={cn(
                "h-5 w-5 transition-colors duration-200",
                isActive(item) ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
              )} 
            />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-200">
        <div className="text-xs text-slate-500 text-center">
          <p className="font-medium">Hospitality Compliance Platform</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;