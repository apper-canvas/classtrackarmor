import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/hooks/useLanguage";
import { roleService } from "@/services/api/roleService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const Settings = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSystemData = async () => {
    try {
      setLoading(true);
      setError("");

      const [rolesData, permissionsData] = await Promise.all([
        roleService.getAll(),
        roleService.getAllPermissions()
      ]);

      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (err) {
      setError(err.message || "Failed to load system settings");
      toast.error("Failed to load system settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystemData();
  }, []);

  const getRoleName = (role) => {
    return role[`name${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}`] || role.nameEn;
  };

  const getRoleVariant = (roleCode) => {
    switch (roleCode) {
      case "ceo": return "ceo";
      case "manager": return "manager";
      case "user": return "user";
      default: return "default";
    }
  };

  const getScopeColor = (scope) => {
    switch (scope) {
      case "all": return "text-blue-600";
      case "site": return "text-purple-600";
      case "own": return "text-gray-600";
      default: return "text-slate-600";
    }
  };

  const getPermissionIcon = (action) => {
    switch (action) {
      case "create": return "Plus";
      case "read": return "Eye";
      case "update": return "Edit";
      case "delete": return "Trash2";
      default: return "Shield";
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <ErrorView
        title="Failed to Load Settings"
        message={error}
        onRetry={loadSystemData}
      />
    );
  }

  // Group permissions by role
  const permissionsByRole = roles.map(role => ({
    ...role,
    permissions: permissions.filter(p => p.roleId === role.Id)
  }));

  // Group permissions by resource
  const resourceGroups = permissions.reduce((groups, permission) => {
    if (!groups[permission.resource]) {
      groups[permission.resource] = [];
    }
    groups[permission.resource].push(permission);
    return groups;
  }, {});

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          {t("nav.settings")}
        </h1>
        <p className="text-slate-600">
          System foundation, roles, and permission management
        </p>
      </div>

      {/* Role Definitions */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Role Definitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card key={role.Id} gradient>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={getRoleVariant(role.code)} size="lg">
                    {getRoleName(role)}
                  </Badge>
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                    <ApperIcon 
                      name={role.code === "ceo" ? "Crown" : role.code === "manager" ? "Users" : "User"} 
                      className="h-5 w-5 text-slate-600" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">Scope Level:</span>
                    <span className={`font-semibold ${getScopeColor(role.scopeLevel)}`}>
                      {role.scopeLevel.charAt(0).toUpperCase() + role.scopeLevel.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">System Role:</span>
                    <span className="text-emerald-600 font-semibold">
                      {role.isSystemRole ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    {role.code === "ceo" && "Full system access across all companies and sites"}
                    {role.code === "manager" && "Site-level management and user oversight"}
                    {role.code === "user" && "Operational access to assigned site data"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Permission Matrix</h2>
        
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Resource</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">CEO</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Manager</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.entries(resourceGroups).map(([resource, resourcePermissions]) => 
                  ["create", "read", "update", "delete"].map((action, index) => {
                    const actionPermissions = resourcePermissions.filter(p => p.action === action);
                    
                    return (
                      <tr key={`${resource}-${action}`} className="hover:bg-slate-50 transition-colors duration-150">
                        {index === 0 && (
                          <td className="px-6 py-4 font-medium text-slate-900 capitalize" rowSpan={4}>
                            <div className="flex items-center space-x-2">
                              <ApperIcon 
                                name={resource === "companies" ? "Building2" : resource === "sites" ? "MapPin" : "Users"} 
                                className="h-4 w-4 text-slate-500" 
                              />
                              <span>{resource}</span>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex items-center space-x-2">
                            <ApperIcon name={getPermissionIcon(action)} className="h-4 w-4" />
                            <span className="capitalize">{action}</span>
                          </div>
                        </td>
                        {roles.map(role => {
                          const hasPermission = actionPermissions.some(p => p.roleId === role.Id);
                          const permission = actionPermissions.find(p => p.roleId === role.Id);
                          
                          return (
                            <td key={role.Id} className="px-6 py-4 text-center">
                              {hasPermission ? (
                                <div className="flex flex-col items-center space-y-1">
                                  <ApperIcon name="Check" className="h-5 w-5 text-emerald-500" />
                                  {permission && (
                                    <span className={`text-xs font-medium ${getScopeColor(permission.scope)}`}>
                                      {permission.scope}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <ApperIcon name="X" className="h-5 w-5 text-slate-300" />
                              )}
                            </td>
                          );
                        })}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {actionPermissions.length > 0 && (
                            <div className="space-y-1">
                              {[...new Set(actionPermissions.map(p => p.scope))].map(scope => (
                                <span key={scope} className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getScopeColor(scope)} bg-slate-100`}>
                                  {scope}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card gradient>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Database" className="h-5 w-5 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Data Hierarchy</h3>
            </div>
            
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <ApperIcon name="ArrowRight" className="h-4 w-4" />
                <span>Company → Site → User → Records</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Shield" className="h-4 w-4" />
                <span>Role-based data filtering</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Key" className="h-4 w-4" />
                <span>Permission inheritance model</span>
              </div>
            </div>
          </div>
        </Card>

        <Card gradient>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-100 to-sky-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Globe" className="h-5 w-5 text-sky-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Multilingual Support</h3>
            </div>
            
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🇲🇦</span>
                <span>Arabic (RTL) - Native support</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🇫🇷</span>
                <span>French - Business standard</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🇺🇸</span>
                <span>English - International</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;