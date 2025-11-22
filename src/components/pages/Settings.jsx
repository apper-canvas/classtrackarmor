import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/hooks/useLanguage";
import { roleService } from "@/services/api/roleService";
import { featureAreaService } from "@/services/api/featureAreaService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Settings = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [featureAreas, setFeatureAreas] = useState([]);
  const [activeTab, setActiveTab] = useState('roles');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadSystemData = async () => {
    try {
      setLoading(true);
      setError("");

      const [rolesData, permissionsData, featureAreasData] = await Promise.all([
        roleService.getAll(),
        roleService.getAllPermissions(),
        featureAreaService.getAll()
      ]);

      setRoles(rolesData);
      setPermissions(permissionsData);
      setFeatureAreas(featureAreasData);
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
return role[`name${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}_c`] || role.nameEn_c;
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
    Id: role.Id_c,
    permissions: permissions.filter(p => p.roleId === role.Id_c)
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
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {t("nav.settings")}
          </h1>
          <p className="text-slate-600">
            System foundation, roles, and permission management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={activeTab === 'roles' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('roles')}
          >
            Roles & Permissions
          </Button>
          <Button 
            variant={activeTab === 'features' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('features')}
          >
            Feature Areas
          </Button>
        </div>
      </div>

      {activeTab === 'roles' && (
        <>

      {/* Role Definitions */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Role Definitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{roles.map((role) => (
            <Card key={role.Id_c} gradient>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
<Badge variant={getRoleVariant(role.code_c)} size="lg">
                    {getRoleName(role)}
                  </Badge>
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
<ApperIcon 
                      name={role.code_c === "ceo" ? "Crown" : role.code_c === "manager" ? "Users" : "User"} 
                      className="h-5 w-5 text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
<span className="text-slate-600 font-medium">Scope Level:</span>
                    <span className={`font-semibold ${getScopeColor(role.scopeLevel_c)}`}>
                      {role.scopeLevel_c?.charAt(0).toUpperCase() + role.scopeLevel_c?.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">System Role:</span>
<span className="text-emerald-600 font-semibold">
                      {role.isSystemRole_c ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
<p className="text-sm text-slate-600">
                    {role.code_c === "ceo" && "Full system access across all companies and sites"}
                    {role.code_c === "manager" && "Site-level management and user oversight"}
                    {role.code_c === "user" && "Operational access to assigned site data"}
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
const hasPermission = actionPermissions.some(p => p.roleId === role.Id_c);
                          const permission = actionPermissions.find(p => p.roleId === role.Id_c);
                          
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
        </>
      )}

      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Feature Areas Overview</h2>
            <Badge variant="primary">{featureAreas.length} Areas Configured</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureAreas.map((area) => (
              <Card key={area.Id} gradient>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">{area.Name || "Unnamed Area"}</h3>
                    <Badge variant="success" size="sm">Active</Badge>
                  </div>
                  
                  {area.feature_area_c && (
                    <Badge variant="outline" size="sm">
                      {area.feature_area_c}
                    </Badge>
                  )}

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="FileText" className="h-4 w-4" />
                      <span>Compliance Objectives</span>
                      <span className="ml-auto">
                        {area.compliance_objectives_c ? '✓' : '—'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Scale" className="h-4 w-4" />
                      <span>Moroccan Laws</span>
                      <span className="ml-auto">
                        {area.relevant_moroccan_laws_c ? '✓' : '—'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="ClipboardCheck" className="h-4 w-4" />
                      <span>Obligatory Records</span>
                      <span className="ml-auto">
                        {area.obligatory_records_c ? '✓' : '—'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Search" className="h-4 w-4" />
                      <span>Inspection Needs</span>
                      <span className="ml-auto">
                        {area.inspection_needs_c ? '✓' : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {featureAreas.length === 0 && (
            <div className="text-center py-12">
              <ApperIcon name="FileText" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No Feature Areas Configured</h3>
              <p className="text-slate-600 mb-6">Feature areas define compliance requirements for different aspects of your operations.</p>
              <Button variant="primary" icon="Plus">
                Configure Feature Areas
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Foundation Architecture */}
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