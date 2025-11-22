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
<div className="text-center">
              <div className="mb-6">
                <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <ApperIcon name="FileX" size={48} className="text-slate-400" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Page Not Found</h2>
                <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
                  The page you're looking for doesn't exist in the SafetyHub system. 
                  It may have been moved, deleted, or you entered the wrong URL.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <ApperIcon name="Home" size={16} />
                  Go to Dashboard
                </button>
                
                <button 
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <ApperIcon name="ArrowLeft" size={16} />
                  Go Back
                </button>
                
                <button 
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <ApperIcon name="LogIn" size={16} />
                  Login
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-500 mb-3">Need help? Try these popular sections:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button 
                    onClick={() => navigate('/analytics')}
                    className="text-sm text-slate-600 hover:text-primary-600 px-3 py-1 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    Analytics
                  </button>
                  <button 
                    onClick={() => navigate('/audits')}
                    className="text-sm text-slate-600 hover:text-primary-600 px-3 py-1 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    Audits
                  </button>
                  <button 
                    onClick={() => navigate('/workflows')}
                    className="text-sm text-slate-600 hover:text-primary-600 px-3 py-1 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    Workflows
                  </button>
                  <button 
                    onClick={() => navigate('/companies')}
                    className="text-sm text-slate-600 hover:text-primary-600 px-3 py-1 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    Companies
                  </button>
                </div>
              </div>
            </div>
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