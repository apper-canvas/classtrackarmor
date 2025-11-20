import React, { useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useAuth } from "@/context/AuthContext";
import StudentSidebar from "@/components/organisms/StudentSidebar";
import TeacherSidebar from "@/components/organisms/TeacherSidebar";
import Header from "@/components/organisms/Header";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center space-y-4">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-600 font-medium">Loading ClassTrack...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (except for login page)
  if (!currentUser && location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  // Don't show layout on login page
  if (location.pathname === "/") {
    return <Outlet />;
  }

  const isStudent = currentUser?.role === "student";
  const isTeacher = currentUser?.role === "teacher";

  // Redirect based on role if on wrong dashboard
  if (isStudent && location.pathname === "/teacher") {
    return <Navigate to="/student" replace />;
  }
  if (isTeacher && location.pathname === "/student") {
    return <Navigate to="/teacher" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          {isStudent && <StudentSidebar />}
          {isTeacher && <TeacherSidebar />}
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className={cn(
              "fixed top-0 left-0 w-64 h-full z-50 transform transition-transform duration-300 lg:hidden",
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
              {isStudent && <StudentSidebar />}
              {isTeacher && <TeacherSidebar />}
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            showMobileMenu={true}
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            notifications={[]}
          />
          
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-[9999]"
      />
    </div>
  );
};

export default Layout;