import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/hooks/useLanguage";
import { userService } from "@/services/api/userService";
import { siteService } from "@/services/api/siteService";
import { companyService } from "@/services/api/companyService";
import { roleService } from "@/services/api/roleService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow } from "date-fns";

const Users = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [usersWithDetails, setUsersWithDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersData, sitesData, companiesData, rolesData] = await Promise.all([
        userService.getAll(),
        siteService.getAll(),
        companyService.getAll(),
        roleService.getAll()
      ]);

      // Combine users with site, company, and role data
      const usersWithDetailsData = usersData.map(user => {
        const site = sitesData.find(s => s.Id === user.siteId);
        const company = site ? companiesData.find(c => c.Id === site.companyId) : null;
        const role = rolesData.find(r => r.Id === user.roleId);

        return {
          ...user,
          site,
          company,
          role
        };
      });

      setUsersWithDetails(usersWithDetailsData);
    } catch (err) {
      setError(err.message || "Failed to load users");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getUserName = (user) => {
    return user[`fullName${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}`] || user.fullNameEn;
  };

  const getSiteName = (site) => {
    if (!site) return "No Site";
    return site[`name${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}`] || site.nameEn;
  };

  const getCompanyName = (company) => {
    if (!company) return "Unknown Company";
    return company[`name${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}`] || company.nameEn;
  };

  const getRoleName = (role) => {
    if (!role) return "No Role";
    return role[`name${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}`] || role.nameEn;
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "active": return "success";
      case "invited": return "warning";
      case "suspended": return "danger";
      default: return "default";
    }
  };

  const getRoleVariant = (roleCode) => {
    switch (roleCode) {
      case "ceo": return "ceo";
      case "manager": return "manager";
      case "user": return "user";
      default: return "default";
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <ErrorView
        title="Failed to Load Users"
        message={error}
        onRetry={loadUsers}
      />
    );
  }

  if (usersWithDetails.length === 0) {
    return (
      <Empty
        icon="Users"
        title="No Users Yet"
        message={t("empty.users")}
        actionLabel={t("actions.invite")}
        onAction={() => toast.info("Invite user functionality will be added in future updates")}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {t("nav.users")}
          </h1>
          <p className="text-slate-600">
            Manage user accounts, roles, and site assignments
          </p>
        </div>
        
        <Button 
          icon="UserPlus" 
          onClick={() => toast.info("Invite user functionality will be added in future updates")}
        >
          {t("actions.invite")}
        </Button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usersWithDetails.map((user) => (
          <Card 
            key={user.Id} 
            className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
            gradient
          >
            <div className="space-y-4">
              {/* User Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {getUserName(user)}
                    </h3>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(user.status)}>
                  {t(`status.${user.status}`)}
                </Badge>
              </div>

              {/* Role Badge */}
              <div className="flex justify-center">
                <Badge variant={getRoleVariant(user.role?.code)} size="md">
                  {getRoleName(user.role)}
                </Badge>
              </div>

              {/* Organization Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-slate-600">
                  <ApperIcon name="Building2" className="h-4 w-4 mr-2" />
                  <span className="font-medium">Company:</span>
                  <span className="ml-1">{getCompanyName(user.company)}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <ApperIcon name="MapPin" className="h-4 w-4 mr-2" />
                  <span className="font-medium">Site:</span>
                  <span className="ml-1">{getSiteName(user.site)}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <ApperIcon name="Globe" className="h-4 w-4 mr-2" />
                  <span className="font-medium">Language:</span>
                  <span className="ml-1">{user.preferredLanguage.toUpperCase()}</span>
                </div>
              </div>

              {/* Last Login */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center text-sm text-slate-500">
                  <ApperIcon name="Clock" className="h-4 w-4 mr-2" />
                  {user.lastLoginAt ? (
                    <span>Last login {formatDistanceToNow(new Date(user.lastLoginAt))} ago</span>
                  ) : (
                    <span>Never logged in</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button 
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                  onClick={() => toast.info("User details functionality will be added in future updates")}
                >
                  View Profile →
                </button>
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-1 hover:bg-slate-100 rounded transition-colors duration-200"
                    onClick={() => toast.info("Edit user functionality will be added in future updates")}
                  >
                    <ApperIcon name="Edit" className="h-4 w-4 text-slate-400" />
                  </button>
                  <button 
                    className="p-1 hover:bg-red-50 rounded transition-colors duration-200"
                    onClick={() => toast.warning("Delete user functionality will be added in future updates")}
                  >
                    <ApperIcon name="UserMinus" className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">User Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-slate-600">{usersWithDetails.length}</p>
            <p className="text-sm text-slate-500 font-medium">Total Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-600">
              {usersWithDetails.filter(user => user.status === "active").length}
            </p>
            <p className="text-sm text-slate-500 font-medium">Active Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-600">
              {usersWithDetails.filter(user => user.status === "invited").length}
            </p>
            <p className="text-sm text-slate-500 font-medium">Pending Invites</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">
              {usersWithDetails.filter(user => user.role?.code === "ceo").length}
            </p>
            <p className="text-sm text-slate-500 font-medium">CEOs</p>
          </div>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Role Distribution</h2>
        <div className="space-y-4">
          {["ceo", "manager", "user"].map(roleCode => {
            const roleUsers = usersWithDetails.filter(user => user.role?.code === roleCode);
            const percentage = usersWithDetails.length > 0 ? (roleUsers.length / usersWithDetails.length) * 100 : 0;
            
            return (
              <div key={roleCode} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getRoleVariant(roleCode)} size="sm">
                      {t(`roles.${roleCode}.name`)}
                    </Badge>
                    <span className="text-sm text-slate-600">{roleUsers.length} users</span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      roleCode === "ceo" ? "bg-gradient-to-r from-blue-500 to-blue-600" :
                      roleCode === "manager" ? "bg-gradient-to-r from-purple-500 to-purple-600" :
                      "bg-gradient-to-r from-slate-400 to-slate-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Users;