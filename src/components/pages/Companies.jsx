import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/hooks/useLanguage";
import { companyService } from "@/services/api/companyService";
import { siteService } from "@/services/api/siteService";
import { userService } from "@/services/api/userService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Companies = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [companies, setCompanies] = useState([]);
  const [companiesWithStats, setCompaniesWithStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const [companiesData, sitesData, usersData] = await Promise.all([
        companyService.getAll(),
        siteService.getAll(),
        userService.getAll()
      ]);

      setCompanies(companiesData);

      // Calculate stats for each company
      const companiesWithStatsData = companiesData.map(company => {
        const companySites = sitesData.filter(site => site.companyId === company.Id);
        const companyUsers = usersData.filter(user => 
          companySites.some(site => site.Id === user.siteId)
        );

        return {
          ...company,
          siteCount: companySites.length,
          userCount: companyUsers.length,
          activeSites: companySites.filter(site => site.status === "active").length
        };
      });

      setCompaniesWithStats(companiesWithStatsData);
    } catch (err) {
      setError(err.message || "Failed to load companies");
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const getCompanyName = (company) => {
    return company[`name${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}`] || company.nameEn;
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <ErrorView
        title="Failed to Load Companies"
        message={error}
        onRetry={loadCompanies}
      />
    );
  }

  if (companiesWithStats.length === 0) {
    return (
      <Empty
        icon="Building2"
        title="No Companies Yet"
        message={t("empty.companies")}
        actionLabel={t("actions.create") + " Company"}
        onAction={() => toast.info("Create company functionality will be added in future updates")}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {t("nav.companies")}
          </h1>
          <p className="text-slate-600">
            Manage hospitality companies and their organizational structure
          </p>
        </div>
        
        <Button 
          icon="Plus" 
          onClick={() => toast.info("Create company functionality will be added in future updates")}
        >
          {t("actions.create")} Company
        </Button>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companiesWithStats.map((company) => (
          <Card 
            key={company.Id} 
            className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
            gradient
          >
            <div className="space-y-4">
              {/* Company Header */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-sky-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building2" className="h-6 w-6 text-white" />
                </div>
                <Badge variant={company.status === "active" ? "success" : "danger"}>
                  {t(`status.${company.status}`)}
                </Badge>
              </div>

              {/* Company Name */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {getCompanyName(company)}
                </h3>
                <div className="flex items-center text-sm text-slate-500">
                  <ApperIcon name="Globe" className="h-4 w-4 mr-1" />
                  Primary: {company.primaryLanguage.toUpperCase()}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">{company.siteCount}</p>
                  <p className="text-xs text-slate-500 font-medium">{t("common.sites")}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-sky-600">{company.userCount}</p>
                  <p className="text-xs text-slate-500 font-medium">{t("common.users")}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <Link 
                  to={`/companies/${company.Id}`}
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
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Company Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-primary-600">{companiesWithStats.length}</p>
            <p className="text-sm text-slate-500 font-medium">Total Companies</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-sky-600">
              {companiesWithStats.reduce((sum, company) => sum + company.siteCount, 0)}
            </p>
            <p className="text-sm text-slate-500 font-medium">Total Sites</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-600">
              {companiesWithStats.reduce((sum, company) => sum + company.activeSites, 0)}
            </p>
            <p className="text-sm text-slate-500 font-medium">Active Sites</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-600">
              {companiesWithStats.reduce((sum, company) => sum + company.userCount, 0)}
            </p>
            <p className="text-sm text-slate-500 font-medium">Total Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;