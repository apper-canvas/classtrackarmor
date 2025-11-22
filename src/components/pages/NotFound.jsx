import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-600 to-sky-500 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertCircle" className="h-12 w-12 text-white" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-slate-900">Page Not Found</h2>
            <p className="text-slate-600 leading-relaxed">
              The page you're looking for doesn't exist in the SafetyHub system. 
              It may have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
        </div>

        {/* Navigation Options */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              icon="ArrowLeft"
              iconPosition={isRTL ? "right" : "left"}
            >
              Go Back
            </Button>
            
            <Link to="/">
              <Button 
                icon="Home"
                iconPosition={isRTL ? "right" : "left"}
              >
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-4">Quick Navigation:</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link 
                to="/companies" 
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                <ApperIcon name="Building2" className="h-4 w-4" />
                <span>Companies</span>
              </Link>
              <Link 
                to="/sites" 
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                <ApperIcon name="MapPin" className="h-4 w-4" />
                <span>Sites</span>
              </Link>
              <Link 
                to="/users" 
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                <ApperIcon name="Users" className="h-4 w-4" />
                <span>Users</span>
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                <ApperIcon name="Settings" className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;