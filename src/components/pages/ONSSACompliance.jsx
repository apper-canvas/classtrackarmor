import React, { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/hooks/useLanguage";
import { analyticsService } from "@/services/api/analyticsService";
import { exportService } from "@/services/api/exportService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Dashboard from "@/components/pages/Dashboard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ONSSACompliance = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [onssaData, setOnssaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    loadONSSAData();
  }, []);

  const loadONSSAData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getONSSACompliance();
      setOnssaData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading ONSSA data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      
      const options = {
        title: 'ONSSA Compliance Report',
        language,
        includeCharts: true
      };

      switch (format) {
        case 'pdf':
          await exportService.generatePDF(onssaData, options);
          break;
        case 'excel':
          await exportService.generateExcel(onssaData, options);
          break;
        case 'csv':
          await exportService.generateCSV(onssaData, options);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const getComplianceColor = (compliance) => {
    if (compliance >= 95) return 'text-emerald-600 bg-emerald-100';
    if (compliance >= 80) return 'text-blue-600 bg-blue-100';
    if (compliance >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'secondary';
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadONSSAData} />;
  if (!onssaData) return <ErrorView message="No ONSSA data available" />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            ONSSA Compliance Dashboard
          </h1>
          <p className="text-slate-600">
            Office National de Sécurité Sanitaire des Produits Alimentaires - Compliance Tracking
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon="Download"
            onClick={() => handleExport('pdf')}
            disabled={exportLoading}
          >
            Export PDF
          </Button>
          <Button
            variant="outline"
            icon="FileSpreadsheet"
            onClick={() => handleExport('excel')}
            disabled={exportLoading}
          >
            Export Excel
          </Button>
          <Button
            variant="outline"
            icon="FileText"
            onClick={() => handleExport('csv')}
            disabled={exportLoading}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Readiness Overview */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Overall Readiness</p>
              <p className="text-2xl font-bold text-slate-900">{onssaData?.readinessScore || 0}%</p>
              <p className="text-sm text-emerald-600">{onssaData?.trend || 'No data'} this month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ApperIcon name="FileCheck" className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Compliant Regulations</p>
              <p className="text-2xl font-bold text-slate-900">{onssaData?.regulations?.compliant || 0}/{onssaData?.regulations?.total || 0}</p>
              <p className="text-sm text-blue-600">{Math.round(((onssaData?.regulations?.compliant || 0) / (onssaData?.regulations?.total || 1)) * 100)}% compliance rate</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <ApperIcon name="AlertTriangle" className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Partial Compliance</p>
              <p className="text-2xl font-bold text-slate-900">{onssaData?.regulations?.partialCompliant || 0}</p>
              <p className="text-sm text-amber-600">Requires improvement</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Compliance by Category */}
      <Card className="p-6">
<div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Compliance by Category</h2>
          <Badge variant="secondary">{Array.isArray(onssaData?.categories) ? onssaData.categories.length : 0} categories</Badge>
        </div>
<div className="space-y-4">
          {Array.isArray(onssaData?.categories) ? onssaData.categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${getComplianceColor(category?.compliance || 0).split(' ')[1]}`}>
                  <ApperIcon 
                    name="CheckCircle" 
                    className={`h-4 w-4 ${getComplianceColor(category?.compliance || 0).split(' ')[0]}`}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{category?.name || 'Unknown Category'}</p>
                  <p className="text-sm text-slate-600">{category?.gaps || 0} gaps identified</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">{category?.compliance || 0}%</p>
                </div>
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      (category?.compliance || 0) >= 95 ? 'bg-emerald-500' :
                      (category?.compliance || 0) >= 80 ? 'bg-blue-500' :
                      (category?.compliance || 0) >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${category?.compliance || 0}%` }}
                  />
                </div>
              </div>
            </div>
          )) : null}
        </div>
      </Card>

      {/* Upcoming Inspections */}
      <Card className="p-6">
<div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Upcoming ONSSA Inspections</h2>
          <Badge variant="secondary">{Array.isArray(onssaData?.upcomingInspections) ? onssaData.upcomingInspections.length : 0} scheduled</Badge>
        </div>
<div className="space-y-4">
          {(onssaData?.upcomingInspections || []).map((inspection, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ApperIcon name="Calendar" className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{inspection?.type || 'Unknown'} Inspection</p>
                  <p className="text-sm text-slate-600">{inspection?.site || 'Unknown Site'}</p>
                  <p className="text-sm text-slate-500">Scheduled: {inspection?.date ? new Date(inspection.date).toLocaleDateString() : 'Not scheduled'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={(inspection?.status || '') === 'Scheduled' ? 'info' : 'warning'}>
                  {inspection?.status || 'Unknown'}
                </Badge>
                <Button variant="outline" size="sm">
                  Prepare
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Compliance Gaps */}
      <Card className="p-6">
<div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Priority Compliance Gaps</h2>
          <Badge variant="warning">{Array.isArray(onssaData?.complianceGaps) ? onssaData.complianceGaps.length : 0} gaps</Badge>
        </div>
        <div className="space-y-4">
{(onssaData?.complianceGaps || []).map((gap, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  (gap?.priority || '') === 'High' ? 'bg-red-100' : 
                  (gap?.priority || '') === 'Medium' ? 'bg-amber-100' : 'bg-blue-100'
                }`}>
                  <ApperIcon 
                    name="AlertTriangle" 
                    className={`h-4 w-4 ${
                      (gap?.priority || '') === 'High' ? 'text-red-600' : 
                      (gap?.priority || '') === 'Medium' ? 'text-amber-600' : 'text-blue-600'
                    }`}
                  />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{gap?.regulation || 'Unknown Regulation'}</p>
                  <p className="text-sm text-slate-600">{gap?.sites || 0} sites affected</p>
                  <p className="text-sm text-slate-500">Deadline: {gap?.deadline ? new Date(gap.deadline).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={getPriorityColor(gap?.priority || 'Low')}>
                  {gap?.priority || 'Unknown'}
                </Badge>
                <Button variant="primary" size="sm">
                  Address
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Regulation Summary */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Fully Compliant</p>
              <p className="text-2xl font-bold text-emerald-900">{onssaData?.regulations?.compliant || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <ApperIcon name="Clock" className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Partial Compliance</p>
              <p className="text-2xl font-bold text-amber-900">{onssaData?.regulations?.partialCompliant || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <ApperIcon name="XCircle" className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Non-Compliant</p>
              <p className="text-2xl font-bold text-red-900">{onssaData?.regulations?.nonCompliant || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-100 rounded-lg">
              <ApperIcon name="FileText" className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Total Regulations</p>
              <p className="text-2xl font-bold text-slate-900">{onssaData?.regulations?.total || 0}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ONSSACompliance;