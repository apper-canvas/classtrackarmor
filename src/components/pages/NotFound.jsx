import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ApperIcon name="FileX" className="h-12 w-12 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
          <p className="text-slate-600 mb-8">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate(-1)}
            variant="secondary"
            icon="ArrowLeft"
            className="w-full"
          >
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate("/")}
            icon="Home"
            className="w-full"
          >
            Return to Home
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;