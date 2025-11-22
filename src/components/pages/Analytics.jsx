import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';
import { analyticsService } from '@/services/api/analyticsService';
import { exportService } from '@/services/api/exportService';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import { Button } from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const Analytics = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState('all');

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedMetrics]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getDashboardSummary({
        metrics: selectedMetrics === 'all' ? undefined : selectedMetrics
      });
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format, reportType = 'dashboard') => {
    try {
      setExportLoading(true);
      
      let data = dashboardData;
      let title = 'Dashboard Analytics';

      // Get specific data based on report type
      switch (reportType) {
        case 'haccp':
          data = await analyticsService.getHACCPPerformance();
          title = 'HACCP Performance Report';
          break;
        case 'onssa':
          data = await analyticsService.getONSSACompliance();
          title = 'ONSSA Compliance Report';
          break;
        case 'incidents':
          data = await analyticsService.getIncidentStatistics();
          title = 'Incident Statistics Report';
          break;
        case 'tasks':
          data = await analyticsService.getTaskCompletionRates();
          title = 'Task Completion Report';
          break;
      }

      const options = {
        title,
        language,
        includeCharts: true
      };

      switch (format) {
        case 'pdf':
          await exportService.generatePDF(data, options);
          break;
        case 'excel':
          await exportService.generateExcel(data, options);
          break;
        case 'csv':
          await exportService.generateCSV(data, options);
          break;
        case 'all':
          await exportService.batchExport(data, ['pdf', 'excel', 'csv'], options);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const getAlertVariant = (severity) => {
    switch (severity) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'secondary';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend.startsWith('+')) return 'TrendingUp';
    if (trend.startsWith('-')) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend.startsWith('+')) return 'text-emerald-600';
    if (trend.startsWith('-')) return 'text-red-600';
    return 'text-slate-600';
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadAnalyticsData} />;
  if (!dashboardData) return <ErrorView message="No analytics data available" />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {t("nav.analytics")} Dashboard
          </h1>
          <p className="text-slate-600">
            Comprehensive analytics and reporting for SafetyHub Morocco
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedMetrics}
            onChange={(e) => setSelectedMetrics(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Metrics</option>
            <option value="haccp">HACCP Only</option>
            <option value="onssa">ONSSA Only</option>
            <option value="incidents">Incidents Only</option>
            <option value="tasks">Tasks Only</option>
          </select>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon="Download"
              onClick={() => handleExport('pdf')}
              disabled={exportLoading}
            >
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon="FileSpreadsheet"
              onClick={() => handleExport('excel')}
              disabled={exportLoading}
            >
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon="FileText"
              onClick={() => handleExport('csv')}
              disabled={exportLoading}
            >
              CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon="Download"
              onClick={() => handleExport('all')}
              disabled={exportLoading}
            >
              {exportLoading ? 'Exporting...' : 'Export All'}
            </Button>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">HACCP Performance</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-slate-900">{dashboardData.haccp.score}%</p>
                <div className={`flex items-center space-x-1 ${getTrendColor(dashboardData.haccp.trend)}`}>
                  <ApperIcon name={getTrendIcon(dashboardData.haccp.trend)} className="h-4 w-4" />
                  <span className="text-sm font-medium">{dashboardData.haccp.trend}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">{dashboardData.haccp.violations} violations this month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ApperIcon name="Shield" className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">ONSSA Readiness</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-slate-900">{dashboardData.onssa.readiness}%</p>
                <div className={`flex items-center space-x-1 ${getTrendColor(dashboardData.onssa.trend)}`}>
                  <ApperIcon name={getTrendIcon(dashboardData.onssa.trend)} className="h-4 w-4" />
                  <span className="text-sm font-medium">{dashboardData.onssa.trend}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">{dashboardData.onssa.gaps} compliance gaps</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Incidents</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-slate-900">{dashboardData.incidents.total}</p>
                <div className={`flex items-center space-x-1 ${getTrendColor(dashboardData.incidents.trend)}`}>
                  <ApperIcon name={getTrendIcon(dashboardData.incidents.trend)} className="h-4 w-4" />
                  <span className="text-sm font-medium">{dashboardData.incidents.trend}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">{dashboardData.incidents.critical} critical incidents</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ApperIcon name="AlertTriangle" className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Task Completion</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-slate-900">{dashboardData.tasks.completion}%</p>
                <div className={`flex items-center space-x-1 ${getTrendColor(dashboardData.tasks.trend)}`}>
                  <ApperIcon name={getTrendIcon(dashboardData.tasks.trend)} className="h-4 w-4" />
                  <span className="text-sm font-medium">{dashboardData.tasks.trend}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">{dashboardData.tasks.overdue} overdue tasks</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <ApperIcon name="Clock" className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Active Alerts</h2>
          <Badge variant="secondary" size="sm">
            {dashboardData.alerts.length} alerts
          </Badge>
        </div>
        
        <div className="space-y-3">
          {dashboardData.alerts.map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  alert.severity === 'High' ? 'bg-red-100' :
                  alert.severity === 'Medium' ? 'bg-amber-100' : 'bg-blue-100'
                }`}>
                  <ApperIcon 
                    name="AlertTriangle" 
                    className={`h-4 w-4 ${
                      alert.severity === 'High' ? 'text-red-600' :
                      alert.severity === 'Medium' ? 'text-amber-600' : 'text-blue-600'
                    }`} 
                  />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{alert.type}</p>
                  <p className="text-sm text-slate-600">{alert.count} items require attention</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={getAlertVariant(alert.severity)} size="sm">
                  {alert.severity}
                </Badge>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ApperIcon name="Shield" className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">HACCP Report</h3>
              <p className="text-sm text-slate-600 mb-3">Performance & compliance analysis</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('pdf', 'haccp')}>
                  Export
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">ONSSA Compliance</h3>
              <p className="text-sm text-slate-600 mb-3">Regulatory readiness assessment</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('pdf', 'onssa')}>
                  Export
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <ApperIcon name="AlertTriangle" className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">Incident Analysis</h3>
              <p className="text-sm text-slate-600 mb-3">Safety incidents & trends</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('pdf', 'incidents')}>
                  Export
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <ApperIcon name="Clock" className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">Task Performance</h3>
              <p className="text-sm text-slate-600 mb-3">Completion rates & efficiency</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('pdf', 'tasks')}>
                  Export
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;