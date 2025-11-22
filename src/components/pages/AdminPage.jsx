import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { ApperIcon } from '@/components/ApperIcon';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';

const AdminPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user || user.roleCode !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <ApperIcon name="Shield" className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-600">You don't have permission to access this page.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">System administration and management</p>
        </div>
        <ApperIcon name="Shield" className="h-8 w-8 text-primary-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">User Management</h3>
            <ApperIcon name="Users" className="h-6 w-6 text-primary-600" />
          </div>
          <p className="text-slate-600 mb-4">Manage user accounts, roles, and permissions</p>
          <Button variant="outline" className="w-full">
            <ApperIcon name="Settings" className="h-4 w-4 mr-2" />
            Manage Users
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">System Settings</h3>
            <ApperIcon name="Cog" className="h-6 w-6 text-primary-600" />
          </div>
          <p className="text-slate-600 mb-4">Configure system-wide settings and preferences</p>
          <Button variant="outline" className="w-full">
            <ApperIcon name="Settings" className="h-4 w-4 mr-2" />
            System Config
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Security</h3>
            <ApperIcon name="Lock" className="h-6 w-6 text-primary-600" />
          </div>
          <p className="text-slate-600 mb-4">Monitor security logs and access controls</p>
          <Button variant="outline" className="w-full">
            <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
            Security Logs
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Analytics</h3>
            <ApperIcon name="BarChart3" className="h-6 w-6 text-primary-600" />
          </div>
          <p className="text-slate-600 mb-4">View system analytics and usage reports</p>
          <Button variant="outline" className="w-full">
            <ApperIcon name="TrendingUp" className="h-4 w-4 mr-2" />
            View Reports
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Backup & Recovery</h3>
            <ApperIcon name="Database" className="h-6 w-6 text-primary-600" />
          </div>
          <p className="text-slate-600 mb-4">Manage system backups and data recovery</p>
          <Button variant="outline" className="w-full">
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Manage Backups
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Maintenance</h3>
            <ApperIcon name="Wrench" className="h-6 w-6 text-primary-600" />
          </div>
          <p className="text-slate-600 mb-4">System maintenance and health monitoring</p>
          <Button variant="outline" className="w-full">
            <ApperIcon name="Activity" className="h-4 w-4 mr-2" />
            System Health
          </Button>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Admin Activities</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <ApperIcon name="UserPlus" className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-800">New user registered</p>
                <p className="text-xs text-slate-600">john.doe@example.com</p>
              </div>
            </div>
            <span className="text-xs text-slate-500">2 hours ago</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Settings" className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-slate-800">System settings updated</p>
                <p className="text-xs text-slate-600">Email configuration modified</p>
              </div>
            </div>
            <span className="text-xs text-slate-500">4 hours ago</span>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Shield" className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-slate-800">Security policy updated</p>
                <p className="text-xs text-slate-600">Password requirements strengthened</p>
              </div>
            </div>
            <span className="text-xs text-slate-500">1 day ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminPage;