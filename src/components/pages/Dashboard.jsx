import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAll as getAllSites } from "@/services/api/siteService";
import { getAll as getAllUsers } from "@/services/api/userService";
import { getAllAudits } from "@/services/api/auditService";
import { getAll as getAllCompanies } from "@/services/api/companyService";
import { getAll as getAllRegulatory } from "@/services/api/regulatoryAlignmentService";
import { getAllTasks } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Audits from "@/components/pages/Audits";

const Dashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [dashboardData, setDashboardData] = useState({
    audits: [],
    users: [],
    sites: [],
    tasks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

const [auditsData, usersData, sitesData, tasksData] = await Promise.all([
        getAllAudits(),
        getAllUsers(),
        getAllSites(),
        getAllTasks()
      ]);

setDashboardData({
        audits: auditsData || [],
        users: usersData || [],
        sites: sitesData || [],
        tasks: tasksData || []
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

const getFilteredData = () => {
    if (!user) return dashboardData;

    // Get user role code from the user object
    const userRoleCode = user.roleId_c?.code_c || user.roleCode;
    const userSiteId = user.siteId_c?.Id || user.siteId_c;

    // CEO sees everything
    if (userRoleCode === 'CEO') {
      return dashboardData;
    }

    // Site Manager sees only their site data
    if (userRoleCode === 'MANAGER' && userSiteId) {
      return {
        audits: dashboardData.audits.filter(audit => 
          audit.site_id_c?.Id === userSiteId || audit.site_id_c === userSiteId
        ),
        users: dashboardData.users.filter(u => 
          u.siteId_c?.Id === userSiteId || u.siteId_c === userSiteId
        ),
        sites: dashboardData.sites.filter(site => 
          site.Id === userSiteId
        ),
tasks: dashboardData.tasks.filter(task => 
          task.site_id_c?.Id === userSiteId || task.site_id_c === userSiteId
        )
      };
    }

    // Regular users see only their assigned data
    return {
      audits: dashboardData.audits.filter(audit => 
        audit.auditor_id_c?.Id === user.Id || audit.auditor_id_c === user.Id
      ),
      users: [user], // Only see themselves
      sites: userSiteId ? dashboardData.sites.filter(site => site.Id === userSiteId) : [],
tasks: dashboardData.tasks.filter(task => 
        task.assigned_to_c?.Id === user.Id || task.assigned_to_c === user.Id
      )
    };
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView
        title="Dashboard Error"
        message={`Failed to load dashboard data: ${error}`}
        onRetry={loadDashboardData}
      />
    );
  }

  const filteredData = getFilteredData();
  const { audits, users, sites, tasks } = filteredData;

  // Calculate statistics
  const stats = {
totalAudits: audits?.length || 0,
    completedAudits: audits?.filter(audit => audit.status_c === 'completed' || audit.status_c === 'Completed').length || 0,
    pendingTasks: tasks?.filter(task => task.status_c === 'Pending' || task.status_c === 'pending').length || 0,
    totalUsers: users?.length || 0,
activeSites: sites?.filter(site => site.status_c === 'active' || site.status_c === 'Active').length || 0,
    criticalTasks: tasks?.filter(task => task.priority_c === 'Critical' || task.priority_c === 'critical').length || 0
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-slate-600 mt-1">
              {user?.role_id_c?.Name || 'User'} • {user?.site_id_c?.Name || 'No Site Assigned'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Total Audits"
          value={stats.totalAudits}
          icon={<ApperIcon name="ClipboardCheck" className="w-6 h-6" />}
          trend={stats.completedAudits > 0 ? 'up' : 'neutral'}
          description={`${stats.completedAudits} completed`}
          className="bg-blue-50 border-blue-200"
        />
        
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={<ApperIcon name="Clock" className="w-6 h-6" />}
          trend={stats.criticalTasks > 0 ? 'down' : 'up'}
          description={`${stats.criticalTasks} critical`}
          className="bg-amber-50 border-amber-200"
        />

        {(user?.role_id_c?.Name === 'CEO' || user?.role_id_c?.Name === 'Site Manager') && (
          <>
            <StatCard
              title="Active Sites"
              value={stats.activeSites}
              icon={<ApperIcon name="Building" className="w-6 h-6" />}
              trend="up"
              description="Operational sites"
              className="bg-emerald-50 border-emerald-200"
            />

            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<ApperIcon name="Users" className="w-6 h-6" />}
              trend="up"
              description="System users"
              className="bg-purple-50 border-purple-200"
            />
          </>
        )}

        <StatCard
          title="Audit Score"
          value={audits.length > 0 ? Math.round(audits.reduce((acc, audit) => acc + (audit.score_c || 0), 0) / audits.length) : 0}
          suffix="%"
          icon={<ApperIcon name="TrendingUp" className="w-6 h-6" />}
          trend="up"
          description="Average score"
          className="bg-green-50 border-green-200"
        />

        <StatCard
          title="Compliance"
          value="98"
          suffix="%"
          icon={<ApperIcon name="Shield" className="w-6 h-6" />}
          trend="up"
          description="Overall compliance"
          className="bg-indigo-50 border-indigo-200"
        />
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Tasks</h2>
            <ApperIcon name="MoreHorizontal" className="w-5 h-5 text-slate-400" />
          </div>
          
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.Id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{task.name_c}</p>
                  <p className="text-sm text-slate-500">{task.site_id_c?.Name || 'No site'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.priority_c === 'Critical' ? 'bg-red-100 text-red-800' :
                    task.priority_c === 'High' ? 'bg-orange-100 text-orange-800' :
                    task.priority_c === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority_c || 'Low'}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.status_c === 'Completed' ? 'bg-green-100 text-green-800' :
                    task.status_c === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status_c || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
            
            {tasks.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <ApperIcon name="CheckCircle" className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No tasks assigned</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Audits */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Audits</h2>
            <ApperIcon name="MoreHorizontal" className="w-5 h-5 text-slate-400" />
          </div>
          
          <div className="space-y-3">
            {audits.slice(0, 5).map((audit) => (
              <div key={audit.Id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{audit.audit_title_c}</p>
                  <p className="text-sm text-slate-500">{audit.audit_type_c} • {audit.site_id_c?.Name || 'No site'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {audit.score_c && (
                    <span className="text-sm font-medium text-slate-600">
                      {audit.score_c}%
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    audit.status_c === 'Completed' ? 'bg-green-100 text-green-800' :
                    audit.status_c === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {audit.status_c || 'Draft'}
                  </span>
                </div>
              </div>
            ))}
            
            {audits.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <ApperIcon name="FileText" className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No recent audits</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;