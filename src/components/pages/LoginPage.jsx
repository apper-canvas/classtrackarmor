import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card, { CardContent } from "@/components/atoms/Card";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student"
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, formData.role);
      
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}!`);
        navigate(formData.role === "student" ? "/student" : "/teacher");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Demo credentials helper
  const setDemoCredentials = (role) => {
    if (role === "student") {
      setFormData({
        email: "john.doe@student.edu",
        password: "password123",
        role: "student"
      });
    } else {
      setFormData({
        email: "sarah.johnson@teacher.edu", 
        password: "password123",
        role: "teacher"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ApperIcon name="GraduationCap" className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">ClassTrack</h1>
          <p className="text-slate-600">Assignment Management System</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-white/50 shadow-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  I am a <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["student", "teacher"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role }))}
                      className={cn(
                        "p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200",
                        formData.role === role
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      )}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <ApperIcon 
                          name={role === "student" ? "User" : "UserCheck"} 
                          className="h-4 w-4" 
                        />
                        <span className="capitalize">{role}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Email"
                type="email"
                icon="Mail"
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="Enter your email"
                required
              />

              <Input
                label="Password"
                type="password"
                icon="Lock"
                value={formData.password}
                onChange={handleChange("password")}
                placeholder="Enter your password"
                required
              />

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                icon="LogIn"
              >
                Sign In
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center mb-3">Demo Credentials</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDemoCredentials("student")}
                  className="text-xs"
                >
                  Student Demo
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDemoCredentials("teacher")}
                  className="text-xs"
                >
                  Teacher Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;