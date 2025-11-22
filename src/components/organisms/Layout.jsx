import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/utils/cn";
import Sidebar from "@/components/organisms/Sidebar";
import TopBar from "@/components/organisms/TopBar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isRTL } = useLanguage();

  return (
    <div className={cn("min-h-screen bg-slate-50", isRTL && "font-arabic")}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
{/* Desktop Sidebar */}
      <div className={cn("hidden lg:block fixed inset-y-0 w-64 z-30", isRTL ? "right-0" : "left-0")}>
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed inset-y-0 w-64 z-50 transform transition-transform duration-300 ease-in-out",
        isRTL ? "right-0" : "left-0",
        sidebarOpen ? "translate-x-0" : (isRTL ? "translate-x-full" : "-translate-x-full")
      )}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={cn("lg:pl-64", isRTL && "lg:pl-0 lg:pr-64")}>
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
        />
        
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;