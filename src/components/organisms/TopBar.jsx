import React from "react";
import { useAuth } from "@/layouts/Root";
import { useSelector } from "react-redux";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/utils/cn";
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
              <UserProfile />
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
};

// Logout Button Component
const UserProfile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  if (!isAuthenticated || !user) {
    return (
      <>
        <p className="font-medium text-slate-900">System User</p>
        <p className="text-slate-500">Not Authenticated</p>
      </>
    );
  }

  const getUserName = () => {
    return user.fullNameEn_c || user.Name || user.emailAddress || 'User';
  };

  const getRoleName = () => {
    const roleCode = user.roleId_c?.code_c || user.roleCode;
    switch(roleCode) {
      case 'CEO': return 'CEO Access';
      case 'MANAGER': return 'Site Manager';
      case 'USER': return 'Employee';
      default: return 'User Access';
    }
  };

  return (
    <>
      <p className="font-medium text-slate-900">{getUserName()}</p>
      <p className="text-slate-500">{getRoleName()}</p>
    </>
  );
};

const LogoutButton = () => {
  const { logout } = useAuth();
  const { isAuthenticated } = useSelector(state => state.user);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={logout}
      className="flex items-center space-x-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors duration-200"
      title="Logout"
    >
      <ApperIcon name="LogOut" className="h-4 w-4" />
      <span className="hidden sm:block">Logout</span>
    </button>
  );
};

export default TopBar;