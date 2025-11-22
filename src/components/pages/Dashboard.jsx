import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { companyService } from "@/services/api/companyService";
import { siteService } from "@/services/api/siteService";
import { userService } from "@/services/api/userService";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalSites: 0,
    totalUsers: 0,
    pendingInvitations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [companies, sites, users] = await Promise.all([
        companyService.getAll(),
        siteService.getAll(),
        userService.getAll()
      ]);

      const pendingInvitations = users.filter(user => user.status === "invited").length;

      setStats({
        totalCompanies: companies.length,
        totalSites: sites.length,
        totalUsers: users.length,
        pendingInvitations
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <ErrorView
        title="Dashboard Error"
        message={error}
        onRetry={loadDashboardData}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          {t("dashboard.overview")}
        </h1>
        <p className="text-slate-600 text-lg">
          Welcome to SafetyHub Morocco - Your hospitality compliance foundation
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("dashboard.total_companies")}
          value={stats.totalCompanies}
          icon="Building2"
          trend="up"
          trendValue="+2 this month"
        />
        <StatCard
          title={t("dashboard.total_sites")}
          value={stats.totalSites}
          icon="MapPin"
          trend="up"
          trendValue="+1 this week"
        />
        <StatCard
          title={t("dashboard.total_users")}
          value={stats.totalUsers}
          icon="Users"
          trend="up"
          trendValue="+3 this week"
        />
        <StatCard
          title={t("dashboard.pending_invitations")}
          value={stats.pendingInvitations}
          icon="UserPlus"
          trend="down"
          trendValue="-1 today"
        />
      </div>

      {/* System Foundation Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-sky-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1" />
              </svg>
            </div>
            Organizational Hierarchy
          </h2>
          <div className="space-y-4">
            <div className="tree-line">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="font-medium text-slate-800">Company Level</span>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Top-level organizations with multiple locations and full administrative control
              </p>
              
              <div className="tree-line">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                  <span className="font-medium text-slate-800">Site Level</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Individual locations with dedicated managers and site-specific operations
                </p>
                
                <div className="tree-line">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <span className="font-medium text-slate-800">User Level</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Operational staff assigned to specific sites with role-based permissions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center mr-3">
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Access Control System
          </h2>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <span className="font-medium text-blue-800">CEO Role</span>
                  <p className="text-sm text-blue-600">Full system access</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Company Scope</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <span className="font-medium text-purple-800">Manager Role</span>
                  <p className="text-sm text-purple-600">Site management</p>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">Site Scope</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-800">User Role</span>
                  <p className="text-sm text-gray-600">Operational access</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">Personal Scope</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multilingual Support Info */}
      <div className="bg-gradient-to-br from-primary-50 to-sky-50 rounded-xl p-8 border border-primary-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mr-3">
            <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          Multilingual Foundation
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="text-2xl mb-2">🇲🇦</div>
            <h3 className="font-semibold text-slate-800">العربية</h3>
            <p className="text-sm text-slate-600 mt-1">Native RTL support</p>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl mb-2">🇫🇷</div>
            <h3 className="font-semibold text-slate-800">Français</h3>
            <p className="text-sm text-slate-600 mt-1">Business language</p>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl mb-2">🇺🇸</div>
            <h3 className="font-semibold text-slate-800">English</h3>
            <p className="text-sm text-slate-600 mt-1">International standard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;