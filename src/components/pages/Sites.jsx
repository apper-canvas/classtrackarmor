import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/hooks/useLanguage";
import { siteService } from "@/services/api/siteService";
import { companyService } from "@/services/api/companyService";
import { userService } from "@/services/api/userService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Sites = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [sitesWithDetails, setSitesWithDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSites = async () => {
    try {
      setLoading(true);
      setError("");

      const [sitesData, companiesData, usersData] = await Promise.all([
        siteService.getAll(),
        companyService.getAll(),
        userService.getAll()
      ]);

// Combine sites with company and user data
      const sitesWithDetailsData = sitesData.map(site => {
        const company = companiesData.find(c => c.Id_c === (site.companyId_c?.Id || site.companyId_c));
        const siteUsers = usersData.filter(user => (user.siteId_c?.Id || user.siteId_c) === site.Id_c);
        const manager = usersData.find(user => user.Id_c === (site.managerId_c?.Id || site.managerId_c));

        return {
          ...site,
          Id: site.Id_c,
          company,
          userCount: siteUsers.length,
          manager,
          activeUsers: siteUsers.filter(user => user.status_c === "active").length
        };
      });

      setSitesWithDetails(sitesWithDetailsData);
    } catch (err) {
      setError(err.message || "Failed to load sites");
      toast.error("Failed to load sites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

const getSiteName = (site) => {
    return site[`name${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}_c`] || site.nameEn_c;
  };

const getCompanyName = (company) => {
    if (!company) return "Unknown Company";
    return company[`name${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}_c`] || company.nameEn_c;
  };

  const getManagerName = (manager) => {
if (!manager) return "No Manager";
    return manager[`fullName${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}_c`] || manager.fullNameEn_c;
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <ErrorView
        title="Failed to Load Sites"
        message={error}
        onRetry={loadSites}
      />
    );
  }

  if (sitesWithDetails.length === 0) {
    return (
      <Empty
        icon="MapPin"
        title="No Sites Yet"
message="No sites found. Start by adding your first site to manage users and operations."
        actionLabel="Create Site"
        onAction={() => toast.info("Create site functionality will be added in future updates")}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
Sites
          </h1>
          <p className="text-slate-600">
            Manage individual hospitality locations and their operations
          </p>
        </div>
        
        <Button 
          icon="Plus" 
          onClick={() => toast.info("Create site functionality will be added in future updates")}
>
          Create Site
        </Button>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sitesWithDetails.map((site) => (
          <Card 
            key={site.Id} 
            className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
            gradient
          >
            <div className="space-y-4">
              {/* Site Header */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-600 to-primary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="MapPin" className="h-6 w-6 text-white" />
                </div>
<Badge variant={site.status_c === "active" ? "success" : "danger"}>
                  {site.status_c === "active" ? "Active" : site.status_c === "inactive" ? "Inactive" : site.status_c}
                </Badge>
              </div>

              {/* Site Name & Company */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {getSiteName(site)}
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-slate-500">
                    <ApperIcon name="Building2" className="h-4 w-4 mr-1" />
                    {getCompanyName(site.company)}
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
<ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
                    {site.city_c}
                  </div>
                </div>
              </div>

              {/* Manager Info */}
              <div className="p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="h-3 w-3 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Manager</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {getManagerName(site.manager)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-sky-600">{site.userCount}</p>
<p className="text-xs text-slate-500 font-medium">Users</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{site.activeUsers}</p>
                  <p className="text-xs text-slate-500 font-medium">Active</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <Link 
                  to={`/sites/${site.Id}`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                >
                  View Details →
                </Link>
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-1 hover:bg-slate-100 rounded transition-colors duration-200"
                    onClick={() => toast.info("Edit functionality will be added in future updates")}
                  >
                    <ApperIcon name="Edit" className="h-4 w-4 text-slate-400" />
                  </button>
                  <button 
                    className="p-1 hover:bg-red-50 rounded transition-colors duration-200"
                    onClick={() => toast.warning("Delete functionality will be added in future updates")}
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Site Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-sky-600">{sitesWithDetails.length}</p>
            <p className="text-sm text-slate-500 font-medium">Total Sites</p>
          </div>
          <div>
<p className="text-3xl font-bold text-emerald-600">
              {sitesWithDetails.filter(site => site.status_c === "active").length}
            </p>
            <p className="text-sm text-slate-500 font-medium">Active Sites</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-600">
              {sitesWithDetails.reduce((sum, site) => sum + site.userCount, 0)}
            </p>
            <p className="text-sm text-slate-500 font-medium">Total Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">
              {new Set(sitesWithDetails.map(site => site.city)).size}
            </p>
            <p className="text-sm text-slate-500 font-medium">Cities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sites;