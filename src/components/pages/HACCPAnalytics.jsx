import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';
import { analyticsService } from '@/services/api/analyticsService';
import { exportService } from '@/services/api/exportService';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const HACCPAnalytics = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [haccpData, setHaccpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    loadHACCPData();
  }, []);

  const loadHACCPData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getHACCPPerformance();
      setHaccpData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading HACCP data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      
      const options = {
        title: 'HACCP Performance Analysis',
        language,
        includeCharts: true
      };

      switch (format) {
        case 'pdf':
          await exportService.generatePDF(haccpData, options);
          break;
        case 'excel':
          await exportService.generateExcel(haccpData, options);
          break;
        case 'csv':
          await exportService.generateCSV(haccpData, options);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const getViolationSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-amber-600 bg-amber-100';
      case 'Low': return 'text-blue-600 bg-blue-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadHACCPData} />;
  if (!haccpData) return <ErrorView message="No HACCP data available" />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            HACCP Performance Analytics
          </h1>
          <p className="text-slate-600">
            Hazard Analysis and Critical Control Points monitoring and compliance analysis
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

      {/* Overall Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ApperIcon name="Shield" className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Overall HACCP Score</p>
              <p className="text-2xl font-bold text-slate-900">{haccpData.overallScore}%</p>
              <p className="text-sm text-emerald-600">{haccpData.trend} this month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Compliance Rate</p>
              <p className="text-2xl font-bold text-slate-900">{haccpData.criticalControlPoints.complianceRate}%</p>
              <p className="text-sm text-slate-600">{haccpData.criticalControlPoints.compliant}/{haccpData.criticalControlPoints.monitored} CCPs</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <ApperIcon name="AlertTriangle" className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Active Violations</p>
              <p className="text-2xl font-bold text-slate-900">{haccpData.criticalControlPoints.violations}</p>
              <p className="text-sm text-red-600">Requires immediate attention</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Violations Analysis */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Violations by Category</h2>
<Badge variant="secondary">{haccpData.violations?.length || 0} categories</Badge>
        </div>

        <div className="space-y-4">
{(haccpData.violations || []).map((violation, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${getViolationSeverityColor(violation.severity).split(' ')[1]}`}>
                  <ApperIcon 
                    name="AlertCircle" 
                    className={`h-4 w-4 ${getViolationSeverityColor(violation.severity).split(' ')[0]}`}
                  />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{violation.type}</p>
                  <p className="text-sm text-slate-600">{violation.count} violations recorded</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={violation.severity === 'High' ? 'danger' : violation.severity === 'Medium' ? 'warning' : 'info'}>
                  {violation.severity}
                </Badge>
                <div className={`flex items-center space-x-1 ${
                  violation.trend > 0 ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  <ApperIcon 
                    name={violation.trend > 0 ? 'TrendingUp' : 'TrendingDown'} 
                    className="h-4 w-4" 
                  />
                  <span className="text-sm font-medium">
                    {violation.trend > 0 ? '+' : ''}{violation.trend}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Trends */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Monthly Performance Trends</h2>
        
        <div className="space-y-6">
          {haccpData.monthlyTrends.map((month, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-16 text-center">
                  <p className="font-medium text-slate-900">{month.month}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-slate-600">Score</p>
                      <p className="text-lg font-bold text-slate-900">{month.score}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Violations</p>
                      <p className="text-lg font-bold text-red-600">{month.violations}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${month.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Corrective Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Corrective Actions Status</h2>
          <Badge variant="secondary">
            {haccpData.correctiveActions.open + haccpData.correctiveActions.inProgress + haccpData.correctiveActions.completed} total
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <ApperIcon name="Clock" className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">Open</p>
                <p className="text-xl font-bold text-amber-900">{haccpData.correctiveActions.open}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ApperIcon name="Activity" className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">In Progress</p>
                <p className="text-xl font-bold text-blue-900">{haccpData.correctiveActions.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ApperIcon name="CheckCircle" className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800">Completed</p>
                <p className="text-xl font-bold text-emerald-900">{haccpData.correctiveActions.completed}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ApperIcon name="AlertTriangle" className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-800">Overdue</p>
                <p className="text-xl font-bold text-red-900">{haccpData.correctiveActions.overdue}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HACCPAnalytics;