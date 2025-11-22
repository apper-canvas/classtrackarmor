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

const MultiSiteComparison = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('overallScore');

  useEffect(() => {
    loadComparisonData();
  }, []);

  const loadComparisonData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getMultiSiteComparisons();
      setComparisonData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading comparison data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      
      const options = {
        title: 'Multi-Site Performance Comparison',
        language,
        includeCharts: true
      };

      switch (format) {
        case 'pdf':
          await exportService.generatePDF(comparisonData, options);
          break;
        case 'excel':
          await exportService.generateExcel(comparisonData, options);
          break;
        case 'csv':
          await exportService.generateCSV(comparisonData, options);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBadgeVariant = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'info';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-emerald-600' : 'text-red-600';
  };

  const getMetricValue = (site, metric) => {
    return site[metric] || 0;
  };

  const sortedSites = comparisonData?.sites
    ? [...comparisonData.sites].sort((a, b) => getMetricValue(b, selectedMetric) - getMetricValue(a, selectedMetric))
    : [];

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadComparisonData} />;
  if (!comparisonData) return <ErrorView message="No comparison data available" />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Multi-Site Performance Comparison
          </h1>
          <p className="text-slate-600">
            Comprehensive benchmarking and performance analysis across all sites
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="overallScore">Overall Score</option>
            <option value="haccpScore">HACCP Score</option>
            <option value="complianceRate">Compliance Rate</option>
            <option value="taskCompletion">Task Completion</option>
            <option value="auditScore">Audit Score</option>
          </select>
          
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

      {/* Performance Benchmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <ApperIcon name="Trophy" className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Best HACCP Score</p>
              <p className="text-2xl font-bold text-slate-900">{comparisonData.benchmarks.haccpScore.best}%</p>
              <p className="text-sm text-emerald-600">Industry leading</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ApperIcon name="Target" className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Average Compliance</p>
              <p className="text-2xl font-bold text-slate-900">{comparisonData.benchmarks.compliance.average}%</p>
              <p className="text-sm text-blue-600">Network average</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <ApperIcon name="AlertTriangle" className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <div>
                <p className="text-sm font-medium text-slate-600">Lowest Incidents</p>
                <p className="text-2xl font-bold text-slate-900">{comparisonData.benchmarks.incidents.best}</p>
                <p className="text-sm text-emerald-600">Best safety record</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Best Task Completion</p>
              <p className="text-2xl font-bold text-slate-900">{comparisonData.benchmarks.taskCompletion.best}%</p>
              <p className="text-sm text-purple-600">Operational excellence</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Site Performance Ranking */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Site Performance Ranking</h2>
          <Badge variant="secondary">{sortedSites.length} sites</Badge>
        </div>

        <div className="space-y-4">
          {sortedSites.map((site, index) => (
            <div key={site.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  index === 2 ? 'bg-amber-600' : 'bg-slate-400'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{site.name}</p>
                  <p className="text-sm text-slate-600">{site.city}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-slate-600">Overall</p>
                    <Badge variant={getScoreBadgeVariant(site.overallScore)}>
                      {site.overallScore}%
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">HACCP</p>
                    <Badge variant={getScoreBadgeVariant(site.haccpScore)}>
                      {site.haccpScore}%
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Tasks</p>
                    <Badge variant={getScoreBadgeVariant(site.taskCompletion)}>
                      {site.taskCompletion}%
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Incidents</p>
                    <Badge variant={site.incidents <= 3 ? 'success' : site.incidents <= 6 ? 'warning' : 'danger'}>
                      {site.incidents}
                    </Badge>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-1 ${getTrendColor(site.trend)}`}>
                  <ApperIcon name={getTrendIcon(site.trend)} className="h-4 w-4" />
                </div>
                
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Category Performance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {comparisonData.categories.map((category, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">{category.name} Performance</h3>
              <Badge variant="secondary">{category.sites.length} sites</Badge>
            </div>

            <div className="space-y-4">
              {category.sites.map((site, siteIndex) => (
                <div key={siteIndex} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                      site.rank === 1 ? 'bg-emerald-500' : 
                      site.rank === 2 ? 'bg-blue-500' : 
                      site.rank === 3 ? 'bg-amber-500' : 'bg-slate-400'
                    }`}>
                      {site.rank}
                    </div>
                    <span className="font-medium text-slate-900">{site.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-slate-900">{site.score}%</span>
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          site.score >= 90 ? 'bg-emerald-500' :
                          site.score >= 80 ? 'bg-blue-500' :
                          site.score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${site.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Best Practices */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Best Practices & Knowledge Sharing</h2>
          <Badge variant="info">{comparisonData.bestPractices.length} practices identified</Badge>
        </div>

        <div className="space-y-4">
          {comparisonData.bestPractices.map((practice, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <ApperIcon name="Lightbulb" className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-emerald-900">{practice.practice}</p>
                  <p className="text-sm text-emerald-700">Led by: {practice.leader}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-emerald-600">Adoption Rate</p>
                  <p className="text-lg font-bold text-emerald-900">{practice.adoption}%</p>
                </div>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MultiSiteComparison;