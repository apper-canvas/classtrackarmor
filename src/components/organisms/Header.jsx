import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import NotificationBell from "@/components/molecules/NotificationBell";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar";

const Header = ({ 
  title, 
  subtitle, 
  notifications = [], 
  onMarkAsRead, 
  onMarkAllAsRead,
  className,
  showMobileMenu = false,
  onMobileMenuToggle
}) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={cn(
      "bg-white border-b border-slate-200 px-6 py-4",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          {showMobileMenu && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              icon="Menu"
              className="lg:hidden"
            />
          )}
          
          <div>
            {title && (
              <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            )}
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationBell
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
          />

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {currentUser?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-900">
                {currentUser?.name || "User"}
              </p>
              <p className="text-xs text-slate-500 capitalize">
                {currentUser?.role || "User"}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              icon="LogOut"
              className="text-slate-600 hover:text-slate-900"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;