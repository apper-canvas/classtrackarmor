import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { useAuth } from "@/context/AuthContext";

const StudentSidebar = ({ className }) => {
  const location = useLocation();
  const { currentUser } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/student", icon: "Home", exact: true },
    { name: "Assignments", href: "/student", icon: "BookOpen" },
    { name: "Grades", href: "/grades", icon: "BarChart3" },
    { name: "Profile", href: "/student", icon: "User" }
  ];

  return (
    <div className={cn("h-full bg-white border-r border-slate-200", className)}>
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">ClassTrack</h2>
            <p className="text-sm text-slate-500">Student Portal</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {currentUser?.name?.charAt(0) || "S"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{currentUser?.name || "Student"}</p>
              <p className="text-xs text-slate-500">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <ApperIcon 
                  name={item.icon} 
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-white" : "text-slate-500"
                  )} 
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default StudentSidebar;